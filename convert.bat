@echo off
for /r "C:\Users\Liron\Documents\GitHub\Digital-Curiosiry\public" %%f in (*.png *.jpg *.jpeg) do (
  echo %%f | findstr /i "\\Icons\\" >nul
  if errorlevel 1 (
    npx sharp-cli -i "%%f" -o "%%~dpnf.webp" --quality 85
  )
)
echo Done!