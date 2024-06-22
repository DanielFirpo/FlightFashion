set "CMDER_ROOT=C:\cmder"
set "BAT_ROOT=%~dp0"

start "" "%CMDER_ROOT%\Cmder.exe" /START "%BAT_ROOT%\backend" /TASK "RideToWalkStart"

start "" "%CMDER_ROOT%\Cmder.exe" /START "%BAT_ROOT%\frontend" /TASK "RideToWalkStart"

cd "%BAT_ROOT%\backend"
echo | code . | exit /b

cd "%BAT_ROOT%\frontend"
echo | code . | exit /b

start chrome "http://localhost:3000/" "http://localhost:1337/admin"

exit