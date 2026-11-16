Add-Type -AssemblyName System.Drawing
$dir = "nesports-pro-store\assets\images"
Get-ChildItem $dir -Filter "*bag*.jpg" | ForEach-Object {
    $bmp = [System.Drawing.Bitmap]::FromFile($_.FullName)
    $w = $bmp.Width
    $h = $bmp.Height
    $rSum = 0; $gSum = 0; $bSum = 0; $count = 0
    for ($x = [int]($w*0.35); $x -lt [int]($w*0.65); $x += 10) {
        for ($y = [int]($h*0.35); $y -lt [int]($h*0.65); $y += 10) {
            $p = $bmp.GetPixel($x, $y)
            if (-not ($p.R -gt 230 -and $p.G -gt 230 -and $p.B -gt 230)) {
                $rSum += $p.R; $gSum += $p.G; $bSum += $p.B; $count++
            }
        }
    }
    $bmp.Dispose()
    if ($count -gt 0) {
        $avgR = [math]::Round($rSum / $count)
        $avgG = [math]::Round($gSum / $count)
        $avgB = [math]::Round($bSum / $count)
        Write-Host ('{0,-25} size={1}x{2} nonWhite={3} RGB=({4},{5},{6})' -f $_.Name, $w, $h, $count, $avgR, $avgG, $avgB)
    } else {
        Write-Host ('{0,-25} pure white' -f $_.Name)
    }
}
