Add-Type -AssemblyName System.Drawing

function Inspect-File($filename) {
    $path = Join-Path "nesports-pro-store\assets\images" $filename
    if (-not (Test-Path $path)) {
        Write-Host "NOT FOUND: $filename"
        return
    }
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap $img
    
    # Sample non-white pixels
    $w = $bmp.Width
    $h = $bmp.Height
    $rSum = 0; $gSum = 0; $bSum = 0; $count = 0
    $redPixelCount = 0
    $bluePixelCount = 0

    for ($y = 0; $y -lt $h; $y += 5) {
        for ($x = 0; $x -lt $w; $x += 5) {
            $p = $bmp.GetPixel($x, $y)
            if (-not ($p.R -gt 230 -and $p.G -gt 230 -and $p.B -gt 230)) {
                $rSum += $p.R; $gSum += $p.G; $bSum += $p.B; $count++
                if ($p.R -gt 150 -and $p.G -lt 60 -and $p.B -lt 60) { $redPixelCount++ }
                if ($p.B -gt 150 -and $p.R -lt 80) { $bluePixelCount++ }
            }
        }
    }
    $bmp.Dispose()
    $img.Dispose()

    if ($count -gt 0) {
        $avgR = [math]::Round($rSum / $count)
        $avgG = [math]::Round($gSum / $count)
        $avgB = [math]::Round($bSum / $count)
        Write-Host ('{0,-30} size={1}x{2} nonWhite={3} RGB=({4},{5},{6}) RED_PIXELS={7} BLUE_PIXELS={8}' -f $filename, $w, $h, $count, $avgR, $avgG, $avgB, $redPixelCount, $bluePixelCount)
    }
}

Inspect-File "Knee-Wrap-800x800.jpg"
Inspect-File "Kne-wrap-4-800x800.jpg"
Inspect-File "Knee-wrap-1-800x800.jpg"
Inspect-File "Knee-Wrap-9-800x800.jpg"
Inspect-File "hero-knee-wrap.png"
Inspect-File "2-red-800x800.jpg"
Inspect-File "1-800x800.jpg"
Inspect-File "A2.jpg"
Inspect-File "hero-lifting-straps.png"
Inspect-File "hero-slide-lifting-straps.jpg"
Inspect-File "hero-slide-knee-wraps.jpg"
