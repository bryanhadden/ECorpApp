"""
Train TensorFlow models for E Corp predictions.
Creates LSTM models for time-series forecasting of sales and parts demand.
"""

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import os
import pickle
import json

# Set random seed for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Create models directory
os.makedirs('models', exist_ok=True)


class SalesForecastModel:
    """LSTM model for sales forecasting."""
    
    def __init__(self, lookback=6):
        self.lookback = lookback
        self.model = None
        self.scaler = MinMaxScaler()
        
    def prepare_sequences(self, data, target_col='total_sales'):
        """Prepare time series sequences for LSTM."""
        # Scale the data
        scaled_data = self.scaler.fit_transform(data[[target_col]])
        
        X, y = [], []
        for i in range(len(scaled_data) - self.lookback):
            X.append(scaled_data[i:i + self.lookback])
            y.append(scaled_data[i + self.lookback])
        
        return np.array(X), np.array(y)
    
    def build_model(self, input_shape):
        """Build LSTM model architecture."""
        model = keras.Sequential([
            keras.layers.LSTM(64, activation='relu', return_sequences=True, 
                            input_shape=input_shape),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(32, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1)
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def train(self, monthly_data):
        """Train the sales forecast model."""
        print("Training sales forecast model...")
        
        # Prepare data
        X, y = self.prepare_sequences(monthly_data)
        
        if len(X) == 0:
            raise ValueError("Not enough data for training")
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )
        
        # Build and train model
        self.model = self.build_model((X.shape[1], X.shape[2]))
        
        early_stopping = keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True
        )
        
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=100,
            batch_size=8,
            callbacks=[early_stopping],
            verbose=1
        )
        
        # Evaluate
        train_loss, train_mae = self.model.evaluate(X_train, y_train, verbose=0)
        val_loss, val_mae = self.model.evaluate(X_val, y_val, verbose=0)
        
        print(f"Training MAE: {train_mae:.2f}, Validation MAE: {val_mae:.2f}")
        
        return history
    
    def predict_next_months(self, recent_data, n_months=3):
        """Predict sales for the next n months."""
        # Get the most recent lookback period
        scaled_data = self.scaler.transform(recent_data[['total_sales']].values)
        
        predictions = []
        current_sequence = scaled_data[-self.lookback:].reshape(1, self.lookback, 1)
        
        for _ in range(n_months):
            # Predict next value
            pred_scaled = self.model.predict(current_sequence, verbose=0)
            predictions.append(pred_scaled[0, 0])
            
            # Update sequence for next prediction
            current_sequence = np.append(
                current_sequence[:, 1:, :],
                pred_scaled.reshape(1, 1, 1),
                axis=1
            )
        
        # Inverse transform predictions
        predictions = self.scaler.inverse_transform(
            np.array(predictions).reshape(-1, 1)
        )
        
        return predictions.flatten()
    
    def save(self, path='models/sales_forecast_model.keras'):
        """Save model and scaler."""
        self.model.save(path)
        with open(path.replace('.keras', '_scaler.pkl'), 'wb') as f:
            pickle.dump(self.scaler, f)
        print(f"Model saved to {path}")
    
    def load(self, path='models/sales_forecast_model.keras'):
        """Load model and scaler."""
        self.model = keras.models.load_model(path)
        with open(path.replace('.keras', '_scaler.pkl'), 'rb') as f:
            self.scaler = pickle.load(f)


