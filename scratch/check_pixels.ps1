Add-Type -AssemblyName System.Drawing

$files = @('Procoach-T-Shirt-Green.jpg', 'Red Pro Coach Iron Tee Back Print.png', 'Black NE3Sports Strength Club T-Shirt.png')
foreach ($f in $files) {
    $path = Join-Path "clothing" $f
    $bmp = New-Object System.Drawing.Bitmap($path)
    $c = $bmp.GetPixel(5, 5)
    Write-Host "$f : Size=$($bmp.Width)x$($bmp.Height), Pixel(5,5) = R:$($c.R) G:$($c.G) B:$($c.B) A:$($c.A)"
    $bmp.Dispose()
}
