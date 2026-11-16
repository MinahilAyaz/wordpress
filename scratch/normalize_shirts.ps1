Add-Type -AssemblyName System.Drawing

function Normalize-Shirt($srcPath, $outPath, $targetContentWidth = 820, $canvasSize = 1000) {
    if (-not (Test-Path $srcPath)) {
        Write-Host "Missing: $srcPath"
        return
    }

    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $srcBmp = New-Object System.Drawing.Bitmap $srcImg

    # Find non-white/non-transparent bounds
    $w = $srcBmp.Width
    $h = $srcBmp.Height
    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0

    $step = [math]::Max(1, [int]($w / 400))
    for ($y = 0; $y -lt $h; $y += $step) {
        for ($x = 0; $x -lt $w; $x += $step) {
            $p = $srcBmp.GetPixel($x, $y)
            $isContent = ($p.A -gt 25) -and (-not ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240))
            if ($isContent) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $contentW = [math]::Max(1, $maxX - $minX)
    $contentH = [math]::Max(1, $maxY - $minY)

    # Scale factor based on width to ensure all shirts have identical width
    $scale = $targetContentWidth / $contentW

    # If scaled height would exceed canvas - 100, scale down slightly
    $maxH = $canvasSize - 120
    if (($contentH * $scale) -gt $maxH) {
        $scale = $maxH / $contentH
    }

    $destW = [int]($contentW * $scale)
    $destH = [int]($contentH * $scale)
    $destX = [int](($canvasSize - $destW) / 2)
    $destY = [int](($canvasSize - $destH) / 2)

    # Create 1000x1000 white canvas
    $canvas = New-Object System.Drawing.Bitmap $canvasSize, $canvasSize
    $gfx = [System.Drawing.Graphics]::FromImage($canvas)
    $gfx.Clear([System.Drawing.Color]::White)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $contentW, $contentH
    $destRect = New-Object System.Drawing.Rectangle $destX, $destY, $destW, $destH

    $gfx.DrawImage($srcBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $gfx.Dispose()
    $srcBmp.Dispose()
    $srcImg.Dispose()

    # Save
    $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $canvas.Dispose()

    Write-Host "Normalized: $outPath (Content: ${contentW}x${contentH} -> ${destW}x${destH} on ${canvasSize}x${canvasSize})"
}

$clothingDir = "nesports-pro-store\assets\images\clothing"

# Normalize Red shirts
Normalize-Shirt "$clothingDir\Lift-The-World-T-Shirt-Red-1.jpg" "$clothingDir\norm-lift-the-world-red.jpg"
Normalize-Shirt "$clothingDir\Red Pro Coach Iron Tee Back Print.png" "$clothingDir\norm-pro-coach-red.jpg"
Normalize-Shirt "$clothingDir\Strength-Club-Red-Flat.jpg" "$clothingDir\norm-strength-club-red.jpg"
Normalize-Shirt "$clothingDir\Strength-Club-Red-Front.jpg" "$clothingDir\norm-strength-club-red-front.jpg"

# Normalize Green shirt
Normalize-Shirt "$clothingDir\Procoach-T-Shirt-Green.png" "$clothingDir\norm-pro-coach-green.jpg"

# Normalize Black shirts
Normalize-Shirt "$clothingDir\Lift-The-World-T-Shirt-Black-1.jpg" "$clothingDir\norm-lift-the-world-black.jpg"
Normalize-Shirt "$clothingDir\Strength-Club-White-Flat.jpg" "$clothingDir\norm-strength-club-black.jpg"
Normalize-Shirt "$clothingDir\Strength-Club-White-Front.jpg" "$clothingDir\norm-strength-club-black-front.jpg"

# Normalize Blue shirts
Normalize-Shirt "$clothingDir\Strength-Club-Blue-Flat.jpg" "$clothingDir\norm-strength-club-blue.jpg"
Normalize-Shirt "$clothingDir\Strength-Club-Blue-Front.jpg" "$clothingDir\norm-strength-club-blue-front.jpg"
Normalize-Shirt "$clothingDir\Vintage Navy Pro Coach T-Shirt Graphic.png" "$clothingDir\norm-pro-coach-navy.jpg"