class PartsDemandModel:
    """Model for predicting parts demand."""
    
    def __init__(self):
        self.model = None
        self.scaler_X = MinMaxScaler()
        self.scaler_y = MinMaxScaler()
        
    def prepare_data(self, parts_data):
        """Prepare features for parts demand prediction."""
        # Features: sales_volume, month number, historical demand
        features = []
        targets = []
        
        for part_id in parts_data['part_id'].unique():
            part_data = parts_data[parts_data['part_id'] == part_id].sort_values('month')
            
            for i in range(len(part_data) - 1):
                row = part_data.iloc[i]
                next_row = part_data.iloc[i + 1]
                
                # Extract month number
                month_num = int(row['month'].split('-')[1])
                
                features.append([
                    row['demand'],
                    row['sales_volume'],
                    row['inventory_level'],
                    month_num,
                    row['price']
                ])
                targets.append(next_row['demand'])
        
        X = np.array(features)
        y = np.array(targets).reshape(-1, 1)
        
        # Scale features
        X_scaled = self.scaler_X.fit_transform(X)
        y_scaled = self.scaler_y.fit_transform(y)
        
        return X_scaled, y_scaled
    
    def build_model(self, input_dim):
        """Build neural network for parts demand."""
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_dim=input_dim),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1, activation='relu')  # Demand is always positive
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def train(self, parts_data):
        """Train the parts demand model."""
        print("Training parts demand model...")
        
        # Prepare data
        X, y = self.prepare_data(parts_data)
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Build and train model
        self.model = self.build_model(X.shape[1])
        
        early_stopping = keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=20,
            restore_best_weights=True
        )
        
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=100,
            batch_size=32,
            callbacks=[early_stopping],
            verbose=1
        )
        
        # Evaluate
        train_loss, train_mae = self.model.evaluate(X_train, y_train, verbose=0)
        val_loss, val_mae = self.model.evaluate(X_val, y_val, verbose=0)
        
        print(f"Training MAE: {train_mae:.2f}, Validation MAE: {val_mae:.2f}")
        
        return history
    
    def predict_demand(self, current_demand, sales_volume, inventory_level, 
                      month, price):
        """Predict parts demand for next period."""
        features = np.array([[
            current_demand,
            sales_volume,
            inventory_level,
            month,
            price
        ]])
        
        features_scaled = self.scaler_X.transform(features)
        prediction_scaled = self.model.predict(features_scaled, verbose=0)
        prediction = self.scaler_y.inverse_transform(prediction_scaled)
        
        return max(0, int(prediction[0, 0]))
    
    def save(self, path='models/parts_demand_model.keras'):
        """Save model and scalers."""
        self.model.save(path)
        with open(path.replace('.keras', '_scaler_X.pkl'), 'wb') as f:
            pickle.dump(self.scaler_X, f)
        with open(path.replace('.keras', '_scaler_y.pkl'), 'wb') as f:
            pickle.dump(self.scaler_y, f)
        print(f"Model saved to {path}")
    
    def load(self, path='models/parts_demand_model.keras'):
        """Load model and scalers."""
        self.model = keras.models.load_model(path)
        with open(path.replace('.keras', '_scaler_X.pkl'), 'rb') as f:
            self.scaler_X = pickle.load(f)
        with open(path.replace('.keras', '_scaler_y.pkl'), 'rb') as f:
            self.scaler_y = pickle.load(f)


def train_all_models():
    """Train all models with the generated data."""
    print("=" * 60)
    print("Training E Corp ML Models")
    print("=" * 60)
    
    # Load data
    print("\nLoading datasets...")
    monthly_data = pd.read_csv('data/monthly_aggregates.csv')
    parts_data = pd.read_csv('data/parts_inventory.csv')
    
    print(f"Loaded {len(monthly_data)} monthly records")
    print(f"Loaded {len(parts_data)} parts records")
    
    # Train sales forecast model
    print("\n" + "=" * 60)
    sales_model = SalesForecastModel(lookback=6)
    sales_model.train(monthly_data)
    sales_model.save()
    
    # Test prediction
    print("\nTesting sales forecast...")
    predictions = sales_model.predict_next_months(monthly_data, n_months=3)
    print(f"Next 3 months predictions: {predictions}")
    
    # Train parts demand model
    print("\n" + "=" * 60)
    parts_model = PartsDemandModel()
    parts_model.train(parts_data)
    parts_model.save()
    
    # Test prediction
    print("\nTesting parts demand prediction...")
    test_demand = parts_model.predict_demand(
        current_demand=50,
        sales_volume=100,
        inventory_level=75,
        month=10,
        price=8500
    )
    print(f"Predicted demand: {test_demand}")
    
    # Save training info
    training_info = {
        'trained_at': pd.Timestamp.now().isoformat(),
        'sales_model': {
            'lookback': sales_model.lookback,
            'training_samples': len(monthly_data) - sales_model.lookback,
        },
        'parts_model': {
            'training_samples': len(parts_data),
        },
        'datasets': {
            'monthly_aggregates': len(monthly_data),
            'parts_inventory': len(parts_data),
        }
    }
    
    with open('models/training_info.json', 'w') as f:
        json.dump(training_info, f, indent=2)
    
    print("\n" + "=" * 60)
    print("Training complete!")
    print("Models saved in 'models/' directory")
    print("=" * 60)


if __name__ == '__main__':
    train_all_models()

