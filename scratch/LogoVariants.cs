using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class LogoVariants {
    private static void Enqueue(int x, int y, int w, int h, Bitmap src, bool[,] isBg, Queue<Point> queue) {
        if (x >= 0 && x < w && y >= 0 && y < h && !isBg[x, y]) {
            Color p = src.GetPixel(x, y);
            int lum = (p.R + p.G + p.B) / 3;
            if (lum > 210) {
                isBg[x, y] = true;
                queue.Enqueue(new Point(x, y));
            }
        }
    }

    public static void Generate(string srcPath) {
        using (Bitmap src = new Bitmap(srcPath)) {
            int w = src.Width;
            int h = src.Height;

            bool[,] isBg = new bool[w, h];
            Queue<Point> queue = new Queue<Point>();

            Enqueue(0, 0, w, h, src, isBg, queue);
            Enqueue(w - 1, 0, w, h, src, isBg, queue);
            Enqueue(0, h - 1, w, h, src, isBg, queue);
            Enqueue(w - 1, h - 1, w, h, src, isBg, queue);

            while (queue.Count > 0) {
                Point pt = queue.Dequeue();
                Enqueue(pt.X + 1, pt.Y, w, h, src, isBg, queue);
                Enqueue(pt.X - 1, pt.Y, w, h, src, isBg, queue);
                Enqueue(pt.X, pt.Y + 1, w, h, src, isBg, queue);
                Enqueue(pt.X, pt.Y - 1, w, h, src, isBg, queue);
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

            using (Bitmap bmpOrig = new Bitmap(bw, bh, PixelFormat.Format32bppArgb))
            using (Bitmap bmpRedWhite = new Bitmap(bw, bh, PixelFormat.Format32bppArgb))
            {
                for (int y = 0; y < bh; y++) {
                    for (int x = 0; x < bw; x++) {
                        int sx = minX + x;
                        int sy = minY + y;
                        if (isBg[sx, sy]) {
                            bmpOrig.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                            bmpRedWhite.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        } else {
                            Color p = src.GetPixel(sx, sy);
                            int lum = (p.R + p.G + p.B) / 3;
                            int alpha = 255;
                            if (lum > 225) {
                                alpha = Math.Max(0, Math.Min(255, (255 - lum) * 12));
                            }

                            bmpOrig.SetPixel(x, y, Color.FromArgb(alpha, p.R, p.G, p.B));

                            if (p.R > 140 && p.G < 90 && p.B < 90) {
                                bmpRedWhite.SetPixel(x, y, Color.FromArgb(alpha, p.R, p.G, p.B));
                            } else if (lum < 110) {
                                bmpRedWhite.SetPixel(x, y, Color.FromArgb(alpha, 255, 255, 255));
                            } else {
                                bmpRedWhite.SetPixel(x, y, Color.FromArgb(alpha, p.R, p.G, p.B));
                            }
                        }
                    }
                }

                bmpOrig.Save("scratch/logo_orig_trans.png", ImageFormat.Png);
                bmpRedWhite.Save("scratch/logo_red_white_trans.png", ImageFormat.Png);
                Console.WriteLine("Saved scratch/logo_orig_trans.png and scratch/logo_red_white_trans.png");
            }
        }
    }
}
