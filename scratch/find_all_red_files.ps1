Get-ChildItem -Path "C:\Users\abdul\Desktop\wordpress" -Recurse -Filter "*red*" | Select-Object FullName, Length | Out-String -Width 160
