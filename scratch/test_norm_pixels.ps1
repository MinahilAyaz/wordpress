Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile("nesports-pro-store\assets\images\clothing\norm-strength-club-red.jpg")
$bmp = New-Object System.Drawing.Bitmap $img

$pts = @(
    @(50, 50),
    @(100, 100),
    @(900, 100),
    @(50, 500),
    @(950, 500),
    @(50, 900),
    @(950, 900)
)

foreach ($pt in $pts) {
    $p = $bmp.GetPixel($pt[0], $pt[1])
    Write-Host "Pixel at ($($pt[0]), $($pt[1])): R=$($p.R) G=$($p.G) B=$($p.B)"
}

$bmp.Dispose()
$img.Dispose()
