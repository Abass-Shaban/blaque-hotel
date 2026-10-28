@echo off
title The Blaque Hotel - 24/7 Food & Beverage Site
echo =======================================================================
echo     Starting The Blaque Hotel 24/7 Bistro Website & Kitchen Display
echo =======================================================================
echo.
echo Guest Website:    http://localhost:8000
echo Kitchen Display:  http://localhost:8000/kitchen.html
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo.
start http://localhost:8000
start http://localhost:8000/kitchen.html
python -m http.server 8000
pause
