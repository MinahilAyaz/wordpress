$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public class ImageNormalizer
{
    public static void NormalizeShirt(string srcPath, string outPath, int targetWidth, int canvasSize)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;

            BitmapData data = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int bytes = Math.Abs(data.Stride) * h;
            byte[] buffer = new byte[bytes];
            Marshal.Copy(data.Scan0, buffer, 0, bytes);
            src.UnlockBits(data);

            int minX = w, maxX = 0, minY = h, maxY = 0;
            int stride = data.Stride;

            for (int y = 0; y < h; y += 2)
            {
                int rowIdx = y * stride;
                for (int x = 0; x < w; x += 2)
                {
                    int idx = rowIdx + (x * 4);
                    byte b = buffer[idx];
                    byte g = buffer[idx + 1];
                    byte r = buffer[idx + 2];
                    byte a = buffer[idx + 3];

                    bool isBg = (a < 30) || (r > 215 && g > 215 && b > 215);
                    if (!isBg)
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            int contentW = Math.Max(1, maxX - minX);
            int contentH = Math.Max(1, maxY - minY);

            Bitmap clean = new Bitmap(contentW, contentH, PixelFormat.Format32bppArgb);
            BitmapData cleanData = clean.LockBits(new Rectangle(0, 0, contentW, contentH), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            int cleanBytes = Math.Abs(cleanData.Stride) * contentH;
            byte[] cleanBuffer = new byte[cleanBytes];

            for (int y = 0; y < contentH; y++)
            {
                int cleanRowIdx = y * cleanData.Stride;
                int srcRowIdx = (minY + y) * stride;
                for (int x = 0; x < contentW; x++)
                {
                    int cleanIdx = cleanRowIdx + (x * 4);
                    int srcIdx = srcRowIdx + ((minX + x) * 4);

                    byte b = buffer[srcIdx];
                    byte g = buffer[srcIdx + 1];
                    byte r = buffer[srcIdx + 2];
                    byte a = buffer[srcIdx + 3];

                    bool isBg = (a < 30) || (r > 215 && g > 215 && b > 215);
                    if (isBg)
                    {
                        cleanBuffer[cleanIdx] = 255;
                        cleanBuffer[cleanIdx + 1] = 255;
                        cleanBuffer[cleanIdx + 2] = 255;
                        cleanBuffer[cleanIdx + 3] = 255;
                    }
                    else
                    {
                        cleanBuffer[cleanIdx] = b;
                        cleanBuffer[cleanIdx + 1] = g;
                        cleanBuffer[cleanIdx + 2] = r;
                        cleanBuffer[cleanIdx + 3] = 255;
                    }
                }
            }
            Marshal.Copy(cleanBuffer, 0, cleanData.Scan0, cleanBytes);
            clean.UnlockBits(cleanData);

            double scale = (double)targetWidth / contentW;
            int maxH = canvasSize - 120;
            if ((contentH * scale) > maxH)
            {
                scale = (double)maxH / contentH;
            }

            int destW = (int)(contentW * scale);
            int destH = (int)(contentH * scale);
            int destX = (canvasSize - destW) / 2;
            int destY = (canvasSize - destH) / 2;

            using (Bitmap canvas = new Bitmap(canvasSize, canvasSize, PixelFormat.Format24bppRgb))
            using (Graphics g = Graphics.FromImage(canvas))
            {
                g.Clear(Color.White);
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                g.DrawImage(clean, new Rectangle(destX, destY, destW, destH), new Rectangle(0, 0, contentW, contentH), GraphicsUnit.Pixel);

                ImageCodecInfo jpgEncoder = null;
                foreach (var codec in ImageCodecInfo.GetImageEncoders())
                {
                    if (codec.FormatID == ImageFormat.Jpeg.Guid)
                    {
                        jpgEncoder = codec;
                        break;
                    }
                }
                EncoderParameters ep = new EncoderParameters(1);
                ep.Param[0] = new EncoderParameter(Encoder.Quality, 92L);

                canvas.Save(outPath, jpgEncoder, ep);
            }
            clean.Dispose();
        }
    }
}
"@

Add-Type -TypeDefinition $csharpSource -Language CSharp -ReferencedAssemblies System.Drawing

$clothingDir = "nesports-pro-store\assets\images\clothing"

[ImageNormalizer]::NormalizeShirt("$clothingDir\Lift-The-World-T-Shirt-Red-1.jpg", "$clothingDir\norm-lift-the-world-red.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Red Pro Coach Iron Tee Back Print.png", "$clothingDir\norm-pro-coach-red.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Strength-Club-Red-Flat.jpg", "$clothingDir\norm-strength-club-red.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Strength-Club-Red-Front.jpg", "$clothingDir\norm-strength-club-red-front.jpg", 820, 1000)

[ImageNormalizer]::NormalizeShirt("$clothingDir\Procoach-T-Shirt-Green.png", "$clothingDir\norm-pro-coach-green.jpg", 820, 1000)

[ImageNormalizer]::NormalizeShirt("$clothingDir\Lift-The-World-T-Shirt-Black-1.jpg", "$clothingDir\norm-lift-the-world-black.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Black NE3Sports Strength Club T-Shirt.png", "$clothingDir\norm-strength-club-black.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Strength-Club-White-Front.jpg", "$clothingDir\norm-strength-club-black-front.jpg", 820, 1000)

[ImageNormalizer]::NormalizeShirt("$clothingDir\Strength-Club-Blue-Flat.jpg", "$clothingDir\norm-strength-club-blue.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Strength-Club-Blue-Front.jpg", "$clothingDir\norm-strength-club-blue-front.jpg", 820, 1000)
[ImageNormalizer]::NormalizeShirt("$clothingDir\Vintage Navy Pro Coach T-Shirt Graphic.png", "$clothingDir\norm-pro-coach-navy.jpg", 820, 1000)

Write-Host "All shirts normalized in C# successfully!"
