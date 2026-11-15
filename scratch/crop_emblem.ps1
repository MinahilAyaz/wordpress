Add-Type -AssemblyName System.Drawing

$src = New-Object System.Drawing.Bitmap("scratch/extracted_footer_logo.jpg")

# Bounding box was 153..298, 128..273 (146 x 146)
$cropW = 146
$cropH = 146
$cropped = New-Object System.Drawing.Bitmap($cropW, $cropH)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), (New-Object System.Drawing.Rectangle(153, 128, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$cropped.Save("scratch/emblem_cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved scratch/emblem_cropped.png ($cropW x $cropH)"

# Let's inspect its colors with a small ASCII render
for ($y = 0; $y -lt $cropH; $y += 6) {
    $line = ""
    for ($x = 0; $x -lt $cropW; $x += 3) {
        $p = $cropped.GetPixel($x, $y)
        $lum = ($p.R + $p.G + $p.B) / 3
        if ($p.R -gt 180 -and $p.G -lt 100 -and $p.B -lt 100) {
            $line += "R"
        } elseif ($lum -lt 100) {
            $line += "B"
        } elseif ($lum -gt 220) {
            $line += " "
        } else {
            $line += "."
        }
    }
    Write-Host $line
}

$cropped.Dispose()
$src.Dispose()
