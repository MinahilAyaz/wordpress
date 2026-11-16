$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public class RedStrapsStyler
{
    // Shift blue embroidery/padding on hero-lifting-straps.png to vibrant crimson red
    public static void MakeRedStrapsModel(string srcPath, string outPath, int size = 800)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;

            using (Bitmap square = new Bitmap(size, size, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(square))
                {
                    g.Clear(Color.White);
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.DrawImage(src, new Rectangle(0, 0, size, size), new Rectangle(0, 0, w, h), GraphicsUnit.Pixel);
                }

                BitmapData data = square.LockBits(new Rectangle(0, 0, size, size), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int bytes = Math.Abs(data.Stride) * size;
                byte[] buf = new byte[bytes];
                Marshal.Copy(data.Scan0, buf, 0, bytes);

                for (int y = 0; y < size; y++)
                {
                    int rowIdx = y * data.Stride;
                    for (int x = 0; x < size; x++)
                    {
                        int idx = rowIdx + (x * 4);
                        byte b = buf[idx];
                        byte g = buf[idx + 1];
                        byte r = buf[idx + 2];
                        byte a = buf[idx + 3];

                        // Target blue pixels of the straps / logo (B > 80 and B > R + 30)
                        if (b > 70 && b > (r + 20) && b > (g + 10))
                        {
                            // Shift blue to bright energetic crimson red (high R, low G, low B)
                            buf[idx] = (byte)Math.Min(255, g / 2);        // Blue
                            buf[idx + 1] = (byte)Math.Min(255, g / 2);    // Green
                            buf[idx + 2] = (byte)Math.Min(255, b * 1.35); // Red
                        }
                    }
                }

                Marshal.Copy(buf, 0, data.Scan0, bytes);
                square.UnlockBits(data);

                ImageCodecInfo jpgEncoder = null;
                foreach (var codec in ImageCodecInfo.GetImageEncoders())
                {
                    if (codec.FormatID == ImageFormat.Jpeg.Guid) { jpgEncoder = codec; break; }
                }
                EncoderParameters ep = new EncoderParameters(1);
                ep.Param[0] = new EncoderParameter(Encoder.Quality, 94L);
                square.Save(outPath, jpgEncoder, ep);
            }
        }
    }

    // Make clean alternative angle of 2-red-800x800.jpg (rotated / flipped studio angle)
    public static void MakeRedStrapsAngle(string srcPath, string outPath)
    {
        using (Bitmap src = new Bitmap(srcPath))
        using (Bitmap dest = new Bitmap(800, 800, PixelFormat.Format24bppRgb))
        using (Graphics g = Graphics.FromImage(dest))
        {
            g.Clear(Color.White);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;

            // Flip horizontally to show other strap angle
            src.RotateFlip(RotateFlipType.RotateNoneFlipX);
            g.DrawImage(src, new Rectangle(0, 0, 800, 800));

            ImageCodecInfo jpgEncoder = null;
            foreach (var codec in ImageCodecInfo.GetImageEncoders())
            {
                if (codec.FormatID == ImageFormat.Jpeg.Guid) { jpgEncoder = codec; break; }
            }
            EncoderParameters ep = new EncoderParameters(1);
            ep.Param[0] = new EncoderParameter(Encoder.Quality, 94L);
            dest.Save(outPath, jpgEncoder, ep);
        }
    }
}
"@

Add-Type -TypeDefinition $csharpSource -Language CSharp -ReferencedAssemblies System.Drawing

$imgDir = "nesports-pro-store\assets\images"
[RedStrapsStyler]::MakeRedStrapsModel("$imgDir\hero-lifting-straps.png", "$imgDir\model-lifting-straps-red.jpg", 800)
[RedStrapsStyler]::MakeRedStrapsAngle("$imgDir\2-red-800x800.jpg", "$imgDir\straps-red-angle-800x800.jpg")
Write-Host "Red Straps Model and Angle created!"
