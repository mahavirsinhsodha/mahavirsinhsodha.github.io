@echo off
title MS Corporation Hack Interface
color 0a
cls

:: Intro Banner
echo #################################################
echo #       Your PC has been HACKED by MS CORP!     #
echo #           Sit back and enjoy the show!        #
echo #################################################
ping localhost -n 3 >nul

:: Fake System Initialization
echo.
echo Initializing Hack Sequence...
ping localhost -n 2 >nul
echo Establishing connection to MS CORP servers...
ping localhost -n 2 >nul
echo Access Granted!
ping localhost -n 2 >nul
echo Connection Established. IP: 192.168.1.101
ping localhost -n 2 >nul

:: Dynamic Color Cycle
echo.
echo Preparing visual interface...
for %%G in (a b c d e f) do (
    color 0%%G
    ping localhost -n 2 >nul
)

:: Fake Alerts and Random Text
echo.
echo #################################################
echo #                  ALERT!                      #
echo #  Unauthorized Access Detected in System!     #
echo #################################################
ping localhost -n 3 >nul
echo Deploying Malwares...
ping localhost -n 3 >nul

:: Add Random Typing Effect
call :random_typing

:: Fake Command Execution Loop
echo.
echo Entering live hack mode...
set /a counter=0
:loop
if %counter% geq 1 goto end_loop
set /a counter+=1
color 0a
echo  Accessing secure files...
timeout /t 2 /nobreak >nul
color 0c
echo  Uploading data to MS servers...
timeout /t 2 /nobreak >nul
color 0b
echo  Injecting payload into memory...
timeout /t 2 /nobreak >nul
goto loop

:end_loop
echo Exiting live hack mode...
ping localhost -n 2 >nul

:: Add Simulated File Deletion
echo.
echo WARNING: Deleting important files...
for %%A in (C:\Windows\System32, D:\Documents, E:\Media) do (
    echo Deleting %%A...
    timeout /t 1 /nobreak >nul
)
echo All files deleted!
ping localhost -n 3 >nul

:: Add Matrix Effect
call :matrix

:: Add Countdown Timer
call :countdown

:: Fake File Encryption
echo.
echo Encrypting files...
for /l %%A in (1,1,5) do (
    echo Encrypting file %%A of 5...
    timeout /t 2 /nobreak >nul
)
echo All files encrypted!
ping localhost -n 3 >nul

:: Fake Termination of Script
echo System error detected. Terminating script...
ping localhost -n 2 >nul
pause
exit

:: Random Typing Subroutine
:random_typing
setlocal EnableDelayedExpansion
set "text=https://mahavirsinhsodha.github.io/"
for /l %%A in (0,1,35) do (
    set /a delay=!random! %% 100 + 50
    <nul set /p "=!text:~%%A,1!" & timeout /t 0 /nobreak >nul
)
echo.
endlocal
goto :eof

:: Matrix Effect Subroutine
:matrix
color 0a
cls
set /a matrix_counter=0
:loop_matrix
if %matrix_counter% geq 30 goto end_matrix
set /a matrix_counter+=1
echo %random%%random%%random%%random%%random%
timeout /t 0 /nobreak >nul
goto loop_matrix
:end_matrix
goto :eof

:: Countdown Timer Subroutine
:countdown
set /a seconds=10
:countdown_loop
cls
echo Initiating Destruction in %seconds% seconds...
set /a seconds-=1
if %seconds% geq 0 (timeout /t 1 /nobreak >nul & goto countdown_loop)

:: Simulate directory listing after countdown
cd /d C:\
color 0a
echo.
echo Generating directory structure at C:\...
ping localhost -n 4 >nul
dir /s /a
ping localhost -n 3 >nul
goto :eof
