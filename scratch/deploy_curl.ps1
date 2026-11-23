$ErrorActionPreference = "Stop"

$Site = "https://www.nesports3.com"
$User = "NESports"
$Pass = 'NES3@1122$PK'
$CookieFile = "c:\Users\abdul\Desktop\wordpress\scratch\cookies.txt"
$ZipFile = "c:\Users\abdul\Desktop\wordpress\scratch\nesports-updater-v42.zip"

Write-Host "1. Logging into WordPress with curl..."
if (Test-Path $CookieFile) { Remove-Item $CookieFile -Force }

curl.exe -s -c $CookieFile -b $CookieFile -L "$Site/wp-login.php" `
    -d "log=$User&pwd=$Pass&rememberme=forever&wp-submit=Log+In&redirect_to=$Site/wp-admin/" > $null

Write-Host "2. Getting upload nonce..."
$uploadPage = curl.exe -s -c $CookieFile -b $CookieFile -L "$Site/wp-admin/plugin-install.php?tab=upload"
$nonceMatch = [regex]::Match($uploadPage, 'name="_wpnonce"\s+value="([^"]+)"')
if (-not $nonceMatch.Success) {
    Write-Error "Failed to obtain upload nonce"
    exit 1
}
$nonce = $nonceMatch.Groups[1].Value
Write-Host "Nonce found: $nonce"

Write-Host "3. Uploading plugin zip..."
$uploadResult = curl.exe -s -c $CookieFile -b $CookieFile -L "$Site/wp-admin/update.php?action=upload-plugin" `
    -F "_wpnonce=$nonce" `
    -F "_wp_http_referer=/wp-admin/plugin-install.php?tab=upload" `
    -F "pluginzip=@$ZipFile;type=application/zip" `
    -F "install-plugin-submit=Install Now"

Write-Host "4. Checking for activation link..."
$actMatch = [regex]::Match($uploadResult, 'href="([^"]*action=activate[^"]*plugin=[^"]*)"')
if ($actMatch.Success) {
    $actUrl = [System.Net.WebUtility]::HtmlDecode($actMatch.Groups[1].Value)
    if (-not $actUrl.StartsWith("http")) {
        $actUrl = "$Site/wp-admin/$actUrl"
    }
    Write-Host "Activating plugin: $actUrl"
    curl.exe -s -c $CookieFile -b $CookieFile -L $actUrl > $null
    Write-Host "Plugin activated successfully!"
} else {
    Write-Host "Activate link not in upload page, checking plugins list..."
    $pluginsPage = curl.exe -s -c $CookieFile -b $CookieFile -L "$Site/wp-admin/plugins.php"
    $listMatch = [regex]::Match($pluginsPage, 'href="([^"]*action=activate[^"]*plugin=nesports-updater-v42[^"]*)"')
    if ($listMatch.Success) {
        $actUrl = [System.Net.WebUtility]::HtmlDecode($listMatch.Groups[1].Value)
        if (-not $actUrl.StartsWith("http")) {
            $actUrl = "$Site/wp-admin/$actUrl"
        }
        Write-Host "Activating from plugins list: $actUrl"
        curl.exe -s -c $CookieFile -b $CookieFile -L $actUrl > $null
        Write-Host "Plugin activated successfully!"
    } else {
        Write-Host "Plugin might already be active!"
    }
}

Write-Host "5. Verifying live website..."
$homeStatus = curl.exe -s -o $null -w "%{http_code}" "$Site/"
Write-Host "Live Homepage HTTP Status: $homeStatus"
