@echo off
title AssamJobsHub Automated Feed Daemon
cd /d "%~dp0\.."
echo Starting AssamJobsHub Autonomous Background Feed Daemon...
node scripts/auto-cron-daemon.js
pause
