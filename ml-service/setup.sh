#!/bin/bash

# E Corp ML Service Setup Script

echo "======================================"
echo "E Corp ML Service Setup"
echo "======================================"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Generate training data
echo ""
echo "======================================"
echo "Generating training data..."
echo "======================================"
python generate_training_data.py

# Train models
echo ""
echo "======================================"
echo "Training ML models..."
echo "======================================"
python train_models.py

echo ""
echo "======================================"
echo "Setup complete!"
echo "======================================"
echo ""
echo "To start the service, run:"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""

