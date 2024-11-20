@echo off
:: Set the path to the XAMPP folder
set XAMPP_DIR="C:\xampp"

:: Check if MySQL is already running
tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if %errorlevel%==0 (
    echo MySQL is already running.
call "C:\Users\Barjo\Documents\mala-radionica\backup_database.bat"
cd frontend
start cmd.exe /k "npm run dev --host"
cd ../backend
start cmd.exe /k "npm start"
timeout /t 5 /nobreak > nul
start http://localhost:5173
echo Servers started.

) else (
    echo MySQL is not running. Starting MySQL through XAMPP...
    :: Start XAMPP control panel in the background to start MySQL
    start "" "%XAMPP_DIR%\xampp-control.exe" --start mysql
    echo MySQL started.

timeout /t 3 /nobreak
call "C:\Users\Barjo\Documents\mala-radionica\backup_database.bat"
cd frontend
start cmd.exe /k "npm run dev"
cd ../backend
start cmd.exe /k "npm start"
timeout /t 5 /nobreak > nul
start http://localhost:5173
echo Servers started.
)
