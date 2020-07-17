@echo off
title Alliodesk VERSION
mode con cols=80 lines=16
color 0F

java -DenvFile="./.env" -jar "./app/alliodesk-ui-<VERSION>.jar"

pause > nul
