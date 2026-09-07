$config = Get-Content vercel.json | ConvertFrom-Json
$config.crons[0].schedule = "0 0 * * *"
$config | ConvertTo-Json | Set-Content vercel.json
