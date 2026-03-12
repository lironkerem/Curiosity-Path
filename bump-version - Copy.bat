@echo off
:: bump-version.bat — updates ?v= and SW cache version to today's DDMM
:: Place in project root and double-click or run from Command Prompt

:: Use wmic for reliable date parsing
for /f "tokens=2 delims==" %%a in ('wmic os get LocalDateTime /value') do set DT=%%a
set YYYY=%DT:~0,4%
set MM=%DT:~4,2%
set DD=%DT:~6,2%
set VERSION=%DD%%MM%
set SW_DATE=%YYYY%-%MM%-%DD%

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
  powershell -NoProfile -Command "$c = Get-Content 'service-worker.js' -Raw; $c = $c -replace \"const CACHE_VERSION = 'tcp-[^']+'\", \"const CACHE_VERSION = 'tcp-%SW_DATE%'\"; Set-Content 'service-worker.js' $c"
  echo Done: service-worker.js
)

echo.
echo All done! Version: %VERSION%
pause
