Add-Type -AssemblyName System.Drawing

function Check-Pixel($filename) {
    $path = Join-Path "nesports-pro-store\assets\images" $filename
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap $img
    
    # Sample point near center
    $p = $bmp.GetPixel([int]($bmp.Width * 0.5), [int]($bmp.Height * 0.45))
    Write-Host "$filename : Width=$($bmp.Width), Height=$($bmp.Height), Color=R:$($p.R) G:$($p.G) B:$($p.B)"
    
    $bmp.Dispose()
    $img.Dispose()
}

Check-Pixel "Gym-Bag-1-2-800x800.jpg"
Check-Pixel "Gym-Bag-1-800x800.jpg"
Check-Pixel "Gym-Bag-8-800x800.jpg"
Check-Pixel "Gym-Bag-9-800x800.jpg"
Check-Pixel "Gym-Bag-3-scaled.jpg"
Check-Pixel "Gym-Bag-4-scaled.jpg"
