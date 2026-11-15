Add-Type -AssemblyName System.Drawing

foreach ($f in @('scratch/test-red-transparent.png', 'scratch/test-green-transparent.png')) {
    $b = New-Object System.Drawing.Bitmap($f)
    $cCorner = $b.GetPixel(5, 5)
    $cCenter = $b.GetPixel([int]($b.Width / 2), [int]($b.Height / 2))
    Write-Host "$f : Corner Alpha=$($cCorner.A), Center Alpha=$($cCenter.A) RGB=($($cCenter.R),$($cCenter.G),$($cCenter.B))"
    $b.Dispose()
}
