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
  powershell -NoProfile -Command "$c = [System.IO.File]::ReadAllText('service-worker.js'); $c = $c -replace 'tcp-\d{4}-\d{2}-\d{2}', 'tcp-%SW_DATE%'; $enc = New-Object System.Text.UTF8Encoding $false; [System.IO.File]::WriteAllText((Resolve-Path 'service-worker.js'), $c, $enc)"
  echo Done: service-worker.js
)

echo.
echo All done! Version: %VERSION%
pause
