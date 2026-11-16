Add-Type -AssemblyName System.Drawing

function Check-Brain($filename) {
    $path = "C:\Users\abdul\.gemini\antigravity\brain\818c7688-cf50-49cd-94b6-702cb73a4218\" + $filename
    if (-not (Test-Path $path)) {
        Write-Host "Not found: $filename"
        return
    }
    $img = [System.Drawing.Image]::FromFile($path)
    Write-Host "$filename : $($img.Width)x$($img.Height)"
    $img.Dispose()
}

Check-Brain "strength_club_red_flat_v2_1794806735936.jpg"
Check-Brain "strength_club_red_front_v2_1794806917455.jpg"
Check-Brain "strength_club_red_model_v2_1794807048872.jpg"
