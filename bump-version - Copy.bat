@echo off
:: bump-version.bat — updates ?v= and SW cache version to today's DDMM
:: Place in project root and double-click or run from Command Prompt

:: Get day and month
for /f "tokens=1-3 delims=/" %%a in ("%date%") do (
  set DD=%%a
  set MM=%%b
  set YYYY=%%c
)

:: Handle different Windows date formats (some return D/M/YYYY, some M/D/YYYY)
:: We'll use wmic for reliable date parsing
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
  powershell -Command "(Get-Content 'index.html') -replace '\?v=[a-zA-Z0-9_-]+', '?v=%VERSION%' | Set-Content 'index.html'"
  echo Done: index.html
)

:: --- Update service-worker.js ---
if not exist service-worker.js (
  echo WARNING: service-worker.js not found
) else (
  powershell -Command "(Get-Content 'service-worker.js') -replace \"(const CACHE_VERSION = 'tcp-)[a-zA-Z0-9_-]+('\)\", \"`$1%SW_DATE%`$2\" | Set-Content 'service-worker.js'"
  echo Done: service-worker.js
)

echo.
echo All done! Version: %VERSION%
pause
