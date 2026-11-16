Add-Type -AssemblyName System.Drawing

function Check-Colors($filename) {
    $path = "C:\Users\abdul\.gemini\antigravity\brain\818c7688-cf50-49cd-94b6-702cb73a4218\" + $filename
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap $img
    
    $w = $bmp.Width
    $h = $bmp.Height
    $rSum = 0; $gSum = 0; $bSum = 0; $count = 0
    for ($y = [int]($h*0.3); $y -lt [int]($h*0.7); $y += 5) {
        for ($x = [int]($w*0.3); $x -lt [int]($w*0.7); $x += 5) {
            $p = $bmp.GetPixel($x, $y)
            if (-not ($p.R -gt 230 -and $p.G -gt 230 -and $p.B -gt 230)) {
                $rSum += $p.R; $gSum += $p.G; $bSum += $p.B; $count++
            }
        }
    }
    $avgR = [math]::Round($rSum / $count)
    $avgG = [math]::Round($gSum / $count)
    $avgB = [math]::Round($bSum / $count)
    Write-Host "$filename : Average content RGB=($avgR, $avgG, $avgB)"
    $bmp.Dispose()
    $img.Dispose()
}

Check-Colors "strength_club_red_flat_v2_1794806735936.jpg"
Check-Colors "strength_club_red_front_v2_1794806917455.jpg"
Check-Colors "strength_club_red_model_v2_1794807048872.jpg"
