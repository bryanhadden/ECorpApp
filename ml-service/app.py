"""
Flask API service for E Corp ML predictions.
Serves real-time predictions from trained TensorFlow models.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json
from train_models import SalesForecastModel, PartsDemandModel

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native app

# Load models and data at startup
print("Loading models and data...")

sales_model = SalesForecastModel()
parts_model = PartsDemandModel()

try:
    sales_model.load('models/sales_forecast_model.keras')
    parts_model.load('models/parts_demand_model.keras')
    print("✓ Models loaded successfully")
except Exception as e:
    print(f"⚠ Warning: Could not load models - {e}")
    print("Run 'python train_models.py' first to train models")
    sales_model = None
    parts_model = None

# Load data
try:
    sales_df = pd.read_csv('data/sales_history.csv')
    parts_df = pd.read_csv('data/parts_inventory.csv')
    tickets_df = pd.read_csv('data/service_tickets.csv')
    monthly_df = pd.read_csv('data/monthly_aggregates.csv')
    dealership_df = pd.read_csv('data/dealership_metrics.csv')
    
    with open('data/metadata.json', 'r') as f:
        metadata = json.load(f)
    
    print("✓ Data loaded successfully")
except Exception as e:
    print(f"⚠ Warning: Could not load data - {e}")
    print("Run 'python generate_training_data.py' first to generate data")
    sales_df = parts_df = tickets_df = monthly_df = dealership_df = None
    metadata = {}


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': sales_model is not None and parts_model is not None,
        'data_loaded': sales_df is not None,
    })


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get company-wide analytics with ML predictions."""
    if sales_df is None or dealership_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    try:
        # Calculate current year metrics
        current_year = datetime.now().year
        ytd_sales = sales_df[sales_df['year'] == current_year]
        
        total_sales_ytd = ytd_sales['price'].sum()
        
        # Get recent monthly data for prediction
        recent_months = monthly_df.tail(12)
        
        # Predict next 3 months if model is available
        if sales_model:
            future_predictions = sales_model.predict_next_months(recent_months, n_months=3)
            predicted_remaining = future_predictions.sum()
        else:
            # Fallback to simple growth calculation
            avg_monthly = recent_months['total_sales'].mean()
            predicted_remaining = avg_monthly * 3
        
        total_sales_projected = total_sales_ytd + predicted_remaining
        
        # Estimate parts costs (20-25% of sales)
        total_parts_cost_ytd = total_sales_ytd * 0.225
        total_parts_cost_projected = total_sales_projected * 0.225
        
        # Get dealership metrics
        dealerships = []
        for dealership_name in dealership_df['dealership'].unique():
            dealer_data = dealership_df[dealership_df['dealership'] == dealership_name]
            
            # Get YTD data
            ytd_dealer = dealer_data[dealer_data['month'].str.startswith(str(current_year))]
            
            sales_ytd = ytd_dealer['sales_amount'].sum()
            parts_cost_ytd = ytd_dealer['parts_cost'].sum()
            
            # Project rest of year
            months_elapsed = len(ytd_dealer)
            months_remaining = 12 - months_elapsed
            
            if months_elapsed > 0:
                avg_monthly_sales = sales_ytd / months_elapsed
                projected_sales = sales_ytd + (avg_monthly_sales * months_remaining * 1.1)  # 10% growth
                projected_parts = parts_cost_ytd + (parts_cost_ytd / months_elapsed * months_remaining * 1.1)
            else:
                projected_sales = sales_ytd
                projected_parts = parts_cost_ytd
            
            location = dealer_data.iloc[0]['location']
            
            dealerships.append({
                'name': dealership_name,
                'location': location,
                'salesYTD': round(sales_ytd, 2),
                'salesProjected': round(projected_sales, 2),
                'partsCostYTD': round(parts_cost_ytd, 2),
                'partsCostProjected': round(projected_parts, 2),
            })
        
        # Get monthly sales trend for current year
        monthly_sales = []
        for month in range(1, 13):
            month_str = f'{current_year}-{month:02d}'
            month_data = sales_df[sales_df['month'] == month_str]
            
            if len(month_data) > 0:
                amount = month_data['price'].sum()
            elif sales_model and month > datetime.now().month:
                # Use prediction for future months
                amount = 0  # Will be filled by predictions
            else:
                amount = 0
            
            month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            
            monthly_sales.append({
                'month': month_names[month - 1],
                'amount': round(amount, 2)
            })
        
        # Fill in future months with predictions
        current_month = datetime.now().month
        if sales_model and current_month < 12:
            predictions = sales_model.predict_next_months(
                recent_months, 
                n_months=min(3, 12 - current_month)
            )
            for i, pred in enumerate(predictions):
                if current_month + i < 12:
                    monthly_sales[current_month + i]['amount'] = round(float(pred), 2)
        
        return jsonify({
            'totalSalesYTD': round(total_sales_ytd, 2),
            'totalSalesProjected': round(total_sales_projected, 2),
            'totalPartsCostYTD': round(total_parts_cost_ytd, 2),
            'totalPartsCostProjected': round(total_parts_cost_projected, 2),
            'dealerships': dealerships,
            'monthlySales': monthly_sales,
            'generatedAt': datetime.now().isoformat(),
            'usingML': sales_model is not None,
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sales', methods=['GET'])
def get_sales():
    """Get recent sales data."""
    if sales_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    try:
        limit = request.args.get('limit', 50, type=int)
        
        # Get most recent sales
        recent_sales = sales_df.sort_values('date', ascending=False).head(limit)
        
        sales_list = []
        for _, row in recent_sales.iterrows():
            sales_list.append({
                'id': row['id'],
                'dealership': row['dealership'],
                'model': row['model'],
                'price': round(row['price'], 2),
                'date': row['date'],
                'customerName': f"Customer {row['id'][-4:]}",  # Generate customer name
                'salesPerson': 'Sales Team',
            })
        
        return jsonify(sales_list)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/parts', methods=['GET'])
def get_parts():
    """Get parts inventory with demand predictions."""
    if parts_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    try:
        # Get most recent parts data
        latest_month = parts_df['month'].max()
        current_parts = parts_df[parts_df['month'] == latest_month]
        
        parts_list = []
        for _, row in current_parts.iterrows():
            # Predict next month's demand if model available
            if parts_model:
                predicted_demand = parts_model.predict_demand(
                    current_demand=row['demand'],
                    sales_volume=row['sales_volume'],
                    inventory_level=row['inventory_level'],
                    month=int(latest_month.split('-')[1]),
                    price=row['price']
                )
            else:
                predicted_demand = int(row['demand'])
            
            # Calculate recommended stock level
            recommended_stock = predicted_demand * 2  # Safety factor
            
            parts_list.append({
                'id': row['part_id'],
                'name': row['part_name'],
                'sku': row['sku'],
                'category': row['category'],
                'quantity': row['inventory_level'],
                'price': row['price'],
                'predictedDemand': predicted_demand,
                'recommendedStock': recommended_stock,
                'needsReorder': row['inventory_level'] < recommended_stock,
            })
        
        return jsonify(parts_list)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/service-tickets', methods=['GET'])
def get_service_tickets():
    """Get recent service tickets."""
    if tickets_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    try:
        limit = request.args.get('limit', 50, type=int)
        
        # Get most recent tickets
        recent_tickets = tickets_df.sort_values('created_at', ascending=False).head(limit)
        
        tickets_list = []
        for _, row in recent_tickets.iterrows():
            ticket = {
                'id': row['id'],
                'vehicleModel': row['vehicle_model'],
                'customerName': f"Customer {row['id'][-4:]}",
                'issue': row['issue'],
                'status': row['status'],
                'createdAt': row['created_at'],
            }
            
            if row['status'] == 'in_progress':
                ticket['assignedMechanic'] = 'Service Team'
            
            if pd.notna(row['completed_at']):
                ticket['completedAt'] = row['completed_at']
            
            tickets_list.append(ticket)
        
        return jsonify(tickets_list)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get parts orders."""
    # Generate some orders based on parts with low inventory
    if parts_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    try:
        # Get current parts inventory
        latest_month = parts_df['month'].max()
        current_parts = parts_df[parts_df['month'] == latest_month]
        
        # Create orders for parts with low inventory
        orders = []
        order_id = 1
        
        for _, row in current_parts.iterrows():
            if row['inventory_level'] < row['demand'] * 1.5:
                # Create an order
                quantity_needed = int(row['demand'] * 2 - row['inventory_level'])
                
                if quantity_needed > 0:
                    order = {
                        'id': f'O{order_id:04d}',
                        'parts': [{
                            'partId': row['part_id'],
                            'partName': row['part_name'],
                            'quantity': quantity_needed
                        }],
                        'requestedBy': 'Warehouse Team',
                        'status': np.random.choice(['pending', 'approved', 'shipped']),
                        'createdAt': (datetime.now() - timedelta(days=np.random.randint(1, 10))).strftime('%Y-%m-%d'),
                    }
                    
                    if order['status'] != 'pending':
                        delivery_date = datetime.now() + timedelta(days=np.random.randint(1, 7))
                        order['estimatedDelivery'] = delivery_date.strftime('%Y-%m-%d')
                    
                    orders.append(order)
                    order_id += 1
        
        return jsonify(orders[:10])  # Return up to 10 orders
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/metadata', methods=['GET'])
def get_metadata():
    """Get metadata about the system."""
    return jsonify({
        'metadata': metadata,
        'models': {
            'salesForecast': sales_model is not None,
            'partsDemand': parts_model is not None,
        },
        'dataStats': {
            'totalSales': len(sales_df) if sales_df is not None else 0,
            'totalParts': len(parts_df['part_id'].unique()) if parts_df is not None else 0,
            'totalTickets': len(tickets_df) if tickets_df is not None else 0,
        }
    })


if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 5001))
    print(f"\n{'='*60}")
    print(f"E Corp ML Service starting on port {port}")
    print(f"{'='*60}\n")
    app.run(host='0.0.0.0', port=port, debug=True)

