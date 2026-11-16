Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images\belt-crimson-red-800x800.jpg")
$red = 0
$black = 0
$blue = 0
for ($y = 0; $y -lt $bmp.Height; $y += 5) {
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 130 -and $p.G -lt 80 -and $p.B -lt 80) { $red++ }
        if ($p.R -lt 50 -and $p.G -lt 50 -and $p.B -lt 50) { $black++ }
        if ($p.B -gt 130 -and $p.R -lt 80) { $blue++ }
    }
}
$bmp.Dispose()
Write-Output "RED: $red | BLACK: $black | BLUE: $blue"
