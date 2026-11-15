$code = Get-Content -Path 'c:\Users\abdul\Desktop\wordpress\scratch\GenerateAllDetails.cs' -Raw
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[GenerateAllDetails]::Main()
