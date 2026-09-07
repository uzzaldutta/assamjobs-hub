Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "D:\assamjobs-hub"
$zipFile = "C:\Users\SONY\OneDrive\Desktop\assamjobs-hub-deploy.zip"

if (Test-Path $zipFile) {
    Remove-Item $zipFile
}

$tempDir = Join-Path $env:TEMP "assamjobs_zip_temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

$exclude = @(".git", "node_modules", ".next")

Get-ChildItem -Path $sourceDir | Where-Object { $exclude -notcontains $_.Name } | Copy-Item -Destination $tempDir -Recurse

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipFile)

Remove-Item $tempDir -Recurse -Force
Write-Host "Zip created at $zipFile"
