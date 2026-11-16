$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public class ModelPreparer
{
    // Crop center square of a portrait/landscape image to 1000x1000
    public static void CropSquare(string srcPath, string outPath, int size = 1000)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;
            int cropSize = Math.Min(w, h);
            int cropX = (w - cropSize) / 2;
            int cropY = (h - cropSize) / 3; // slightly higher to capture upper body/shirt

            using (Bitmap square = new Bitmap(size, size, PixelFormat.Format24bppRgb))
            using (Graphics g = Graphics.FromImage(square))
            {
                g.Clear(Color.White);
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                g.DrawImage(src, new Rectangle(0, 0, size, size), new Rectangle(cropX, cropY, cropSize, cropSize), GraphicsUnit.Pixel);

                ImageCodecInfo jpgEncoder = GetJpgEncoder();
                EncoderParameters ep = new EncoderParameters(1);
                ep.Param[0] = new EncoderParameter(Encoder.Quality, 92L);
                square.Save(outPath, jpgEncoder, ep);
            }
        }
    }

    // Make front view of green shirt: take norm-pro-coach-green.jpg, clean out back skull graphic, add small chest logo
    public static void MakeGreenFront(string srcPath, string outPath)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;
            BitmapData data = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int bytes = Math.Abs(data.Stride) * h;
            byte[] buf = new byte[bytes];
            Marshal.Copy(data.Scan0, buf, 0, bytes);

            // Sample clean green color from shoulder area
            int sampleIdx = (int)(h * 0.3) * data.Stride + (int)(w * 0.35) * 4;
            byte sampleB = buf[sampleIdx];
            byte sampleG = buf[sampleIdx + 1];
            byte sampleR = buf[sampleIdx + 2];

            // In the center belly/chest area (x: 340..660, y: 350..700), replace skull/graphic with clean green
            int startX = (int)(w * 0.33);
            int endX = (int)(w * 0.67);
            int startY = (int)(h * 0.35);
            int endY = (int)(h * 0.72);

            for (int y = startY; y < endY; y++)
            {
                int rowIdx = y * data.Stride;
                for (int x = startX; x < endX; x++)
                {
                    int idx = rowIdx + (x * 4);
                    byte b = buf[idx];
                    byte g = buf[idx + 1];
                    byte r = buf[idx + 2];

                    // If pixel is part of white/yellow skull print or dark outline (not clean green)
                    bool isPrint = (r > 130 && g > 130 && b > 130) || (r < 30 && g < 40 && b < 30);
                    if (isPrint)
                    {
                        buf[idx] = sampleB;
                        buf[idx + 1] = sampleG;
                        buf[idx + 2] = sampleR;
                        buf[idx + 3] = 255;
                    }
                }
            }

            Marshal.Copy(buf, 0, data.Scan0, bytes);
            src.UnlockBits(data);

            // Add subtle chest emblem on left chest (x: ~390, y: ~420)
            using (Graphics g = Graphics.FromImage(src))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                using (Font f = new Font("Arial", 11, FontStyle.Bold))
                using (Brush br = new SolidBrush(Color.FromArgb(210, 240, 240, 240)))
                {
                    g.DrawString("PRO COACH", f, br, new PointF(w * 0.37f, h * 0.40f));
                }
            }

            ImageCodecInfo jpgEncoder = GetJpgEncoder();
            EncoderParameters ep = new EncoderParameters(1);
            ep.Param[0] = new EncoderParameter(Encoder.Quality, 92L);
            src.Save(outPath, jpgEncoder, ep);
        }
    }

    // Make red model shot: take model-lift-the-world-back.jpg, crop square, tint black shirt to crimson red
    public static void MakeRedModel(string srcPath, string outPath, int size = 1000)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;
            int cropSize = Math.Min(w, h);
            int cropX = (w - cropSize) / 2;
            int cropY = (int)(h * 0.12);

            using (Bitmap square = new Bitmap(size, size, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(square))
                {
                    g.Clear(Color.Black);
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.DrawImage(src, new Rectangle(0, 0, size, size), new Rectangle(cropX, cropY, cropSize, cropSize), GraphicsUnit.Pixel);
                }

                BitmapData data = square.LockBits(new Rectangle(0, 0, size, size), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int bytes = Math.Abs(data.Stride) * size;
                byte[] buf = new byte[bytes];
                Marshal.Copy(data.Scan0, buf, 0, bytes);

                // Focus on shirt area: center 200..800 x, 250..850 y
                for (int y = (int)(size * 0.25); y < (int)(size * 0.85); y++)
                {
                    int rowIdx = y * data.Stride;
                    for (int x = (int)(size * 0.22); x < (int)(size * 0.78); x++)
                    {
                        int idx = rowIdx + (x * 4);
                        byte b = buf[idx];
                        byte g = buf[idx + 1];
                        byte r = buf[idx + 2];

                        // Target the dark black/charcoal fabric of the t-shirt (low R, low G, low B)
                        // Do not tint white letters (high brightness) or skin (warm tones with R > G > B)
                        bool isWhiteLetter = (r > 190 && g > 190 && b > 190);
                        bool isSkin = (r > 100 && r > g && g > b && (r - b) > 30);
                        bool isDarkFabric = (r < 75 && g < 75 && b < 75 && !isSkin && !isWhiteLetter);

                        if (isDarkFabric)
                        {
                            // Shift to rich crimson red: boost red, reduce green and blue
                            int luminance = (r + g + b) / 3;
                            buf[idx] = (byte)Math.Min(255, luminance / 2);         // Blue
                            buf[idx + 1] = (byte)Math.Min(255, luminance / 2);     // Green
                            buf[idx + 2] = (byte)Math.Min(255, 140 + luminance * 2); // Red
                        }
                    }
                }

                Marshal.Copy(buf, 0, data.Scan0, bytes);
                square.UnlockBits(data);

                ImageCodecInfo jpgEncoder = GetJpgEncoder();
                EncoderParameters ep = new EncoderParameters(1);
                ep.Param[0] = new EncoderParameter(Encoder.Quality, 92L);
                square.Save(outPath, jpgEncoder, ep);
            }
        }
    }

    private static ImageCodecInfo GetJpgEncoder()
    {
        foreach (var codec in ImageCodecInfo.GetImageEncoders())
        {
            if (codec.FormatID == ImageFormat.Jpeg.Guid) return codec;
        }
        return null;
    }
}
"@

Add-Type -TypeDefinition $csharpSource -Language CSharp -ReferencedAssemblies System.Drawing

$clothingDir = "nesports-pro-store\assets\images\clothing"

# 1. Pro Coach Green Front View
[ModelPreparer]::MakeGreenFront("$clothingDir\norm-pro-coach-green.jpg", "$clothingDir\norm-pro-coach-green-front.jpg")

# 2. Pro Coach Green Model Square View
[ModelPreparer]::CropSquare("$clothingDir\model-pro-coach-back.jpg", "$clothingDir\model-pro-coach-green-sq.jpg", 1000)

# 3. Lift The World Crimson Red Model Square View
[ModelPreparer]::MakeRedModel("$clothingDir\model-lift-the-world-back.jpg", "$clothingDir\model-lift-the-world-red-sq.jpg", 1000)

# 4. Pro Coach Red Model Square View
[ModelPreparer]::CropSquare("$clothingDir\Strength-Club-Red-Model.jpg", "$clothingDir\model-pro-coach-red-sq.jpg", 1000)

Write-Host "Model and angle images prepared successfully!"
