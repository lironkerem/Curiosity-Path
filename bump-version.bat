@echo off
:: bump-version.bat — updates SW cache version to today's date + HHMM
:: Place in project root and double-click or run from Command Prompt

:: Use PowerShell for reliable date/time (wmic is deprecated in Win 11)
for /f %%a in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd-HHmm"') do set SW_DATE=%%a

if "%SW_DATE%"=="" (
  echo ERROR: Could not determine date/time. Aborting.
  pause
  exit /b 1
)

echo Bumping SW cache version to: tcp-%SW_DATE%
echo.

:: --- Update service-worker.js (root — source of truth) ---
if not exist service-worker.js (
  echo WARNING: service-worker.js not found
) else (
  powershell -NoProfile -Command "$c = [System.IO.File]::ReadAllText('service-worker.js'); $c = $c -replace 'tcp-[\d-]+', 'tcp-%SW_DATE%'; $enc = New-Object System.Text.UTF8Encoding $false; [System.IO.File]::WriteAllText((Resolve-Path 'service-worker.js'), $c, $enc)"
  echo Done: service-worker.js
)

:: --- Update dist\service-worker.js (served file — must match root) ---
if not exist dist\service-worker.js (
  echo WARNING: dist\service-worker.js not found - run "npm run build" first
) else (
  powershell -NoProfile -Command "$c = [System.IO.File]::ReadAllText('dist\service-worker.js'); $c = $c -replace 'tcp-[\d-]+', 'tcp-%SW_DATE%'; $enc = New-Object System.Text.UTF8Encoding $false; [System.IO.File]::WriteAllText((Resolve-Path 'dist\service-worker.js'), $c, $enc)"
  echo Done: dist\service-worker.js
)

echo.
echo All done! SW version: tcp-%SW_DATE%
pause
