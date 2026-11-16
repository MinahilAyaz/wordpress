Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile("nesports-pro-store\assets\images\belt-crimson-red-800x800.jpg")
Write-Host "belt-crimson-red: $($img.Width)x$($img.Height)"
$img.Dispose()
