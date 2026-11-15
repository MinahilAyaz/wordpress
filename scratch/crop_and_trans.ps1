Add-Type -AssemblyName System.Drawing

$src = New-Object System.Drawing.Bitmap("scratch/extracted_footer_logo.jpg")
$w = $src.Width
$h = $src.Height

$minX = $w; $maxX = 0; $minY = $h; $maxY = 0
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Emblem bounding box: X=$minX..$maxX, Y=$minY..$maxY, Width=$($maxX - $minX + 1), Height=$($maxY - $minY + 1)"

# Sample non-white colors
$colorCounts = @{}
for ($y = $minY; $y -le $maxY; $y++) {
    for ($x = $minX; $x -le $maxX; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.R -lt 245 -or $p.G -lt 245 -or $p.B -lt 245) {
            # Bucketed color
            $r = [Math]::Round($p.R / 32) * 32
            $g = [Math]::Round($p.G / 32) * 32
            $b = [Math]::Round($p.B / 32) * 32
            $key = "R$r G$g B$b"
            $colorCounts[$key] = ($colorCounts[$key] + 1)
        }
    }
}

$colorCounts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Key): $($_.Value)"
}

$src.Dispose()
