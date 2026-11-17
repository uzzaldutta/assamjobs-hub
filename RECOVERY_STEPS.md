# ASSAMJOBSHUB — COMPLETE STEP-BY-STEP RECOVERY MANUAL
**Location:** `E:\Uzzal\App Development\RECOVERY_STEPS.md`  
**Applicability:** Use this guide if you switch to a new PC, re-install Windows, or need to restore the project from scratch.

---

## TABLE OF CONTENTS
1. [Prerequisites](#1-prerequisites)
2. [Scenario 1: Restore from Existing Backup Folder](#2-scenario-1-restore-from-existing-backup-folder-fastest)
3. [Scenario 2: Restore from Zip Archive](#3-scenario-2-restore-from-zip-archive)
4. [Scenario 3: Restore from GitHub Repository](#4-scenario-3-restore-from-github-repository)
5. [Environment Variables Setup (.env.local)](#5-environment-variables-setup-envlocal)
6. [Launching the Local Development Server](#6-launching-the-local-development-server)
7. [Running Feed Extraction Manually](#7-running-feed-extraction-manually)
8. [Deploying Changes to Production (Vercel)](#8-deploying-changes-to-production-vercel)
9. [Important Troubleshooting Tips](#9-important-troubleshooting-tips)

---

## 1. PREREQUISITES

On any computer where you want to run the project, ensure you have:
1. **Node.js (v20 or higher):** Download and install from [https://nodejs.org](https://nodejs.org) (LTS version recommended).
2. **Git:** Download and install from [https://git-scm.com](https://git-scm.com).
3. **Web Browser:** Google Chrome, Edge, or Brave.

---

## 2. SCENARIO 1: RESTORE FROM EXISTING BACKUP FOLDER (FASTEST)

If you already have `E:\Uzzal\App Development\assamjobs-hub\`:

1. Open **PowerShell** or **Command Prompt**.
2. Navigate into the folder:
   ```powershell
   cd "E:\Uzzal\App Development\assamjobs-hub"
   ```
3. Install dependencies:
   ```powershell
   npm.cmd install --legacy-peer-deps
   ```
4. Start the server (see [Section 6](#6-launching-the-local-development-server)).

---

## 3. SCENARIO 2: RESTORE FROM ZIP ARCHIVE

If you only have `AssamJobsHub_SourceCode_Oct24.zip`:

1. Right-click `AssamJobsHub_SourceCode_Oct24.zip` $\rightarrow$ **Extract All...** $\rightarrow$ extract to `E:\Uzzal\App Development\assamjobs-hub`.
2. Open PowerShell in that folder:
   ```powershell
   cd "E:\Uzzal\App Development\assamjobs-hub"
   ```
3. Verify or recreate `.env.local` (see [Section 5](#5-environment-variables-setup-envlocal)).
4. Run:
   ```powershell
   npm.cmd install --legacy-peer-deps
   ```

---

## 4. SCENARIO 3: RESTORE FROM GITHUB REPOSITORY

If both local folders are lost, you can clone directly from GitHub:

1. Open PowerShell and run:
   ```powershell
   cd "E:\Uzzal\App Development"
   git clone https://github.com/uzzaldutta/assamjobs-hub.git
   cd assamjobs-hub
   ```
2. Create the `.env.local` file (see [Section 5](#5-environment-variables-setup-envlocal)).
3. Install dependencies:
   ```powershell
   npm.cmd install --legacy-peer-deps
   ```

---

## 5. ENVIRONMENT VARIABLES SETUP (.env.local)

The file `E:\Uzzal\App Development\assamjobs-hub\.env.local` must contain the following exact configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://smpedqhskoamagndfbfc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn
SUPABASE_SERVICE_ROLE_KEY=[CONFIGURED_IN_ENV_LOCAL]

GEMINI_API_KEY=[CONFIGURED_IN_ENV_LOCAL]
CRON_SECRET=assamhub_cron_2026
```

*(Note: These keys connect your local code directly to your existing cloud database on Supabase and Gemini AI).*

---

## 6. LAUNCHING THE LOCAL DEVELOPMENT SERVER

Because some home Wi-Fi routers have slow/unresponsive IPv6 DNS servers, always run Node with the IPv4 preference flag:

### Command to Start:
```powershell
cd "E:\Uzzal\App Development\assamjobs-hub"
$env:NODE_OPTIONS="--dns-result-order=ipv4first"
npx.cmd next dev -p 3001
```

Once you see:
```text
▲ Next.js (Turbopack)
- Local: http://localhost:3001
✓ Ready
```

1. Open **`http://localhost:3001`** in your browser.
2. Open **`http://localhost:3001/admin`** to access the Admin Panel.
   - **Username:** `admin`
   - **Password:** `assamhub2026`

---

## 7. AUTOMATIC & MANUAL FEED EXTRACTION

### A. Fully Automated Cloud & Background Extraction (Zero Manual Work)
The feed extraction is configured to run **completely automatically** across 3 levels:
1. **GitHub Actions Cloud Cron (`.github/workflows/auto-ingest.yml`):**
   - Runs automatically 6 times a day: **6:00 AM, 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM, and 9:00 PM IST**.
   - Requires zero local computer power — runs in GitHub's cloud 24/7.
2. **Local Autonomous Background Daemon (`scripts/auto-cron-daemon.js`):**
   - Automatically runs hourly in the background on your PC.
   - To launch: double-click `scripts/start-auto-cron.bat` (or run `npm run auto:cron`).
   - For invisible background run: double-click `scripts/start-auto-cron-silent.vbs`.

### B. Triggering Feed Extraction Manually On-Demand:
- **Via Localhost API:**
  ```powershell
  curl.exe "http://localhost:3001/api/cron/ingestion?token=assamhub_cron_2026"
  ```
- **Via Production API:**
  ```powershell
  curl.exe "https://assamjobshub.com/api/cron/ingestion?token=assamhub_cron_2026"
  ```
- **Via Standalone CLI Script:**
  ```powershell
  cd "E:\Uzzal\App Development\assamjobs-hub"
  $env:NODE_OPTIONS="--dns-result-order=ipv4first"
  node -r dotenv/config scripts/extract-feeds-cli.ts
  ```

---

## 8. DEPLOYING CHANGES TO PRODUCTION (VERCEL)

Whenever you edit files locally and want them live on **`https://assamjobshub.com`**:

1. In PowerShell:
   ```powershell
   cd "E:\Uzzal\App Development\assamjobs-hub"
   git add .
   git commit -m "Update website features"
   git push origin main
   ```
2. Vercel will automatically detect the push, rebuild, and update the live website within 60 seconds.

---

## 9. IMPORTANT TROUBLESHOOTING TIPS

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `npm.ps1 cannot be loaded because running scripts is disabled` | Windows PowerShell Execution Policy | Use `npm.cmd` and `npx.cmd` instead of `npm`/`npx`. |
| `fetch failed getaddrinfo ENOTFOUND smpedqhskoamagndfbfc.supabase.co` | Router IPv6 DNS timeout | Run `$env:NODE_OPTIONS="--dns-result-order=ipv4first"` before starting the server. |
| Port 3001 is already in use | Previous process didn't terminate | Run: `Get-NetTCPConnection -LocalPort 3001 \| ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }` |
| Job page shows 500 error | Scraped date formatting issue | Handled automatically by `src/lib/dateUtils.ts` (already patched). |

---

*This document is stored alongside your project files for immediate offline access.*
