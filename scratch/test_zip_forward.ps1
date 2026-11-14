Add-Type -AssemblyName "System.IO.Compression"
Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$destZip = Join-Path (Get-Location) "scratch\test_forward.zip"
if (Test-Path $destZip) { Remove-Item $destZip -Force }

$mode = [System.IO.Compression.ZipArchiveMode]::Create
$archive = [System.IO.Compression.ZipFile]::Open($destZip, $mode)

$entry = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, (Join-Path (Get-Location) "scratch\check_plugins.js"), "nesports-pro/test.js")

$archive.Dispose()
Write-Host "Created test_forward.zip successfully!"
