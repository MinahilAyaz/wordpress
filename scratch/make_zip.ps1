param(
    [string]$sourceDir = "C:\Users\abdul\Desktop\wordpress\scratch\nesports-updater-v8",
    [string]$zipPath = "C:\Users\abdul\Desktop\wordpress\scratch\nesports-updater-v8.zip"
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $zipPath)
Write-Host "Success: $(Test-Path $zipPath) Size: $((Get-Item $zipPath).Length)"
