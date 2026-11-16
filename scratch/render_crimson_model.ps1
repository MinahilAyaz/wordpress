$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public class RedShirtStyler
{
    public static void CreateCrimsonModel(string srcModelPath, string outPath, int size = 1000)
    {
        using (Bitmap src = new Bitmap(srcModelPath))
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

                // Precise bounds of the t-shirt on the lifter:
                // Neck is around y: 280, bottom of shirt is around y: 880
                // Left shoulder/sleeve is around x: 190, right shoulder/sleeve is around x: 810
                for (int y = (int)(size * 0.28); y < (int)(size * 0.88); y++)
                {
                    int rowIdx = y * data.Stride;
                    for (int x = (int)(size * 0.18); x < (int)(size * 0.82); x++)
                    {
                        int idx = rowIdx + (x * 4);
                        byte b = buf[idx];
                        byte g = buf[idx + 1];
                        byte r = buf[idx + 2];

                        // Detect white text
                        bool isWhiteText = (r > 175 && g > 175 && b > 175);
                        if (isWhiteText) continue;

                        // Detect skin (arms / neck)
                        bool isSkin = (r > 95 && r > (g + 15) && g > b);
                        if (isSkin) continue;

                        // Detect dark gym background on the outer edges (pillars/power rack)
                        // Lifter torso is centered: distance from center X
                        double distFromCenter = Math.Abs(x - (size * 0.5));
                        double maxTorsoDist = (y < (size * 0.55)) ? (size * 0.32) : (size * 0.24);
                        if (distFromCenter > maxTorsoDist) continue;

                        // Target the black/charcoal cotton fabric
                        bool isFabric = (r < 85 && g < 85 && b < 85);
                        if (isFabric)
                        {
                            int l = (r + g + b) / 3;
                            // Realistic crimson red modulation:
                            // Dark folds: deep crimson burgundy (130, 20, 25)
                            // Midtone: rich gym crimson (175, 30, 38)
                            // Highlights: bright crimson (215, 45, 50)
                            byte newR = (byte)Math.Min(255, 125 + (int)(l * 1.35));
                            byte newG = (byte)Math.Min(255, 12 + (int)(l * 0.35));
                            byte newB = (byte)Math.Min(255, 18 + (int)(l * 0.38));

                            buf[idx] = newB;
                            buf[idx + 1] = newG;
                            buf[idx + 2] = newR;
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
}
"@

Add-Type -TypeDefinition $csharpSource -Language CSharp -ReferencedAssemblies System.Drawing

$clothingDir = "nesports-pro-store\assets\images\clothing"
[RedShirtStyler]::CreateCrimsonModel("$clothingDir\model-lift-the-world-back.jpg", "$clothingDir\model-lift-the-world-red-sq.jpg", 1000)
Write-Host "Crimson Red Lifter Model rendered!"
