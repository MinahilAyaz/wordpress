Add-Type -AssemblyName System.Drawing

function Check-Bounds-Detail($path) {
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap $img
    
    # Check 4 corners
    $c1 = $bmp.GetPixel(5, 5)
    $c2 = $bmp.GetPixel($bmp.Width - 5, 5)
    $c3 = $bmp.GetPixel(5, $bmp.Height - 5)
    $c4 = $bmp.GetPixel($bmp.Width - 5, $bmp.Height - 5)
    
    Write-Host "$path corners: ($($c1.R),$($c1.G),$($c1.B)), ($($c2.R),$($c2.G),$($c2.B)), ($($c3.R),$($c3.G),$($c3.B)), ($($c4.R),$($c4.G),$($c4.B))"
    $bmp.Dispose()
    $img.Dispose()
}

Check-Bounds-Detail "nesports-pro-store\assets\images\clothing\Strength-Club-Red-Flat.jpg"
Check-Bounds-Detail "nesports-pro-store\assets\images\clothing\norm-strength-club-red.jpg"
Check-Bounds-Detail "nesports-pro-store\assets\images\clothing\norm-pro-coach-green.jpg"
