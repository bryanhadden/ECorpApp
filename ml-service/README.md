# E Corp ML Service

Machine Learning service providing real-time predictions for the E Corp dealership management app.

## Features

- **Sales Forecasting**: LSTM-based model predicting future sales trends
- **Parts Demand Prediction**: Neural network predicting parts inventory needs
- **Real-time Analytics**: Company-wide analytics with ML-powered projections
- **RESTful API**: Flask-based API for easy integration

## Quick Start

### First Time Setup

```bash
cd ml-service
chmod +x setup.sh
./setup.sh
```

This will:

1. Create a Python virtual environment
2. Install all dependencies (TensorFlow, Flask, pandas, scikit-learn, etc.)
3. Generate training data
4. Train the ML models

### Running the Service

```bash
./start.sh
```

The service will start on `http://localhost:5001`

### Stopping the Service

```bash
pkill -f "python app.py"
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns service status and whether models are loaded.

### Analytics

```bash
GET /api/analytics
```

Returns company-wide analytics with ML predictions including:

- YTD and projected sales
- Parts costs
- Per-dealership metrics
- Monthly sales trends with predictions

### Sales Data

```bash
GET /api/sales?limit=50
```

Returns recent sales records.

### Parts Inventory

```bash
GET /api/parts
```

Returns parts inventory with ML-predicted demand and reorder recommendations.

### Service Tickets

```bash
GET /api/service-tickets?limit=50
```

Returns recent service tickets.

### Parts Orders

```bash
GET /api/orders
```

Returns pending parts orders.

### Metadata

```bash
GET /api/metadata
```

Returns system metadata, model status, and data statistics.

## Technical Details

### Models

1. **Sales Forecast Model**

   - Architecture: LSTM (Long Short-Term Memory)
   - Input: Historical monthly sales, seasonal trends
   - Output: Next 3 months sales predictions
   - Location: `models/sales_forecast_model.keras`

2. **Parts Demand Model**
   - Architecture: Dense Neural Network
   - Input: Current demand, sales volume, inventory level, price, seasonality
   - Output: Predicted demand for next month
   - Location: `models/parts_demand_model.keras`

### Data

All training data is stored in the `data/` directory:

- `sales_history.csv`: Historical sales records
- `parts_inventory.csv`: Parts inventory over time
- `service_tickets.csv`: Service ticket records
- `monthly_aggregates.csv`: Monthly sales aggregations
- `dealership_metrics.csv`: Per-dealership performance metrics
- `metadata.json`: Dataset metadata

### Requirements

- Python 3.13+
- TensorFlow 2.20.0
- Flask 3.1.2
- pandas 2.3.3
- scikit-learn 1.7.2
- numpy 2.3.3

See `requirements.txt` for complete list.

## Development

### Regenerate Training Data

```bash
python generate_training_data.py
```

### Retrain Models

```bash
python train_models.py
```

### Run in Development Mode

```bash
source venv/bin/activate
python app.py
```

### View Logs

```bash
tail -f ml-service.log
```

## Integration with React Native App

The React Native app connects to the ML service via `src/services/mlService.ts`. The service URL is automatically configured:

- Development: `http://localhost:5001`
- Production: Configure in `mlService.ts`

## Port Configuration

The service runs on port 5001 by default (avoiding macOS AirPlay on port 5000). To change the port:

```bash
export FLASK_PORT=8080
python app.py
```

## Troubleshooting

### Port Already in Use

If port 5001 is in use:

```bash
pkill -f "python app.py"
./start.sh
```

### Models Not Loading

Ensure models are trained:

```bash
python train_models.py
```

### Dependencies Issues

Reinstall dependencies:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Python Version

This service requires Python 3.13+. Check your version:

```bash
python3 --version
```

## Architecture

```
ml-service/
├── app.py                      # Flask API server
├── train_models.py             # Model training code
├── generate_training_data.py   # Training data generation
├── requirements.txt            # Python dependencies
├── setup.sh                    # One-time setup script
├── start.sh                    # Service start script
├── venv/                       # Python virtual environment
├── models/                     # Trained ML models
│   ├── sales_forecast_model.keras
│   └── parts_demand_model.keras
└── data/                       # Training and operational data
    ├── sales_history.csv
    ├── parts_inventory.csv
    ├── service_tickets.csv
    ├── monthly_aggregates.csv
    ├── dealership_metrics.csv
    └── metadata.json
```

## License

MIT
