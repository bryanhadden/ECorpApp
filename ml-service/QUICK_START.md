# ML Service - Quick Start Guide

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- 2-3 GB free disk space (for dependencies and data)

## Quick Setup (5 minutes)

### Option 1: Automated Setup (Recommended)

```bash
cd ml-service
chmod +x setup.sh start.sh
./setup.sh
```

This single command will:

1. Create a Python virtual environment
2. Install all dependencies (TensorFlow, Flask, etc.)
3. Generate 10,000+ training records
4. Train ML models (takes 2-3 minutes)

### Option 2: Manual Setup

```bash
cd ml-service

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Generate training data
python generate_training_data.py

# Train models
python train_models.py
```

## Start the Service

```bash
cd ml-service
./start.sh
```

Or manually:

```bash
cd ml-service
source venv/bin/activate
python app.py
```

The service will start on **http://localhost:5000**

## Test the Service

Open a new terminal and run:

```bash
# Health check
curl http://localhost:5000/health

# Get analytics
curl http://localhost:5000/api/analytics

# Get parts with predictions
curl http://localhost:5000/api/parts
```

## Run the React Native App

In a new terminal:

```bash
# Navigate to project root
cd ..

# Start Metro bundler
npm start

# In another terminal, run the app
npm run ios  # or npm run android
```

## Verify Integration

1. Open the app
2. Login with any test user
3. Look for "(ML Powered)" or "(ML)" in dashboard headers
4. Check console logs for "ML Service" messages

## Data Overview

After setup, you'll have:

### Generated Training Data

- **~5,000 sales records** (2023-2025, 5 dealerships, 5 models)
- **~1,000 parts inventory records** (8 parts, monthly tracking)
- **~2,000 service tickets** (10 issue types)
- **~800 dealership metrics** (performance by location)

### Trained Models

- **Sales Forecast Model**: LSTM network for monthly predictions
- **Parts Demand Model**: Neural network for inventory optimization

## API Endpoints

| Endpoint                            | Description                        |
| ----------------------------------- | ---------------------------------- |
| `GET /health`                       | Service health check               |
| `GET /api/analytics`                | Company analytics with predictions |
| `GET /api/sales?limit=50`           | Recent sales data                  |
| `GET /api/parts`                    | Parts with demand predictions      |
| `GET /api/service-tickets?limit=50` | Service tickets                    |
| `GET /api/orders`                   | Parts orders                       |
| `GET /api/metadata`                 | System metadata                    |

## Example Response

**GET /api/analytics**

```json
{
  "totalSalesYTD": 12500000,
  "totalSalesProjected": 18000000,
  "totalPartsCostYTD": 2800000,
  "totalPartsCostProjected": 4200000,
  "dealerships": [...],
  "monthlySales": [...],
  "generatedAt": "2025-10-13T...",
  "usingML": true
}
```

**GET /api/parts**

```json
[
  {
    "id": "P001",
    "name": "Battery Pack",
    "sku": "BAT-5000",
    "quantity": 45,
    "price": 8500,
    "predictedDemand": 52,
    "recommendedStock": 104,
    "needsReorder": true
  }
]
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'tensorflow'"

```bash
cd ml-service
source venv/bin/activate
pip install -r requirements.txt
```

### "Model file not found"

```bash
cd ml-service
source venv/bin/activate
python train_models.py
```

### "Connection refused" in React Native app

1. Make sure ML service is running: `curl http://localhost:5000/health`
2. Check the URL in `src/services/mlService.ts`
3. For iOS simulator, use `http://localhost:5000`
4. For Android emulator, use `http://10.0.2.2:5000`

### Service starts but predictions fail

```bash
# Regenerate and retrain
cd ml-service
source venv/bin/activate
python generate_training_data.py
python train_models.py
```

## Development Tips

### View Training Data

```bash
cd ml-service/data
head sales_history.csv
head parts_inventory.csv
```

### Monitor Logs

```bash
cd ml-service
source venv/bin/activate
python app.py  # Shows request logs in terminal
```

### Retrain with More Data

Edit `generate_training_data.py` to change:

- `START_DATE` and `END_DATE` for date range
- `DEALERSHIPS` array to add more locations
- `VEHICLE_MODELS` to add more models

Then run:

```bash
python generate_training_data.py
python train_models.py
```

## Production Checklist

- [ ] Set `FLASK_ENV=production` in `.env`
- [ ] Update `ML_SERVICE_URL` in `src/services/mlService.ts`
- [ ] Enable HTTPS for API endpoint
- [ ] Add authentication/API keys
- [ ] Set up monitoring and logging
- [ ] Configure CORS for your domain
- [ ] Use Gunicorn for production serving:
  ```bash
  gunicorn -w 4 -b 0.0.0.0:5000 app:app
  ```

## Next Steps

1. ✅ Set up ML service
2. ✅ Test API endpoints
3. ✅ Run React Native app
4. 📚 Read [ML_INTEGRATION.md](../ML_INTEGRATION.md) for details
5. 🚀 Deploy to production
6. 📊 Monitor model performance
7. 🔄 Retrain models with real data

## Support

- **Full Documentation**: See `ML_INTEGRATION.md`
- **API Reference**: See `/api/*` endpoints above
- **Model Architecture**: See `train_models.py`
- **Data Schema**: See `data/metadata.json` after generation

## What's Happening Behind the Scenes

1. **Data Generation**: Creates realistic synthetic data with:

   - Seasonal sales trends
   - Growth patterns over time
   - Inventory based on demand
   - Service patterns based on vehicle age

2. **Model Training**: Uses TensorFlow to:

   - Learn from historical patterns
   - Predict future sales (LSTM)
   - Forecast parts demand (Neural Network)
   - Optimize with dropout and regularization

3. **API Serving**: Flask provides:

   - RESTful endpoints
   - Real-time predictions
   - Automatic fallback handling
   - CORS support for React Native

4. **App Integration**: React Native:
   - Fetches predictions via HTTP
   - Falls back to mock data if service unavailable
   - Shows loading states
   - Indicates ML vs offline mode

Enjoy your ML-powered E Corp App! 🚀
