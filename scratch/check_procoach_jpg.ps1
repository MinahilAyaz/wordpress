Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap("nesports-pro-store/assets/images/clothing/Procoach-T-Shirt-Green.jpg")
Write-Host "Size: $($b.Width)x$($b.Height)"
$c1 = $b.GetPixel(10, 10)
$c2 = $b.GetPixel($b.Width - 10, 10)
Write-Host "Top-Left: R$($c1.R) G$($c1.G) B$($c1.B), Top-Right: R$($c2.R) G$($c2.G) B$($c2.B)"
$b.Dispose()
