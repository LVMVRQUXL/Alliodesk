#!/bin/bash
exec java -DenvFile="./app/.env" -jar "./app/alliodesk-ui-<VERSION>.jar"