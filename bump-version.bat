@echo off
:: bump-version.bat — updates ?v= and SW cache version to today's DDMM
:: Place in project root and double-click or run from Command Prompt

:: Use PowerShell for reliable date (wmic is deprecated in Win 11)
for /f %%a in ('powershell -NoProfile -Command "Get-Date -Format ddMM"') do set VERSION=%%a
for /f %%a in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set SW_DATE=%%a

if "%VERSION%"=="" (
  echo ERROR: Could not determine date. Aborting.
  pause
  exit /b 1
)

echo Bumping version to: %VERSION% (SW date: tcp-%SW_DATE%)
echo.

:: --- Update index.html ---
if not exist index.html (
  echo WARNING: index.html not found
) else (
  powershell -NoProfile -Command "(Get-Content 'index.html') -replace '\?v=[a-zA-Z0-9_-]+', '?v=%VERSION%' | Set-Content 'index.html'"
  echo Done: index.html
)

:: --- Update service-worker.js ---
if not exist service-worker.js (
  echo WARNING: service-worker.js not found
) else (
  powershell -NoProfile -Command "$bytes = [System.IO.File]::ReadAllBytes('service-worker.js'); if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { $bytes = $bytes[3..($bytes.Length-1)] }; $c = [System.Text.Encoding]::UTF8.GetString($bytes); $c = $c -replace \"const CACHE_VERSION = 'tcp-[^']+'\", \"const CACHE_VERSION = 'tcp-%SW_DATE%'\"; $enc = New-Object System.Text.UTF8Encoding $false; [System.IO.File]::WriteAllText((Resolve-Path 'service-worker.js'), $c, $enc)"
  echo Done: service-worker.js
)

echo.
echo All done! Version: %VERSION%
pause
