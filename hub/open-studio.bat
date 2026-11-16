@echo off
rem Starts BOSS Studio at http://localhost:1988 and opens the hub; its Editing App tab is the studio (close this window to stop it).
rem Projects are saved as folders in bossstudio\projects\. Needs Node.js and a signed-in Claude Code.
cd /d "%~dp0.."
rem An older studio still running would keep port 1988 and its old code: stop it first.
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:"127.0.0.1:1988 .*LISTENING"') do (
  echo Stopping the studio that was already running ^(process %%p^)...
  taskkill /PID %%p /F >nul 2>&1
)
start "" http://localhost:1988/hub/index.html
node hub\studio\server.mjs
