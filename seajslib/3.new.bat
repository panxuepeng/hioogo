@echo off
set /p var=������Ҫ�������������:
echo "mkdir %var%"
mkdir %var%
cd %var%
grunt-init ../module-tpl
pause
