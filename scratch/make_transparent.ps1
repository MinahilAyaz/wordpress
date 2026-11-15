Add-Type -AssemblyName System.Drawing

function Remove-Background {
    param(
        [string]$inputPath,
        [string]$outputPath,
        [int]$threshold = 235
    )

    $src = [System.Drawing.Image]::FromFile($inputPath)
    $dest = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
    $g.Dispose()
    $src.Dispose()

    # Sample corner color
    $corner = $dest.GetPixel(5, 5)
    $cr = $corner.R
    $cg = $corner.G
    $cb = $corner.B
    Write-Host "Processing $inputPath : Corner = ($cr, $cg, $cb)"

    # Flood fill or threshold outer background
    # Since the t-shirt is dark (green or red/black), any pixel near the corner color is background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $dest.Width, $dest.Height)
    $bmpData = $dest.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = [Math]::Abs($bmpData.Stride) * $dest.Height
    $rgbValues = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $rgbValues, 0, $bytes)

    # In 32bppArgb, byte order is B, G, R, A
    for ($i = 0; $i -lt $bytes; $i += 4) {
        $b = $rgbValues[$i]
        $gCol = $rgbValues[$i + 1]
        $r = $rgbValues[$i + 2]

        $diffR = [Math]::Abs($r - $cr)
        $diffG = [Math]::Abs($gCol - $cg)
        $diffB = [Math]::Abs($b - $cb)

        # If pixel is close to corner color OR very light gray/white
        if (($diffR -le 25 -and $diffG -le 25 -and $diffB -le 25) -or ($r -ge 235 -and $gCol -ge 235 -and $b -ge 235)) {
            $rgbValues[$i + 3] = 0 # Alpha = 0 (Transparent)
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $bmpData.Scan0, $bytes)
    $dest.UnlockBits($bmpData)

    $dest.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Host "Saved transparent PNG to $outputPath"
}

Remove-Background -inputPath "clothing/Red Pro Coach Iron Tee Back Print.png" -outputPath "scratch/test-red-transparent.png"
Remove-Background -inputPath "clothing/Procoach-T-Shirt-Green.jpg" -outputPath "scratch/test-green-transparent.png"
