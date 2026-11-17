@echo off
setlocal

set "BASE_DIR=%~dp0.."
if not exist "%BASE_DIR%\scripts\extract-feeds-cli.ts" (
    if exist "E:\Uzzal\App Development\assamjobs-hub\scripts\extract-feeds-cli.ts" (
        set "BASE_DIR=E:\Uzzal\App Development\assamjobs-hub"
    )
)

cd /d "%BASE_DIR%"
set "LOGFILE=%BASE_DIR%\logs\auto-feed.log"

>> "%LOGFILE%" 2>&1 (
    echo ========================================================
    echo [%date% %time%] Starting AssamJobsHub Autonomous Ingestion
    echo ========================================================
    set NODE_OPTIONS=--dns-result-order=ipv4first
    
    echo --- Step 1: Extracting Feeds from Active Sources ---
    call npx.cmd tsx scripts/extract-feeds-cli.ts
    
    echo --- Step 2: Approving and Publishing High Quality Posts ---
    call npx.cmd tsx scripts/approve-pending.ts
    
    echo --- Step 3: Revalidating Production Edge Cache ---
    curl.exe -s "https://assamjobshub.com/api/revalidate-all"
    
    echo [%date% %time%] Autonomous Ingestion Finished Successfully.
    echo.
)
