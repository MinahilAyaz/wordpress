Add-Type -AssemblyName System.Drawing

$files = @(
    "C:\Users\abdul\.gemini\antigravity\brain\818c7688-cf50-49cd-94b6-702cb73a4218\crimson_red_oversized_lifter_shirt_1794825580341.jpg",
    "C:\Users\abdul\.gemini\antigravity\brain\818c7688-cf50-49cd-94b6-702cb73a4218\red_oversized_tee_front_1794825621107.jpg",
    "C:\Users\abdul\.gemini\antigravity\brain\818c7688-cf50-49cd-94b6-702cb73a4218\crimson_red_lever_belt_1794825606630.jpg"
)

foreach ($f in $files) {
    $bmp = [System.Drawing.Bitmap]::FromFile($f)
    $red = 0; $black = 0; $total = 0
    for ($y = 0; $y -lt $bmp.Height; $y += 5) {
        for ($x = 0; $x -lt $bmp.Width; $x += 5) {
            $total++
            $p = $bmp.GetPixel($x, $y)
            if ($p.R -gt 130 -and $p.G -lt 80 -and $p.B -lt 80) { $red++ }
            if ($p.R -lt 40 -and $p.G -lt 40 -and $p.B -lt 40) { $black++ }
        }
    }
    $bmp.Dispose()
    $name = [System.IO.Path]::GetFileName($f)
    Write-Output "$name : RED=$([math]::Round(($red/$total)*100, 1))% | BLACK=$([math]::Round(($black/$total)*100, 1))%"
}
