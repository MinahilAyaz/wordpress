import os
import sys
import re
import uuid
import zipfile
import urllib.request
import urllib.parse
import http.cookiejar

# Site configuration
SITE = "https://www.nesports3.com"
USER = "NESports"
PASS = "NES3@1122$PK"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PLUGIN_DIR = os.path.join(BASE_DIR, "nesports-pro-store")
ZIP_PATH = os.path.join(BASE_DIR, "nesports-pro.zip")

def create_plugin_zip():
    print(f"[1/4] Packing '{PLUGIN_DIR}' into ZIP...")
    if not os.path.exists(PLUGIN_DIR):
        print(f"ERROR: Plugin directory not found: {PLUGIN_DIR}")
        sys.exit(1)

    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(PLUGIN_DIR):
            for file in files:
                # Skip unnecessary backups or temporary files
                if file.endswith((".tmp", ".bak", ".DS_Store", "Thumbs.db")):
                    continue
                if "images_backup" in root:
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PLUGIN_DIR).replace("\\", "/")
                # WordPress plugin zip must have root folder named 'nesports-pro' or 'nesports-pro-store'
                zf.write(full_path, "nesports-pro/" + rel_path)

    zip_size_mb = os.path.getsize(ZIP_PATH) / (1024 * 1024)
    print(f"      Plugin packed: {ZIP_PATH} ({zip_size_mb:.2f} MB)")

def deploy_to_wordpress():
    print(f"[2/4] Logging in to WordPress at {SITE}...")
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    opener.addheaders = [
        ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"),
    ]

    # Initialize cookies
    opener.open(f"{SITE}/wp-login.php", timeout=30)
    login_data = urllib.parse.urlencode({
        "log": USER,
        "pwd": PASS,
        "wp-submit": "Log In",
        "redirect_to": f"{SITE}/wp-admin/",
        "testcookie": "1"
    }).encode("utf-8")
    resp = opener.open(f"{SITE}/wp-login.php", data=login_data, timeout=30)
    if "wp-admin" not in resp.geturl():
        print("ERROR: Login failed. Check credentials.")
        sys.exit(1)
    print("      Logged in successfully!")

    print("[3/4] Fetching upload nonce and submitting plugin zip...")
    resp = opener.open(f"{SITE}/wp-admin/plugin-install.php?tab=upload", timeout=30)
    uhtml = resp.read().decode("utf-8", errors="ignore")
    m_nonce = re.search(r'id="_wpnonce"\s+name="_wpnonce"\s+value="([^"]+)"', uhtml)
    if not m_nonce:
        m_nonce = re.search(r'name="_wpnonce"\s+value="([^"]+)"', uhtml)
    if not m_nonce:
        print("ERROR: Could not retrieve WordPress upload nonce.")
        sys.exit(1)
    nonce = m_nonce.group(1)

    boundary = "----WebKitFormBoundary" + uuid.uuid4().hex
    with open(ZIP_PATH, "rb") as f:
        zip_bytes = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="_wpnonce"\r\n\r\n{nonce}\r\n'
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n'
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="pluginzip"; filename="nesports-pro.zip"\r\n'
        f"Content-Type: application/zip\r\n\r\n"
    ).encode("utf-8") + zip_bytes + (
        f"\r\n--{boundary}\r\n"
        f'Content-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n'
        f"--{boundary}--\r\n"
    ).encode("utf-8")

    req = urllib.request.Request(
        f"{SITE}/wp-admin/update.php?action=upload-plugin",
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        }
    )
    resp = opener.open(req, timeout=300)
    res_html = resp.read().decode("utf-8", errors="ignore")

    # Confirm overwrite if existing plugin detected
    m_overwrite = re.search(r'href="([^"]*overwrite=update-plugin[^"]*)"', res_html)
    if m_overwrite:
        ow_url = m_overwrite.group(1).replace("&amp;", "&")
        if not ow_url.startswith("http"):
            ow_url = f"{SITE}/wp-admin/{ow_url.lstrip('/')}"
        print("      Confirming replace current version...")
        resp = opener.open(ow_url, timeout=60)
        res_html = resp.read().decode("utf-8", errors="ignore")

    print("[4/4] Activating plugin...")
    m_act = re.search(r'href="([^"]*plugins\.php\?action=activate[^"]*)"', res_html)
    if m_act:
        act_url = m_act.group(1).replace("&amp;", "&")
        if not act_url.startswith("http"):
            act_url = f"{SITE}/wp-admin/{act_url.lstrip('/')}"
        opener.open(act_url, timeout=60)
    else:
        resp = opener.open(f"{SITE}/wp-admin/plugins.php", timeout=30)
        phtml = resp.read().decode("utf-8", errors="ignore")
        m_act2 = re.search(r'href="([^"]*action=activate[^"]*nesports-pro%2Fnesports-pro-store\.php[^"]*)"', phtml)
        if m_act2:
            act_url = m_act2.group(1).replace("&amp;", "&")
            if not act_url.startswith("http"):
                act_url = f"{SITE}/wp-admin/{act_url.lstrip('/')}"
            opener.open(act_url, timeout=60)

    # Clean up local zip
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    print("\nSUCCESS! Plugin successfully deployed and activated on https://www.nesports3.com!")

if __name__ == "__main__":
    create_plugin_zip()
    deploy_to_wordpress()
