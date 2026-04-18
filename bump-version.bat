@echo off
:: bump-version.bat — updates SW cache version to today's date + HHMM
:: Runs automatically before every build

for /f %%a in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd-HHmm"') do set SW_DATE=%%a

if "%SW_DATE%"=="" (
  echo ERROR: Could not determine date/time. Aborting.
  exit /b 1
)

echo [BUMP] Updating Service Worker cache version to: tcp-%SW_DATE%

:: Update service-worker.js in public/ folder (source of truth)
if not exist public\service-worker.js (
  echo [WARNING] public\service-worker.js not found
) else (
  powershell -NoProfile -Command "$c = [System.IO.File]::ReadAllText('public\service-worker.js'); $c = $c -replace 'tcp-[\d-]+', 'tcp-%SW_DATE%'; $enc = New-Object System.Text.UTF8Encoding $false; [System.IO.File]::WriteAllText((Resolve-Path 'public\service-worker.js'), $c, $enc)"
  echo [BUMP] ✓ Updated public/service-worker.js
)

echo [BUMP] Service Worker version bumped successfully.
echo.