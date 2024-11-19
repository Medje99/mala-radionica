@echo off
color 6
:: Set MySQL details
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_HOST=localhost
set BACKUP_DIR=C:\mala-radionica-backup
set BACKUP_DIR_D=D:\mala-radionica-backup
set DATE=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%

:: Create backup folder if it doesn't exist
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%
if not exist %BACKUP_DIR_D% mkdir %BACKUP_DIR_D%

:: Backup database
echo Backing up databases...
echo:
echo:
:: Try DUMP C
"C:\xampp\mysql\bin\mysqldump.exe" -u %MYSQL_USER% %MYSQL_PASSWORD% --all-databases --routines --events --single-transaction > %BACKUP_DIR%\backup_%DATE%.sql
::ERROR C DUMP? 
if errorlevel 1 (
         COLOR 4
    echo WARNING: Backup failed on %BACKUP_DIR%.
    exit /b 1
)
:: C DUMP OK ... 

echo Backup to C drive successfull (Uncompressed)
echo:

:: Try DUMP D
"C:\xampp\mysql\bin\mysqldump.exe" -u %MYSQL_USER% %MYSQL_PASSWORD% --all-databases --routines --events --single-transaction > %BACKUP_DIR_D%\backup_%DATE%.sql
::ERROR D DUMP? 
if errorlevel 1 (
        COLOR 4
    echo WARNING: Backup failed on %BACKUP_DIR_D%.
timeout /t 10 /nobreak
    exit /b 1

)
:: D DUMP OK ...
echo Backup to D drive successfull (Uncompressed)
echo:


:: Optional: Compress the backup
echo Compressing backup...
 echo:

::TRY COMPRESS TO C
7z a %BACKUP_DIR%\backup_%DATE%.zip %BACKUP_DIR%\backup_%DATE%.sql
::COMPRESS C ERROR ? 
if errorlevel 1 (
        COLOR 4
     echo:
    echo WARNING: Compression failed on %BACKUP_DIR%.
echo:

timeout /t 10 /nobreak
    exit /b 1
)
::COMPRESS C OK ?
echo Compressing to C drive successfull 

::TRY COMPRESS TO D
7z a %BACKUP_DIR_D%\backup_%DATE%.zip %BACKUP_DIR_D%\backup_%DATE%.sql
::COMPRESS D ERROR ? 
if errorlevel 1 (
        COLOR 4
    echo WARNING: Compression failed on %BACKUP_DIR_D%.
timeout /t 300 /nobreak
    exit /b 1
)
::COMPRESS D OK ?
echo Compressing to D drive successfull 
echo:

:: Delete uncompressed SQL backup after compression (optional)
::TRY DELETE C 
del %BACKUP_DIR%\backup_%DATE%.sql
:: C DELETE ERROR 
if errorlevel 1 (
        COLOR 4
    echo WARNING: Failed to delete SQL backup on %BACKUP_DIR%.
timeout /t 300 /nobreak
::C DELETE SUCCESS
echo Uncompressed Backup AT C drive deleted 
echo:
    exit /b 1
)
::TRY DELETE D
del %BACKUP_DIR_D%\backup_%DATE%.sql
:: D DELETE ERROR 
if errorlevel 1 (
        COLOR 4
    echo WARNING: Failed to delete SQL backup on %BACKUP_DIR_D%.
timeout /t 300 /nobreak
::D DELETE SUCCESS
echo Uncompressed Backup AT D drive deleted 
echo:
    exit /b 1
)

:: Inform user and pause for 10 seconds
color 2
echo Backup completed: backup_%DATE%.zip

