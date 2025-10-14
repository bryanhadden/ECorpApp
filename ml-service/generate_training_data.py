"""
Generate synthetic training data for E Corp ML models.
This script creates realistic training datasets based on the mock data patterns.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json

# Set random seed for reproducibility
np.random.seed(42)

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Configuration
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2025, 10, 13)
DEALERSHIPS = [
    {'name': 'New York Dealership', 'location': 'New York, NY', 'base_volume': 1.2},
    {'name': 'Texas Dealership', 'location': 'Austin, TX', 'base_volume': 1.0},
    {'name': 'Florida Dealership', 'location': 'Miami, FL', 'base_volume': 1.3},
    {'name': 'California Dealership', 'location': 'Los Angeles, CA', 'base_volume': 1.5},
    {'name': 'Illinois Dealership', 'location': 'Chicago, IL', 'base_volume': 1.1},
]

VEHICLE_MODELS = [
    {'model': 'E-Sedan Pro', 'base_price': 45000, 'popularity': 0.3},
    {'model': 'E-SUV Elite', 'base_price': 62000, 'popularity': 0.25},
    {'model': 'E-Compact City', 'base_price': 32000, 'popularity': 0.25},
    {'model': 'E-Truck Power', 'base_price': 75000, 'popularity': 0.15},
    {'model': 'E-Sports GT', 'base_price': 95000, 'popularity': 0.05},
]

PARTS = [
    {'id': 'P001', 'name': 'Battery Pack', 'sku': 'BAT-5000', 'category': 'Power', 'price': 8500, 'demand_factor': 1.0},
    {'id': 'P002', 'name': 'Electric Motor', 'sku': 'MOT-3000', 'category': 'Drivetrain', 'price': 12000, 'demand_factor': 0.8},
    {'id': 'P003', 'name': 'Charging Port', 'sku': 'CHG-200', 'category': 'Electrical', 'price': 450, 'demand_factor': 1.5},
    {'id': 'P004', 'name': 'Display Console', 'sku': 'DSP-100', 'category': 'Interior', 'price': 1200, 'demand_factor': 1.2},
    {'id': 'P005', 'name': 'Brake System', 'sku': 'BRK-400', 'category': 'Safety', 'price': 2500, 'demand_factor': 1.1},
    {'id': 'P006', 'name': 'Tire Set', 'sku': 'TIR-800', 'category': 'Wheels', 'price': 1800, 'demand_factor': 1.4},
    {'id': 'P007', 'name': 'Suspension Kit', 'sku': 'SUS-600', 'category': 'Chassis', 'price': 3200, 'demand_factor': 0.7},
    {'id': 'P008', 'name': 'HVAC Unit', 'sku': 'HVC-300', 'category': 'Climate', 'price': 1500, 'demand_factor': 0.9},
]

SERVICE_ISSUES = [
    'Charging port not working',
    'Battery range reduced',
    'Display console malfunction',
    'Brake system check',
    'Tire replacement needed',
    'Software update required',
    'Motor performance issue',
    'Climate control fault',
    'Suspension noise',
    'General maintenance',
]


def generate_sales_data():
    """Generate historical sales data with seasonal trends."""
    print("Generating sales data...")
    
    sales_data = []
    sale_id = 1
    
    current_date = START_DATE
    while current_date <= END_DATE:
        # Calculate seasonal factor (higher in summer and end of year)
        month = current_date.month
        seasonal_factor = 1.0 + 0.3 * np.sin((month - 3) * np.pi / 6)
        
        # Growth trend over time
        years_passed = (current_date - START_DATE).days / 365.25
        growth_factor = 1.0 + (years_passed * 0.15)  # 15% annual growth
        
        # Generate sales for each dealership
        for dealership in DEALERSHIPS:
            # Number of sales per day varies
            daily_sales = max(0, int(np.random.poisson(
                dealership['base_volume'] * seasonal_factor * growth_factor * 0.5
            )))
            
            for _ in range(daily_sales):
                # Select vehicle model based on popularity
                model = np.random.choice(
                    [v['model'] for v in VEHICLE_MODELS],
                    p=[v['popularity'] for v in VEHICLE_MODELS]
                )
                base_price = next(v['base_price'] for v in VEHICLE_MODELS if v['model'] == model)
                
                # Price variation
                price = base_price * np.random.uniform(0.95, 1.05)
                
                sales_data.append({
                    'id': f'SL{sale_id:06d}',
                    'date': current_date.strftime('%Y-%m-%d'),
                    'dealership': dealership['name'],
                    'location': dealership['location'],
                    'model': model,
                    'price': round(price, 2),
                    'month': current_date.strftime('%Y-%m'),
                    'year': current_date.year,
                    'quarter': f'Q{(month-1)//3 + 1}',
                })
                sale_id += 1
        
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(sales_data)
    df.to_csv('data/sales_history.csv', index=False)
    print(f"Generated {len(sales_data)} sales records")
    return df


def generate_parts_inventory_data(sales_df):
    """Generate parts inventory and demand data based on sales."""
    print("Generating parts inventory data...")
    
    parts_data = []
    
    # Generate monthly parts demand
    for year in range(START_DATE.year, END_DATE.year + 1):
        for month in range(1, 13):
            date_str = f'{year}-{month:02d}'
            
            # Check if this month is in our date range
            month_date = datetime(year, month, 1)
            if month_date > END_DATE:
                break
            
            # Get sales for this month
            monthly_sales = sales_df[sales_df['month'] == date_str]
            sales_volume = len(monthly_sales)
            
            for part in PARTS:
                # Calculate demand based on sales and part demand factor
                base_demand = sales_volume * part['demand_factor'] * np.random.uniform(0.8, 1.2)
                
                # Add some random variation and ensure minimum
                demand = max(1, int(base_demand + np.random.normal(0, 5)))
                
                # Inventory level (attempting to maintain buffer stock)
                inventory = max(0, int(demand * 1.5 + np.random.normal(0, 10)))
                
                parts_data.append({
                    'month': date_str,
                    'part_id': part['id'],
                    'part_name': part['name'],
                    'sku': part['sku'],
                    'category': part['category'],
                    'demand': demand,
                    'inventory_level': inventory,
                    'price': part['price'],
                    'sales_volume': sales_volume,
                })
    
    df = pd.DataFrame(parts_data)
    df.to_csv('data/parts_inventory.csv', index=False)
    print(f"Generated {len(parts_data)} parts inventory records")
    return df


def generate_service_tickets_data(sales_df):
    """Generate service ticket data based on vehicle sales."""
    print("Generating service tickets data...")
    
    tickets_data = []
    ticket_id = 1
    
    # Service tickets occur after sales
    current_date = START_DATE + timedelta(days=30)  # Start 30 days after first sales
    
    while current_date <= END_DATE:
        # Service ticket rate increases with vehicle age
        years_since_start = (current_date - START_DATE).days / 365.25
        ticket_rate = 2.0 + (years_since_start * 0.5)  # Increases over time
        
        daily_tickets = max(0, int(np.random.poisson(ticket_rate)))
        
        for _ in range(daily_tickets):
            # Select random model and issue
            model = np.random.choice([v['model'] for v in VEHICLE_MODELS])
            issue = np.random.choice(SERVICE_ISSUES)
            
            # Status distribution
            status = np.random.choice(
                ['open', 'in_progress', 'completed'],
                p=[0.2, 0.3, 0.5]
            )
            
            # Completion time if completed
            completion_days = np.random.randint(1, 7) if status == 'completed' else None
            completed_at = (current_date + timedelta(days=completion_days)).strftime('%Y-%m-%d') if completion_days else None
            
            tickets_data.append({
                'id': f'T{ticket_id:06d}',
                'created_at': current_date.strftime('%Y-%m-%d'),
                'vehicle_model': model,
                'issue': issue,
                'status': status,
                'completed_at': completed_at,
                'month': current_date.strftime('%Y-%m'),
            })
            ticket_id += 1
        
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(tickets_data)
    df.to_csv('data/service_tickets.csv', index=False)
    print(f"Generated {len(tickets_data)} service ticket records")
    return df


def generate_monthly_aggregates(sales_df):
    """Generate monthly aggregate statistics."""
    print("Generating monthly aggregates...")
    
    # Group by month
    monthly = sales_df.groupby('month').agg({
        'price': 'sum',
        'id': 'count'
    }).reset_index()
    
    monthly.columns = ['month', 'total_sales', 'units_sold']
    monthly.to_csv('data/monthly_aggregates.csv', index=False)
    print(f"Generated {len(monthly)} monthly aggregate records")
    return monthly


def generate_dealership_metrics(sales_df, parts_df):
    """Generate dealership-level performance metrics."""
    print("Generating dealership metrics...")
    
    metrics = []
    
    for year in range(START_DATE.year, END_DATE.year + 1):
        for month in range(1, 13):
            month_str = f'{year}-{month:02d}'
            
            # Filter data for this month
            month_sales = sales_df[sales_df['month'] == month_str]
            
            for dealership in DEALERSHIPS:
                dealer_sales = month_sales[month_sales['dealership'] == dealership['name']]
                
                if len(dealer_sales) == 0:
                    continue
                
                # Calculate metrics
                sales_amount = dealer_sales['price'].sum()
                units_sold = len(dealer_sales)
                
                # Estimate parts cost (roughly 20-25% of sales)
                parts_cost = sales_amount * np.random.uniform(0.20, 0.25)
                
                metrics.append({
                    'month': month_str,
                    'dealership': dealership['name'],
                    'location': dealership['location'],
                    'sales_amount': round(sales_amount, 2),
                    'units_sold': units_sold,
                    'parts_cost': round(parts_cost, 2),
                    'gross_margin': round((sales_amount - parts_cost) / sales_amount * 100, 2),
                })
    
    df = pd.DataFrame(metrics)
    df.to_csv('data/dealership_metrics.csv', index=False)
    print(f"Generated {len(metrics)} dealership metric records")
    return df


def generate_metadata():
    """Generate metadata about the datasets."""
    metadata = {
        'generated_at': datetime.now().isoformat(),
        'date_range': {
            'start': START_DATE.isoformat(),
            'end': END_DATE.isoformat(),
        },
        'dealerships': [
            {'name': d['name'], 'location': d['location']} 
            for d in DEALERSHIPS
        ],
        'vehicle_models': [
            {'model': v['model'], 'base_price': v['base_price']} 
            for v in VEHICLE_MODELS
        ],
        'parts': [
            {
                'id': p['id'], 
                'name': p['name'], 
                'sku': p['sku'],
                'category': p['category'],
                'price': p['price']
            } 
            for p in PARTS
        ],
    }
    
    with open('data/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("Generated metadata file")


def main():
    """Generate all training datasets."""
    print("Starting data generation...")
    print("=" * 50)
    
    # Generate datasets
    sales_df = generate_sales_data()
    parts_df = generate_parts_inventory_data(sales_df)
    tickets_df = generate_service_tickets_data(sales_df)
    monthly_df = generate_monthly_aggregates(sales_df)
    dealership_df = generate_dealership_metrics(sales_df, parts_df)
    generate_metadata()
    
    print("=" * 50)
    print("Data generation complete!")
    print("\nDataset Summary:")
    print(f"  - Sales records: {len(sales_df)}")
    print(f"  - Parts inventory records: {len(parts_df)}")
    print(f"  - Service tickets: {len(tickets_df)}")
    print(f"  - Monthly aggregates: {len(monthly_df)}")
    print(f"  - Dealership metrics: {len(dealership_df)}")
    print("\nFiles saved in 'data/' directory")


if __name__ == '__main__':
    main()

