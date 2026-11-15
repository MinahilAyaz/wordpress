Add-Type -AssemblyName System.Drawing

$files = @(
    'Black NE3Sports Strength Club T-Shirt.png',
    'Lift-The-World-T-Shirt-Black-1.jpg',
    'Anime-6.jpg',
    'Back-Son-Of-The-West.jpg',
    'Procoach-T-Shirt-Green.jpg',
    'Procoach-T-Shirt-Green.png'
)

foreach ($f in $files) {
    $p = "nesports-pro-store/assets/images/clothing/$f"
    if (Test-Path $p) {
        $b = New-Object System.Drawing.Bitmap($p)
        $tl = $b.GetPixel(10, 10)
        $tr = $b.GetPixel($b.Width - 10, 10)
        Write-Host "$f : Size=$($b.Width)x$($b.Height), TL=(A=$($tl.A), R=$($tl.R), G=$($tl.G), B=$($tl.B)), TR=(A=$($tr.A), R=$($tr.R), G=$($tr.G), B=$($tr.B))"
        $b.Dispose()
    }
}
