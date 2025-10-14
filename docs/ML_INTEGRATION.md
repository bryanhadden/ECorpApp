# Machine Learning Integration Guide

This document explains how the E Corp App integrates with the TensorFlow-powered ML service.

## Architecture Overview

```
┌─────────────────────────────────────┐
│     React Native App (Frontend)     │
│  - Dashboards (C-Suite, Sales, etc) │
│  - Uses hooks for data fetching     │
│  - Automatic fallback to mock data  │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
               │
┌──────────────▼──────────────────────┐
│   Flask ML Service (Python/Backend) │
│  - TensorFlow models                │
│  - REST API endpoints               │
│  - Real-time predictions            │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         │           │
┌────────▼─────┐  ┌──▼────────────┐
│ ML Models    │  │ Training Data │
│ (.keras)     │  │ (.csv)        │
└──────────────┘  └───────────────┘
```

## Directory Structure

```
ECorpApp/
├── ml-service/                 # Python ML Service
│   ├── app.py                 # Flask API server
│   ├── train_models.py        # Model training script
│   ├── generate_training_data.py  # Data generation
│   ├── requirements.txt       # Python dependencies
│   ├── setup.sh              # Setup script
│   ├── start.sh              # Start script
│   ├── data/                 # Training datasets (CSV)
│   │   ├── sales_history.csv
│   │   ├── parts_inventory.csv
│   │   ├── service_tickets.csv
│   │   ├── monthly_aggregates.csv
│   │   ├── dealership_metrics.csv
│   │   └── metadata.json
│   └── models/               # Trained TensorFlow models
│       ├── sales_forecast_model.keras
│       ├── parts_demand_model.keras
│       └── training_info.json
│
└── src/
    ├── services/
    │   └── mlService.ts      # API client for ML service
    └── hooks/
        └── useMLData.ts      # React hooks for ML data
```

## Setup Instructions

### 1. Set Up ML Service

```bash
cd ml-service

# Make scripts executable
chmod +x setup.sh start.sh

# Run setup (creates venv, installs deps, generates data, trains models)
./setup.sh
```

This will:
- Create a Python virtual environment
- Install TensorFlow and dependencies
- Generate synthetic training data (~10,000+ records)
- Train LSTM models for sales forecasting
- Train neural networks for parts demand prediction
- Save trained models in `models/` directory

### 2. Start ML Service

```bash
cd ml-service
./start.sh
```

The service will start on `http://localhost:5000`

### 3. Run React Native App

```bash
# In the main project directory
npm start

# In another terminal
npm run ios  # or npm run android
```

The app will automatically connect to the ML service at `http://localhost:5000` in development mode.

## ML Models

### Sales Forecast Model

**Architecture**: LSTM (Long Short-Term Memory) Neural Network

**Purpose**: Predicts monthly sales trends and year-end projections

**Features**:
- Lookback window: 6 months
- 2 LSTM layers (64 and 32 units)
- Dropout layers for regularization
- Trained on historical sales data with seasonal patterns

**Input**: Last 6 months of sales data
**Output**: Predicted sales for next N months

### Parts Demand Model

**Architecture**: Feedforward Neural Network

**Purpose**: Predicts parts inventory needs based on sales volume and historical demand

**Features**:
- 3 hidden layers (64, 32, 16 units)
- Dropout for overfitting prevention
- Considers: current demand, sales volume, inventory level, seasonality, price

**Input**: Current demand, sales volume, inventory, month, price
**Output**: Predicted demand for next period

## API Endpoints

All endpoints return JSON data.

### Health Check
```
GET /health
```
Returns service status and model availability.

### Analytics
```
GET /api/analytics
```
Returns company-wide analytics with ML predictions:
- Total sales YTD and projected
- Parts costs YTD and projected
- Dealership performance metrics
- Monthly sales trends (with predictions for future months)

### Sales Data
```
GET /api/sales?limit=50
```
Returns recent sales records. Limit parameter is optional (default: 50).

### Parts Inventory
```
GET /api/parts
```
Returns parts inventory with ML-predicted demand and recommended stock levels.

### Service Tickets
```
GET /api/service-tickets?limit=50
```
Returns service ticket records. Limit parameter is optional (default: 50).

### Orders
```
GET /api/orders
```
Returns parts orders with intelligent recommendations based on inventory levels.

### Metadata
```
GET /api/metadata
```
Returns system metadata, model status, and data statistics.

## React Native Integration

### Service Layer (`src/services/mlService.ts`)

Provides functions to call ML API endpoints:
- `checkMLServiceHealth()` - Verify service availability
- `fetchAnalytics()` - Get analytics data
- `fetchSales()` - Get sales data
- `fetchParts()` - Get parts with predictions
- `fetchServiceTickets()` - Get service tickets
- `fetchOrders()` - Get orders

### Hooks (`src/hooks/useMLData.ts`)

