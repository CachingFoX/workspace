#!/usr/bin/env bash

source /workspace/.venv/bin/activate 
python3 -m uvicorn backend.main_productive:app --reload --host 0.0.0.0 --port 7000 &
PID_PRODUCTIVE=$!
python3 -m uvicorn backend.main_development:app --reload --host 0.0.0.0 --port 9000 &
PID_DEVELOPMENT=$!

echo "Services läuft mit PID:$PID_PRODUCTIVE $PID_DEVELOPMENT"
wait
