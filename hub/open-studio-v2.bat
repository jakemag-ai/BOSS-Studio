@echo off
rem Starts BOSS Studio V2 at http://localhost:1986 (runs alongside the original studio on 1988; close this window to stop it).
rem Projects are saved as folders in bossstudio\projects\ (shared with the original studio). Needs Node.js and a signed-in Claude Code.
cd /d "%~dp0.."
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:"127.0.0.1:1986 .*LISTENING"') do (
  echo Stopping the V2 studio that was already running ^(process %%p^)...
  taskkill /PID %%p /F >nul 2>&1
)
start "" http://localhost:1986/
node hub\studio-v2\server.mjs
