@echo off
rem Opens the Editing Hub at http://localhost:1989 (close this window to stop the server)
cd /d "%~dp0"
start "" http://localhost:1989
py -m http.server 1989
