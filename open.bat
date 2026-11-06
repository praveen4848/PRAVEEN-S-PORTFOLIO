@echo off
echo ========================================================
echo Launching Praveen's Metallic Monochrome Portfolio...
echo URL: http://localhost:8080/
echo ========================================================
start http://localhost:8080/
if %ERRORLEVEL% NEQ 0 (
    start "" "%~dp0index.html"
)
