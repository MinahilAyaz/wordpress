Add-Type -AssemblyName System.Drawing

function Check-Hero($filename) {
    $path = Join-Path "nesports-pro-store\assets\images" $filename
    $img = [System.Drawing.Image]::FromFile($path)
    Write-Host "$filename : Width=$($img.Width), Height=$($img.Height)"
    $img.Dispose()
}

Check-Hero "hero-slide-knee-wraps.jpg"
Check-Hero "hero-knee-wrap.png"
Check-Hero "hero-slide-lifting-straps.jpg"
Check-Hero "hero-lifting-straps.png"
Check-Hero "hero-slide-speed-ball.jpg"
