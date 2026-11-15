Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem "clothing" -Filter "*.png"
foreach ($f in $files) {
    $bmp = New-Object System.Drawing.Bitmap($f.FullName)
    $c = $bmp.GetPixel(5, 5)
    Write-Host "$($f.Name) : Alpha=$($c.A), RGB=($($c.R),$($c.G),$($c.B))"
    $bmp.Dispose()
}
