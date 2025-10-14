#!/bin/bash

# E Corp ML Service Start Script

echo "Starting E Corp ML Service..."

# Activate virtual environment
source venv/bin/activate

# Start Flask app
python app.py

