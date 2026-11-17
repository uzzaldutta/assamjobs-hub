Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "G:\assamjobs-hub_Oct24"
$desktop1 = [Environment]::GetFolderPath('Desktop')
$desktop2 = "C:\Users\USER\Desktop"
$zipName = "assamjobs-hub-deploy.zip"

$target1 = Join-Path $desktop1 $zipName
$target2 = Join-Path $desktop2 $zipName

$tempDir = Join-Path $env:TEMP ("assamjobs_deploy_" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$excludeDirs = @(".git", "node_modules", ".next", ".vercel", ".windsurf", ".claude", "logs", "audit_package", "Assamese Dictnary", "Password of Admin Panel")

Get-ChildItem -Path $sourceDir -Force | ForEach-Object {
    if ($_.PSIsContainer) {
        if ($excludeDirs -notcontains $_.Name) {
            Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir $_.Name) -Recurse -Force
        }
    } else {
        # Copy core build and config files
        if ($_.Name -notmatch '\.(py|txt|sql)$') {
            Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir $_.Name) -Force
        }
    }
}

if (Test-Path $target1) {
    Remove-Item $target1 -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $target1, [System.IO.Compression.CompressionLevel]::Optimal, $false)

if ($desktop1 -ne $desktop2 -and (Test-Path $desktop2)) {
    Copy-Item -Path $target1 -Destination $target2 -Force
}

Remove-Item $tempDir -Recurse -Force

Write-Host "SUCCESS: Deployment zip created at:"
Get-Item $target1 | Select-Object FullName, Length, LastWriteTime | Format-List
if (Test-Path $target2) {
    Get-Item $target2 | Select-Object FullName, Length, LastWriteTime | Format-List
}
