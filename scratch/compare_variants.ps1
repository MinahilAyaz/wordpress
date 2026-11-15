Add-Type -AssemblyName System.Drawing

function Show-OnDark($file, $title) {
    Write-Host "=== $title ==="
    $fg = New-Object System.Drawing.Bitmap($file)
    $bg = New-Object System.Drawing.Bitmap($fg.Width, $fg.Height)
    $g = [System.Drawing.Graphics]::FromImage($bg)
    $g.Clear([System.Drawing.Color]::FromArgb(255, 17, 17, 17)) # #111111
    $g.DrawImage($fg, 0, 0)
    $g.Dispose()

    for ($y = 0; $y -lt $bg.Height; $y += 7) {
        $line = ""
        for ($x = 0; $x -lt $bg.Width; $x += 3) {
            $p = $bg.GetPixel($x, $y)
            $lum = ($p.R + $p.G + $p.B) / 3
            if ($p.R -gt 150 -and $p.G -lt 80 -and $p.B -lt 80) {
                $line += "R" # Red
            } elseif ($lum -gt 180) {
                $line += "W" # White
            } elseif ($lum -gt 60) {
                $line += "." # Visible Gray
            } else {
                $line += " " # Dark background
            }
        }
        Write-Host $line
    }
    $bg.Dispose()
    $fg.Dispose()
}

Show-OnDark "scratch/logo_orig_trans.png" "ORIGINAL (BLACK E)"
Show-OnDark "scratch/logo_red_white_trans.png" "RED & WHITE (WHITE E)"
