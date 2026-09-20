@echo off
echo Adding changes...
git add .

echo.
echo Committing changes...
set /p commitMsg="Enter commit message (or press enter for 'Update'): "
if "%commitMsg%"=="" set commitMsg=Update
git commit -m "%commitMsg%"

echo.
echo Pushing to main branch...
git push origin main

echo.
pause
