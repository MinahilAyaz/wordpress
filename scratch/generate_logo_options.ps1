Add-Type -AssemblyName System.Drawing

$src = New-Object System.Drawing.Bitmap("scratch/extracted_footer_logo.jpg")

# 1. Flood-fill from (0,0) to find all external background pixels
$w = $src.Width
$h = $src.Height

$isBg = New-Object 'bool[,]' $w, $h
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
$queue.Enqueue((New-Object System.Drawing.Point(0, 0)))
$queue.Enqueue((New-Object System.Drawing.Point($w - 1, 0)))
$queue.Enqueue((New-Object System.Drawing.Point(0, $h - 1)))
$queue.Enqueue((New-Object System.Drawing.Point($w - 1, $h - 1)))

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $x = $pt.X
    $y = $pt.Y
    if ($x -lt 0 -or $x -ge $w -or $y -lt 0 -or $y -ge $h) { continue }
    if ($isBg[$x, $y]) { continue }
    
    $p = $src.GetPixel($x, $y)
    $lum = ($p.R + $p.G + $p.B) / 3
    # If it is white/near-white background
    if ($lum -gt 230) {
        $isBg[$x, $y] = $true
        $queue.Enqueue((New-Object System.Drawing.Point($x + 1, $y)))
        $queue.Enqueue((New-Object System.Drawing.Point($x - 1, $y)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, $y + 1)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, $y - 1)))
    }
}

# Find bounding box of non-bg pixels
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        if (-not $isBg[$x, $y]) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$bw = $maxX - $minX + 1
$bh = $maxY - $minY + 1
Write-Host "Tight emblem bounding box: X=$minX..$maxX, Y=$minY..$maxY ($bw x $bh)"

# Option A: Original colors, transparent outside
$optA = New-Object System.Drawing.Bitmap($bw, $bh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
# Option B: Black inverted to white, transparent outside
$optB = New-Object System.Drawing.Bitmap($bw, $bh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $bh; $y++) {
    for ($x = 0; $x -lt $bw; $x++) {
        $srcX = $minX + $x
        $srcY = $minY + $y
        if ($isBg[$srcX, $srcY]) {
            $optA.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $optB.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $p = $src.GetPixel($srcX, $srcY)
            $lum = ($p.R + $p.G + $p.B) / 3
            
            # Anti-aliasing alpha near boundary
            $alpha = 255
            if ($lum -gt 230) {
                $alpha = [int]([Math]::Max(0, [Math]::Min(255, (255 - $lum) * 10)))
            }
            
            $optA.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            
            # For Option B, if dark (<100) or gray, map to white
            if ($p.R -gt 150 -and $p.G -lt 80 -and $p.B -lt 80) {
                # Keep red
                $optB.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            } elseif ($lum -lt 120) {
                # Map black to white
                $inv = 255 - $lum
                $optB.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
            } else {
                $optB.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            }
        }
    }
}

$optA.Save("scratch/logo_optA.png", [System.Drawing.Imaging.ImageFormat]::Png)
$optB.Save("scratch/logo_optB.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved scratch/logo_optA.png and scratch/logo_optB.png"

$optA.Dispose()
$optB.Dispose()
$src.Dispose()
