Add-Type -AssemblyName System.Drawing
$check = @("A8-800x800.jpg", "2-1-2-800x800.jpg", "Dip-Belt-5.jpg", "DSC_0180-Copy-scaled-1.jpg", "WhatsApp-Image-2024-07-08-at-19.20.29_4630cc69.jpg")
foreach ($name in $check) {
    $path = "C:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images\$name"
    if (Test-Path $path) {
        $bmp = [System.Drawing.Bitmap]::FromFile($path)
        $red = 0; $total = 0
        for ($y = 0; $y -lt $bmp.Height; $y += 5) {
            for ($x = 0; $x -lt $bmp.Width; $x += 5) {
                $total++
                $p = $bmp.GetPixel($x, $y)
                if ($p.R -gt 140 -and $p.G -lt 80 -and $p.B -lt 80) { $red++ }
            }
        }
        $bmp.Dispose()
        Write-Output "$name : $([math]::Round(($red/$total)*100, 1))% RED"
    }
}
