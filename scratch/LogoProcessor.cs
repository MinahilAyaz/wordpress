using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class LogoProcessor {
    private static void EnqueueIfValid(int x, int y, int w, int h, Bitmap src, bool[,] isBg, Queue<Point> queue) {
        if (x >= 0 && x < w && y >= 0 && y < h && !isBg[x, y]) {
            Color p = src.GetPixel(x, y);
            int lum = (p.R + p.G + p.B) / 3;
            if (lum > 210) {
                isBg[x, y] = true;
                queue.Enqueue(new Point(x, y));
            }
        }
    }

    public static void Process(string srcPath, string outPngPath) {
        using (Bitmap src = new Bitmap(srcPath)) {
            int w = src.Width;
            int h = src.Height;

            bool[,] isBg = new bool[w, h];
            Queue<Point> queue = new Queue<Point>();

            EnqueueIfValid(0, 0, w, h, src, isBg, queue);
            EnqueueIfValid(w - 1, 0, w, h, src, isBg, queue);
            EnqueueIfValid(0, h - 1, w, h, src, isBg, queue);
            EnqueueIfValid(w - 1, h - 1, w, h, src, isBg, queue);

            while (queue.Count > 0) {
                Point pt = queue.Dequeue();
                EnqueueIfValid(pt.X + 1, pt.Y, w, h, src, isBg, queue);
                EnqueueIfValid(pt.X - 1, pt.Y, w, h, src, isBg, queue);
                EnqueueIfValid(pt.X, pt.Y + 1, w, h, src, isBg, queue);
                EnqueueIfValid(pt.X, pt.Y - 1, w, h, src, isBg, queue);
            }

            int minX = w, maxX = 0, minY = h, maxY = 0;
            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    if (!isBg[x, y]) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            int bw = maxX - minX + 1;
            int bh = maxY - minY + 1;
            Console.WriteLine(string.Format("Bounding box: {0},{1} to {2},{3} ({4}x{5})", minX, minY, maxX, maxY, bw, bh));

            using (Bitmap cropped = new Bitmap(bw, bh, PixelFormat.Format32bppArgb)) {
                for (int y = 0; y < bh; y++) {
                    for (int x = 0; x < bw; x++) {
                        int sx = minX + x;
                        int sy = minY + y;
                        if (isBg[sx, sy]) {
                            cropped.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        } else {
                            Color p = src.GetPixel(sx, sy);
                            int lum = (p.R + p.G + p.B) / 3;
                            int alpha = 255;
                            if (lum > 220) {
                                alpha = Math.Max(0, Math.Min(255, (255 - lum) * 12));
                            }
                            cropped.SetPixel(x, y, Color.FromArgb(alpha, p.R, p.G, p.B));
                        }
                    }
                }
                cropped.Save(outPngPath, ImageFormat.Png);
                Console.WriteLine("Saved transparent cropped PNG to " + outPngPath);
            }
        }
    }
}
