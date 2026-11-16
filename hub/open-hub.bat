@echo off
rem Opens the Editing Hub at http://localhost:4600 (close this window to stop the server)
cd /d "%~dp0"
start "" http://localhost:4600
py -m http.server 4600