React hooks that provide automatic data fetching with fallback:

```typescript
// Example usage
const {analytics, loading, usingML, error} = useAnalytics();
const {sales, loading, usingML} = useSales();
const {parts, loading, usingML} = useParts();
const {tickets, loading, usingML} = useServiceTickets();
const {orders, loading, usingML} = useOrders();
```

**Features**:
- Automatic loading states
- Error handling with fallback to mock data
- `usingML` flag indicates if using ML predictions or mock data
- Refresh capability

### Dashboard Updates

All dashboards now use ML hooks:
- ✅ C-Suite Dashboard - Analytics with projections
- ✅ Sales Dashboard - Real sales data
- ✅ Warehouse Dashboard - Parts with demand predictions
- ✅ Order Parts Screen - Intelligent ordering
- ✅ Mechanic Dashboard - Service ticket trends
- ✅ Customer Service Dashboard - (uses local data)

## Training Data

### Data Generation

The `generate_training_data.py` script creates realistic synthetic data:

**Sales History** (~5,000+ records)
- Date range: 2023-01-01 to present
- 5 dealerships across different locations
- 5 vehicle models with varying prices
- Seasonal trends and growth patterns

**Parts Inventory** (~1,000+ records)
- 8 different parts categories
- Monthly inventory levels
- Demand patterns based on sales volume
- Price and category information

**Service Tickets** (~2,000+ records)
- 10 common service issues
- Status tracking (open, in_progress, completed)
- Customer and vehicle information
- Completion time patterns

**Monthly Aggregates**
- Aggregated sales by month
- Used for time-series forecasting

**Dealership Metrics**
- Per-dealership performance
- Sales and parts cost tracking
- Gross margin calculations

### Retraining Models

To retrain with new data:

```bash
cd ml-service

# Activate virtual environment
source venv/bin/activate

# Regenerate training data (optional)
python generate_training_data.py

# Train models
python train_models.py
```

Models are automatically saved to `models/` directory.

## Production Deployment

### ML Service Deployment

Options for deploying the ML service:

1. **Heroku**
   ```bash
   heroku create ecorp-ml-service
   git subtree push --prefix ml-service heroku main
   ```

2. **AWS/GCP/Azure**
   - Deploy as a containerized service using Docker
   - Use managed ML services (AWS SageMaker, GCP AI Platform)

3. **Railway/Render**
   - Connect GitHub repository
   - Auto-deploy on push

### Environment Configuration

Update `src/services/mlService.ts`:

```typescript
const ML_SERVICE_URL = __DEV__ 
  ? 'http://localhost:5000'
  : 'https://your-production-ml-service.com';
```

## Performance Considerations

- **Model Loading**: Models are loaded once at startup
- **Prediction Speed**: Sub-second response times for all predictions
- **Caching**: Consider adding Redis cache for frequently accessed predictions
- **Scaling**: ML service can be scaled horizontally behind a load balancer

## Monitoring and Maintenance

### Model Performance

Monitor prediction accuracy over time:
- Compare predictions vs actual results
- Retrain models quarterly or when accuracy degrades
- Track Mean Absolute Error (MAE) metrics

### Service Health

- Monitor `/health` endpoint
- Set up alerts for service downtime
- Log prediction requests and errors

### Data Pipeline

- Regularly update training data with real transactions
- Maintain data quality and consistency
- Archive old training data

## Troubleshooting

### ML Service Not Starting

```bash
# Check Python version (requires 3.8+)
python3 --version

# Reinstall dependencies
cd ml-service
source venv/bin/activate
pip install -r requirements.txt
```

### Models Not Loading

```bash
# Retrain models
cd ml-service
source venv/bin/activate
python train_models.py
```

### App Shows "Offline" Data

1. Check ML service is running: `curl http://localhost:5000/health`
2. Check network connectivity
3. Review console logs in React Native app
4. Verify ML_SERVICE_URL in `mlService.ts`

## Future Enhancements

- [ ] Real-time model updates without service restart
- [ ] A/B testing framework for model versions
- [ ] Advanced anomaly detection
- [ ] Customer behavior prediction
- [ ] Automated model retraining pipeline
- [ ] GraphQL API for more flexible queries
- [ ] WebSocket support for real-time updates
- [ ] Model explainability features (SHAP values)

## Technical Stack

**Backend**:
- Python 3.8+
- TensorFlow 2.15
- Flask 3.0
- Pandas, NumPy, scikit-learn

**Frontend**:
- React Native
- TypeScript
- Custom hooks for data fetching

**Models**:
- LSTM for time-series forecasting
- Feedforward neural networks for demand prediction
- MinMax scaling for feature normalization

## License

This ML integration is part of the E Corp App and follows the same license.

## Support

For issues or questions:
1. Check this documentation
2. Review logs in `ml-service/`
3. Check React Native console for frontend errors
4. Review Flask logs for backend errors

