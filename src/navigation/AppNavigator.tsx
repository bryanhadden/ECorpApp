import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';
import {colors} from '../styles/theme';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';

// Warehouse
import WarehouseDashboard from '../screens/warehouse/WarehouseDashboard';
import ScanPartScreen from '../screens/warehouse/ScanPartScreen';
import OrderPartsScreen from '../screens/warehouse/OrderPartsScreen';

// Dealership
import SalesDashboard from '../screens/dealership/SalesDashboard';
import CustomerServiceDashboard from '../screens/dealership/CustomerServiceDashboard';
import MechanicDashboard from '../screens/dealership/MechanicDashboard';

// C-Suite
import CSuiteDashboard from '../screens/csuite/CSuiteDashboard';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const {user, isAuthenticated} = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    );
  }

  // Warehouse Stack
  if (user.role === 'warehouse') {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen
          name="WarehouseDashboard"
          component={WarehouseDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ScanPart" component={ScanPartScreen} options={{title: 'Scan Part'}} />
        <Stack.Screen
          name="OrderParts"
          component={OrderPartsScreen}
          options={{title: 'Order Parts'}}
        />
      </Stack.Navigator>
    );
  }

  // Sales Stack
  if (user.role === 'sales') {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SalesDashboard"
          component={SalesDashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  // Customer Service Stack
  if (user.role === 'customer_service') {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CustomerServiceDashboard"
          component={CustomerServiceDashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  // Mechanic Stack
  if (user.role === 'mechanic') {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="MechanicDashboard"
          component={MechanicDashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  // C-Suite Stack
  if (user.role === 'csuite') {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CSuiteDashboard"
          component={CSuiteDashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return null;
};

export default AppNavigator;
