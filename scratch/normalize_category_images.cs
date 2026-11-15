using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class ImageNormalizer {
    public static void Normalize(string srcFile, string outFile) {
        using (Bitmap src = new Bitmap(srcFile)) {
            int w = src.Width;
            int h = src.Height;

            // Find shirt bounding box
            int minX = w, maxX = 0, minY = h, maxY = 0;
            for (int y = 0; y < h; y += 4) {
                for (int x = 0; x < w; x += 4) {
                    Color p = src.GetPixel(x, y);
                    int lum = (p.R + p.G + p.B) / 3;
                    if (lum < 225 && p.A > 30) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            int sw = maxX - minX + 1;
            int sh = maxY - minY + 1;

            // Target canvas: 1200 x 1500 (4:5 portrait)
            int targetW = 1200;
            int targetH = 1500;

            // Target shirt width: 980px (81.6% of canvas), shirt centered horizontally
            float scale = 980.0f / sw;
            int destW = 980;
            int destH = (int)(sh * scale);

            int destX = (targetW - destW) / 2;
            int destY = 160; // Consistent collar top position!

            // Background color sampled from top-left of source or light studio gray
            Color bgTop = src.GetPixel(Math.Min(10, w - 1), Math.Min(10, h - 1));
            if (bgTop.A < 50 || (bgTop.R + bgTop.G + bgTop.B) / 3 < 180) {
                bgTop = Color.FromArgb(248, 248, 250);
            }

            using (Bitmap result = new Bitmap(targetW, targetH, PixelFormat.Format24bppRgb))
            using (Graphics g = Graphics.FromImage(result)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                // Fill background
                using (SolidBrush br = new SolidBrush(bgTop)) {
                    g.FillRectangle(br, 0, 0, targetW, targetH);
                }

                // Draw shirt
                Rectangle srcRect = new Rectangle(minX, minY, sw, sh);
                Rectangle destRect = new Rectangle(destX, destY, destW, destH);
                g.DrawImage(src, destRect, srcRect, GraphicsUnit.Pixel);

                result.Save(outFile, ImageFormat.Jpeg);
                Console.WriteLine(string.Format("Normalized {0} -> {1} (Shirt: {2}x{3})", srcFile, outFile, destW, destH));
            }
        }
    }
}
