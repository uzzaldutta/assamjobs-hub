Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

batPath = "G:\assamjobs-hub_Oct24\scripts\run-auto-feed.bat"
If Not fso.FileExists(batPath) Then
    batPath = "E:\Uzzal\App Development\assamjobs-hub\scripts\run-auto-feed.bat"
End If

WshShell.Run """" & batPath & """", 0, True
Set WshShell = Nothing
