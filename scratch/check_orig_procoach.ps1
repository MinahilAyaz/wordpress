Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap("scratch/original_procoach.jpg")
Write-Host "Size: $($b.Width)x$($b.Height)"
$tl = $b.GetPixel(10, 10)
$tr = $b.GetPixel($b.Width - 10, 10)
Write-Host "TL=(A=$($tl.A), R=$($tl.R), G=$($tl.G), B=$($tl.B)), TR=(A=$($tr.A), R=$($tr.R), G=$($tr.G), B=$($tr.B))"
$b.Dispose()
