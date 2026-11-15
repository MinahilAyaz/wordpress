Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap("scratch/extracted_footer_logo.jpg")
$cCorner = $b.GetPixel(5, 5)
$cCenter = $b.GetPixel([int]($b.Width / 2), [int]($b.Height / 2))
Write-Host "Size: $($b.Width)x$($b.Height)"
Write-Host "Corner: RGB=($($cCorner.R),$($cCorner.G),$($cCorner.B))"
Write-Host "Center: RGB=($($cCenter.R),$($cCenter.G),$($cCenter.B))"
$b.Dispose()
