#!/bin/bash
exec java -DenvFile="./.env" -jar "./app/alliodesk-ui-<VERSION>.jar"
