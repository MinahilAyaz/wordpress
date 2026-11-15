using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class GenerateAllDetails {
    public static void Main() {
        string dir = @"c:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images\clothing\";
        
        // Strength Club White (1199x1312)
        CropWithBg(dir + "Black NE3Sports Strength Club T-Shirt.png", dir + "Strength-Club-White-Detail.jpg", 250, 150, 700, 875);
        
        // Strength Club Blue (1199x1312)
        CropWithBg(dir + "Black NE3Sports Strength Club T-Shirt (1).png", dir + "Strength-Club-Blue-Detail.jpg", 250, 150, 700, 875);
        CropWithBg(dir + "Black NE3Sports Strength Club T-Shirt (1).png", dir + "Strength-Club-Blue-Lower.jpg", 300, 350, 600, 750);

        // Strength Club Red (1281x1227)
        CropWithBg(dir + "Black T-Shirt with Red Strength Club Design.png", dir + "Strength-Club-Red-Detail.jpg", 270, 120, 740, 925);
        CropWithBg(dir + "Black T-Shirt with Red Strength Club Design.png", dir + "Strength-Club-Red-Lower.jpg", 320, 320, 640, 800);

        // Pro Coach Green (2500x3125)
        CropWithBg(dir + "Procoach-T-Shirt-Green.jpg", dir + "Procoach-Green-Detail.jpg", 500, 400, 1500, 1875);

        // Pro Coach Red (1199x1312)
        CropWithBg(dir + "Red Pro Coach Iron Tee Back Print.png", dir + "Procoach-Red-Detail.jpg", 250, 150, 700, 875);
        CropWithBg(dir + "Red Pro Coach Iron Tee Back Print.png", dir + "Procoach-Red-Lower.jpg", 300, 350, 600, 750);

        // Pro Coach Navy (1199x1312)
        CropWithBg(dir + "Vintage Navy Pro Coach T-Shirt Graphic.png", dir + "Procoach-Navy-Detail.jpg", 250, 150, 700, 875);
        CropWithBg(dir + "Vintage Navy Pro Coach T-Shirt Graphic.png", dir + "Procoach-Navy-Lower.jpg", 300, 350, 600, 750);

        // Anime 2 (Berserk 2500x3125 approx)
        using (Bitmap b = new Bitmap(dir + "Anime-2.jpg")) {
            int bw = b.Width;
            int bh = b.Height;
            CropWithBg(dir + "Anime-2.jpg", dir + "Anime-2-Detail.jpg", (int)(bw * 0.2), (int)(bh * 0.15), (int)(bw * 0.6), (int)(bw * 0.75));
        }

        // Anime 1 (Black Clover)
        using (Bitmap b = new Bitmap(dir + "Anime-1.jpg")) {
            int bw = b.Width;
            int bh = b.Height;
            CropWithBg(dir + "Anime-1.jpg", dir + "Anime-1-Detail.jpg", (int)(bw * 0.2), (int)(bh * 0.15), (int)(bw * 0.6), (int)(bw * 0.75));
        }

        Console.WriteLine("All color-pure detail crops created successfully!");
    }

    static void CropWithBg(string srcPath, string destPath, int x, int y, int w, int h) {
        using (Bitmap src = new Bitmap(srcPath)) {
            using (Bitmap dest = new Bitmap(1200, 1500)) {
                using (Graphics g = Graphics.FromImage(dest)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.Clear(Color.FromArgb(245, 245, 247));
                    
                    // Clamp crop rect to src bounds
                    int cx = Math.Max(0, Math.Min(x, src.Width - 10));
                    int cy = Math.Max(0, Math.Min(y, src.Height - 10));
                    int cw = Math.Min(w, src.Width - cx);
                    int ch = Math.Min(h, src.Height - cy);
                    
                    g.DrawImage(src, new Rectangle(0, 0, 1200, 1500), new Rectangle(cx, cy, cw, ch), GraphicsUnit.Pixel);
                }
                dest.Save(destPath, ImageFormat.Jpeg);
            }
        }
    }
}
