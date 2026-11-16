Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images\clothing\Strength-Club-Red-Flat.jpg")
$red = 0; $black = 0; $total = 0
for ($y = 0; $y -lt $bmp.Height; $y += 5) {
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        $total++
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 130 -and $p.G -lt 80 -and $p.B -lt 80) { $red++ }
        if ($p.R -lt 50 -and $p.G -lt 50 -and $p.B -lt 50) { $black++ }
    }
}
$bmp.Dispose()
Write-Output "Strength-Club-Red-Flat: RED=$red ($([math]::Round(($red/$total)*100, 1))%), BLACK=$black ($([math]::Round(($black/$total)*100, 1))%)"
