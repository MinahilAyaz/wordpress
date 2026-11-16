Add-Type -AssemblyName System.Drawing

function Get-TightBounds($path) {
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap $img
    $minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0
    for ($y = 0; $y -lt $bmp.Height; $y += 4) {
        for ($x = 0; $x -lt $bmp.Width; $x += 4) {
            $p = $bmp.GetPixel($x, $y)
            # consider non-white and non-transparent
            $isContent = ($p.A -gt 20) -and (-not ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240))
            if ($isContent) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $contentW = [math]::Max(0, $maxX - $minX)
    $contentH = [math]::Max(0, $maxY - $minY)
    $ratioW = [math]::Round($contentW / $bmp.Width, 3)
    $ratioH = [math]::Round($contentH / $bmp.Height, 3)
    Write-Host "$([System.IO.Path]::GetFileName($path)): Image=$($bmp.Width)x$($bmp.Height), Content=$contentW x $contentH (w%=$($ratioW*100)%, h%=$($ratioH*100)%)"
    $bmp.Dispose()
    $img.Dispose()
}

$shirts = @(
    "nesports-pro-store\assets\images\clothing\Lift-The-World-T-Shirt-Red-1.jpg",
    "nesports-pro-store\assets\images\clothing\Red Pro Coach Iron Tee Back Print.png",
    "nesports-pro-store\assets\images\clothing\Strength-Club-Red-Flat.jpg",
    "nesports-pro-store\assets\images\clothing\Strength-Club-White-Flat.jpg",
    "nesports-pro-store\assets\images\clothing\Lift-The-World-T-Shirt-Black-1.jpg",
    "nesports-pro-store\assets\images\clothing\Strength-Club-Blue-Flat.jpg",
    "nesports-pro-store\assets\images\clothing\Vintage Navy Pro Coach T-Shirt Graphic.png",
    "nesports-pro-store\assets\images\clothing\Procoach-T-Shirt-Green.png"
)

foreach ($s in $shirts) {
    if (Test-Path $s) {
        Get-TightBounds $s
    } else {
        Write-Host "NOT FOUND: $s"
    }
}
