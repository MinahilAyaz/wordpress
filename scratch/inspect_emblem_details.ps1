Add-Type -AssemblyName System.Drawing

$img = New-Object System.Drawing.Bitmap("scratch/emblem_cropped.png")
Write-Host "Width: $($img.Width), Height: $($img.Height)"

# Inspect corner pixels (which are the background)
$c00 = $img.GetPixel(0, 0)
$c10 = $img.GetPixel($img.Width - 1, 0)
$c01 = $img.GetPixel(0, $img.Height - 1)
$c11 = $img.GetPixel($img.Width - 1, $img.Height - 1)

Write-Host "Corners: (0,0)=R$($c00.R) G$($c00.G) B$($c00.B), (1,0)=R$($c10.R) G$($c10.G) B$($c10.B), (0,1)=R$($c01.R) G$($c01.G) B$($c01.B), (1,1)=R$($c11.R) G$($c11.G) B$($c11.B)"

# Count pixel categories
$bgWhite = 0
$reds = 0
$darks = 0
$whitesInside = 0

for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $p = $img.GetPixel($x, $y)
        $lum = ($p.R + $p.G + $p.B) / 3
        if ($lum -gt 240) {
            $bgWhite++
        } elseif ($p.R -gt 150 -and $p.G -lt 80 -and $p.B -lt 80) {
            $reds++
        } elseif ($lum -lt 80) {
            $darks++
        }
    }
}

Write-Host "Total pixels: $($img.Width * $img.Height), White/Near-white: $bgWhite, Reds: $reds, Darks: $darks"
$img.Dispose()
