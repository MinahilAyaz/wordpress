using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class CropDetails {
    public static void Main() {
        string dir = @"c:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images\clothing\";
        
        CropOne(dir + "Lift-The-World-T-Shirt-Black-1.jpg", dir + "Lift-The-World-T-Shirt-Black-Lower.jpg", 1100, 2200, 2200, 2750);
        CropOne(dir + "Lift-The-World-T-Shirt-Red-1.jpg", dir + "Lift-The-World-T-Shirt-Red-Lower.jpg", 1100, 2200, 2200, 2750);
        Console.WriteLine("Done cropping lower details!");
    }

    static void CropOne(string srcPath, string destPath, int x, int y, int w, int h) {
        using (Bitmap src = new Bitmap(srcPath)) {
            using (Bitmap dest = new Bitmap(1200, 1500)) {
                using (Graphics g = Graphics.FromImage(dest)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.Clear(Color.FromArgb(245, 245, 247));
                    g.DrawImage(src, new Rectangle(0, 0, 1200, 1500), new Rectangle(x, y, w, h), GraphicsUnit.Pixel);
                }
                dest.Save(destPath, ImageFormat.Jpeg);
            }
        }
    }
}
