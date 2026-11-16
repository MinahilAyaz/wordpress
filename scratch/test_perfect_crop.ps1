Add-Type -AssemblyName System.Drawing

function Perfect-Crop-Shirt($srcPath, $outPath, $targetWidth = 820, $canvasSize = 1000) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $srcBmp = New-Object System.Drawing.Bitmap $srcImg
    $w = $srcBmp.Width
    $h = $srcBmp.Height

    # 1. Find bounding box of actual shirt fabric
    # For dark shirts (black, navy, red, green), shirt is R < 200 or not pure white/grey
    # Specifically, the inner card is near-white or light grey (R > 210, G > 210, B > 210)
    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0

    $step = 2
    for ($y = 0; $y -lt $h; $y += $step) {
        for ($x = 0; $x -lt $w; $x += $step) {
            $p = $srcBmp.GetPixel($x, $y)
            # Content is any pixel that is NOT light grey / white (i.e. not R>215 && G>215 && B>215)
            # and has alpha > 30
            $isBackground = ($p.A -lt 30) -or ($p.R -gt 215 -and $p.G -gt 215 -and $p.B -gt 215)
            if (-not $isBackground) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $contentW = [math]::Max(1, $maxX - $minX)
    $contentH = [math]::Max(1, $maxY - $minY)

    # Clean isolated shirt image with transparent/white background:
    # Any pixel in bounding box that was light grey / background gets forced to pure white (255,255,255)
    $cleanShirt = New-Object System.Drawing.Bitmap $contentW, $contentH
    for ($y = 0; $y -lt $contentH; $y++) {
        for ($x = 0; $x -lt $contentW; $x++) {
            $p = $srcBmp.GetPixel($minX + $x, $minY + $y)
            $isBg = ($p.A -lt 30) -or ($p.R -gt 210 -and $p.G -gt 210 -and $p.B -gt 210)
            if ($isBg) {
                $cleanShirt.SetPixel($x, $y, [System.Drawing.Color]::White)
            } else {
                $cleanShirt.SetPixel($x, $y, $p)
            }
        }
    }

    # Scale so content width is exactly $targetWidth
    $scale = $targetWidth / $contentW
    $maxH = $canvasSize - 120
    if (($contentH * $scale) -gt $maxH) {
        $scale = $maxH / $contentH
    }

    $destW = [int]($contentW * $scale)
    $destH = [int]($contentH * $scale)
    $destX = [int](($canvasSize - $destW) / 2)
    $destY = [int](($canvasSize - $destH) / 2)

    # 1000x1000 pure white canvas
    $canvas = New-Object System.Drawing.Bitmap $canvasSize, $canvasSize
    $gfx = [System.Drawing.Graphics]::FromImage($canvas)
    $gfx.Clear([System.Drawing.Color]::White)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle 0, 0, $contentW, $contentH
    $destRect = New-Object System.Drawing.Rectangle $destX, $destY, $destW, $destH

    $gfx.DrawImage($cleanShirt, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $gfx.Dispose()
    $cleanShirt.Dispose()
    $srcBmp.Dispose()
    $srcImg.Dispose()

    $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $canvas.Dispose()

    Write-Host "Cleaned and Normalized: $outPath -> Width=${destW}xHeight=${destH}"
}

$dir = "nesports-pro-store\assets\images\clothing"
Perfect-Crop-Shirt "$dir\Strength-Club-Red-Flat.jpg" "$dir\norm-strength-club-red.jpg"
Perfect-Crop-Shirt "$dir\Procoach-T-Shirt-Green.png" "$dir\norm-pro-coach-green.jpg"
