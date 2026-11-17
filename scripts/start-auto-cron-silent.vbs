Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c ""%~dp0start-auto-cron.bat""", 0, False
