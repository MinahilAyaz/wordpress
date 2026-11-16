Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path "C:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images" -Recurse -Include *.jpg,*.png

foreach ($f in $files) {
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
        $red = 0
        $total = 0
        for ($y = 0; $y -lt $bmp.Height; $y += 10) {
            for ($x = 0; $x -lt $bmp.Width; $x += 10) {
                $total++
                $p = $bmp.GetPixel($x, $y)
                if ($p.R -gt 150 -and $p.G -lt 90 -and $p.B -lt 90) {
                    $red++
                }
            }
        }
        $bmp.Dispose()
        $pct = [math]::Round(($red / $total) * 100, 1)
        if ($pct -gt 5) {
            Write-Output "$pct % RED : $($f.Name)"
        }
    } catch {}
}
