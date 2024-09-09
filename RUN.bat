@echo off
title Starting Development Servers...

cd frontend
start cmd.exe /k "npm run dev"

cd ../backend
start cmd.exe /k "npm start"

timeout /t 5 /nobreak > nul

start http://localhost:5173

echo Servers started.


pause 