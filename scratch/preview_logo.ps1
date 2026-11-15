Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap("nesports-pro-store/assets/images/logo-1.png")
Write-Host "Width: $($b.Width), Height: $($b.Height)"
for ($y = 0; $y -lt $b.Height; $y += [Math]::Max(1, [int]($b.Height / 20))) {
    $line = ""
    for ($x = 0; $x -lt $b.Width; $x += [Math]::Max(1, [int]($b.Width / 60))) {
        $p = $b.GetPixel($x, $y)
        if ($p.A -lt 50) { $line += " " }
        elseif ($p.R -gt 180 -and $p.G -lt 100) { $line += "R" }
        elseif (($p.R + $p.G + $p.B) / 3 -lt 100) { $line += "B" }
        else { $line += "W" }
    }
    Write-Host $line
}
$b.Dispose()
