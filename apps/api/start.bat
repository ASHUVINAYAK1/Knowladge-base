@echo off
echo Starting Knowledge Base API...
cd /d "%~dp0"
call venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
