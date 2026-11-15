Add-Type -AssemblyName System.Drawing

$files = @(
    'Black NE3Sports Strength Club T-Shirt.png',
    'Lift-The-World-T-Shirt-Black-1.jpg',
    'Anime-6.jpg',
    'Back-Son-Of-The-West.jpg',
    'Procoach-T-Shirt-Green.jpg'
)

foreach ($f in $files) {
    $p = "nesports-pro-store/assets/images/clothing/$f"
    $b = New-Object System.Drawing.Bitmap($p)
    $w = $b.Width
    $h = $b.Height

    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
    # Sample every 5 pixels
    for ($y = 0; $y -lt $h; $y += 5) {
        for ($x = 0; $x -lt $w; $x += 5) {
            $px = $b.GetPixel($x, $y)
            $lum = ($px.R + $px.G + $px.B) / 3
            # Non-white / shirt pixel
            if ($lum -lt 220 -or ($px.A -lt 250 -and $px.A -gt 10)) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $sw = $maxX - $minX + 1
    $sh = $maxY - $minY + 1
    $ratioW = [Math]::Round($sw / $w, 2)
    $ratioH = [Math]::Round($sh / $h, 2)
    Write-Host "$f : Total=$($w)x$($h), Shirt=$($sw)x$($sh) (W%: $ratioW, H%: $ratioH), Bounds=($minX,$minY to $maxX,$maxY)"
    $b.Dispose()
}
