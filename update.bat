@echo off
cd /d "%~dp0"
call npx cap sync android
cd android
call gradlew installDebug
cd /d ../
echo.
pause