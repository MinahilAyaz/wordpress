$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = "Stop"
$destZip = Join-Path (Get-Location) "nesports-pro.zip"
if (Test-Path $destZip) { Remove-Item $destZip -Force }

$tempDir = Join-Path $env:TEMP ("nesports_pack_" + [System.Guid]::NewGuid().ToString("N"))
$targetDir = Join-Path $tempDir "nesports-pro"
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

Write-Host "Copying plugin files to staging..."
robocopy "nesports-pro-store" $targetDir /E /XD "images_backup" /XF "*.tmp" "*.bak" "Thumbs.db" ".DS_Store" | Out-Null

Write-Host "Creating zip archive: $destZip..."
Compress-Archive -Path $targetDir -DestinationPath $destZip -Force

Remove-Item -Path $tempDir -Recurse -Force
$mb = (Get-Item $destZip).Length / 1MB
Write-Host ("Plugin packed successfully: {0:N2} MB" -f $mb)
