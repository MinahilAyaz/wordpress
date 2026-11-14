$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName "System.IO.Compression"
Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$destZip = Join-Path (Get-Location) "nesports-pro.zip"
if (Test-Path $destZip) { Remove-Item $destZip -Force }

$pluginDir = (Resolve-Path "nesports-pro-store").Path
$mode = [System.IO.Compression.ZipArchiveMode]::Create
$archive = [System.IO.Compression.ZipFile]::Open($destZip, $mode)

Write-Host "Packing nesports-pro-store with forward slashes into $destZip..."
$files = Get-ChildItem -Path $pluginDir -Recurse -File
$count = 0
foreach ($f in $files) {
    if ($f.Name -match '\.(tmp|bak|db)$' -or $f.Name -eq '.DS_Store' -or $f.FullName -match 'images_backup') {
        continue
    }
    $rel = $f.FullName.Substring($pluginDir.Length + 1).Replace('\', '/')
    $entryName = "nesports-pro/" + $rel
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $f.FullName, $entryName) | Out-Null
    $count++
}
$archive.Dispose()
$mb = (Get-Item $destZip).Length / 1MB
Write-Host ("Packed {0} files successfully: {1:N2} MB" -f $count, $mb)
