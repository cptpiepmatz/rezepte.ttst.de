rem eine Rezeptdatei auf diese Batch-Datei ziehen
rem man kann auch über ziehen mit der rechten Maustaste eine Verknüpfung auf
rem diese Datei erstellen und sie dann in den SendTo-Ordner verschieben.
echo off
echo %1
start /i "Rezeptvorschaugeneration" ..\edit.exe img %1
start http://localhost:3000

rem 
pause