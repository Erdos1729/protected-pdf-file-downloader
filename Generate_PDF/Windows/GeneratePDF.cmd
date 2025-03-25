@ECHO OFF
SETLOCAL EnableDelayedExpansion

:: Set title
TITLE PDF Generator

:: Change to script directory
CD /D "%~dp0"

:: Check if Source_Files directory exists
IF NOT EXIST "..\Source_Files" (
    ECHO Error: Source_Files directory not found!
    ECHO Please make sure the Source_Files directory exists.
    PAUSE
    EXIT /B 1
)

:: Change to Source_Files directory
CD "..\Source_Files"

:: Check if GeneratePDF.exe exists
IF NOT EXIST "GeneratePDF.exe" (
    ECHO Error: GeneratePDF.exe not found!
    ECHO Please make sure GeneratePDF.exe exists in the Source_Files directory.
    PAUSE
    EXIT /B 1
)

:: Display welcome message
ECHO ====================================
ECHO    PDF Generator
ECHO ====================================
ECHO.
ECHO Starting PDF generation process...
ECHO.

:: Run the PDF generator
GeneratePDF.exe

:: Check if the process completed successfully
IF %ERRORLEVEL% EQU 0 (
    ECHO.
    ECHO PDF generation completed successfully!
) ELSE (
    ECHO.
    ECHO Error: PDF generation failed!
    ECHO Please check the error messages above.
)

ECHO.
ECHO Press any key to exit...
PAUSE > NUL

ENDLOCAL