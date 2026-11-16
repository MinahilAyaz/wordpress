$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public class RedFrontCreator
{
    public static void CreateRedFront(string srcPath, string outPath)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;
            BitmapData data = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int bytes = Math.Abs(data.Stride) * h;
            byte[] buf = new byte[bytes];
            Marshal.Copy(data.Scan0, buf, 0, bytes);

            // Sample clean crimson red fabric from top-left shoulder area (x: ~320, y: ~220)
            int sampleIdx = (int)(h * 0.22) * data.Stride + (int)(w * 0.32) * 4;
            byte sampleB = buf[sampleIdx];
            byte sampleG = buf[sampleIdx + 1];
            byte sampleR = buf[sampleIdx + 2];

            // In the center area where the white letters are (x: 280..720, y: 220..800)
            int startX = (int)(w * 0.28);
            int endX = (int)(w * 0.72);
            int startY = (int)(h * 0.22);
            int endY = (int)(h * 0.80);

            for (int y = startY; y < endY; y++)
            {
                int rowIdx = y * data.Stride;
                for (int x = startX; x < endX; x++)
                {
                    int idx = rowIdx + (x * 4);
                    byte b = buf[idx];
                    byte g = buf[idx + 1];
                    byte r = buf[idx + 2];

                    // White typography pixels
                    bool isWhiteLetter = (r > 160 && g > 160 && b > 160);
                    if (isWhiteLetter)
                    {
                        // Slight natural noise/texture around the crimson red sample
                        int noise = ((x + y * 7) % 5) - 2;
                        buf[idx] = (byte)Math.Max(0, Math.Min(255, sampleB + noise));
                        buf[idx + 1] = (byte)Math.Max(0, Math.Min(255, sampleG + noise));
                        buf[idx + 2] = (byte)Math.Max(0, Math.Min(255, sampleR + noise));
                        buf[idx + 3] = 255;
                    }
                }
            }

            Marshal.Copy(buf, 0, data.Scan0, bytes);
            src.UnlockBits(data);

            // Add clean minimalist chest print on left chest (x: ~380, y: ~360)
            using (Graphics g = Graphics.FromImage(src))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;

                using (Font f1 = new Font("Arial", 13, FontStyle.Bold))
                using (Font f2 = new Font("Arial", 8, FontStyle.Regular))
                using (Brush br = new SolidBrush(Color.FromArgb(235, 245, 245, 245)))
                {
                    g.DrawString("LIFT", f1, br, new PointF(w * 0.35f, h * 0.33f));
                    g.DrawString("THE WORLD", f2, br, new PointF(w * 0.35f, h * 0.33f + 16));
                }
            }

            ImageCodecInfo jpgEncoder = null;
            foreach (var codec in ImageCodecInfo.GetImageEncoders())
            {
                if (codec.FormatID == ImageFormat.Jpeg.Guid) { jpgEncoder = codec; break; }
            }
            EncoderParameters ep = new EncoderParameters(1);
            ep.Param[0] = new EncoderParameter(Encoder.Quality, 94L);
            src.Save(outPath, jpgEncoder, ep);
        }
    }
}
"@

Add-Type -TypeDefinition $csharpSource -Language CSharp -ReferencedAssemblies System.Drawing

$clothingDir = "nesports-pro-store\assets\images\clothing"
[RedFrontCreator]::CreateRedFront("$clothingDir\norm-lift-the-world-red.jpg", "$clothingDir\norm-lift-the-world-red-front.jpg")
Write-Host "Crimson Red Front Flat Lay rendered!"
