Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath) {
    $src = [System.Drawing.Bitmap]::FromFile($srcPath)
    $w = [int]($src.Width * 0.58)
    $h = [int]($src.Height * 0.44)
    $x = [int]($src.Width * 0.21)
    $y = [int]($src.Height * 0.24)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $src.Clone($rect, $src.PixelFormat)
    $cropped.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    $src.Dispose()
    Write-Host "Created detail: $dstPath"
}

$dir = "c:\Users\abdul\Desktop\wordpress\nesports-pro-store\assets\images\clothing"
Crop-Image (Join-Path $dir "Strength-Club-White-Flat.jpg") (Join-Path $dir "Strength-Club-White-Detail.jpg")
Crop-Image (Join-Path $dir "Strength-Club-Blue-Flat.jpg") (Join-Path $dir "Strength-Club-Blue-Detail.jpg")
Crop-Image (Join-Path $dir "Strength-Club-Red-Flat.jpg") (Join-Path $dir "Strength-Club-Red-Detail.jpg")
