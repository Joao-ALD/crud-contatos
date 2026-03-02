@echo off
echo Removendo os ultimos 2 commits...
git reset --hard e977b0b
git push origin master --force
echo.
echo Pronto! Commits removidos.
pause
