import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, typography} from '../../styles/theme';
import {useSales} from '../../hooks/useMLData';

const SalesDashboard: React.FC = () => {
  const {user, logout} = useAuth();
  const {sales, loading, usingML} = useSales();
  const [showNewSale, setShowNewSale] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');

  const userSales = sales.filter(sale => sale.salesPerson === user?.name);

  const totalSales = userSales.reduce((sum, sale) => sum + sale.price, 0);

  // // Debug logging
  // console.log('Sales Dashboard Debug:', {
  //   totalSalesCount: sales.length,
  //   userSalesCount: userSales.length,
  //   totalSalesValue: totalSales,
  //   usingML,
  //   userName: user?.name,
  // });

  const handleLogout = () => {
    logout();
  };

  const handleSubmitSale = () => {
    if (!customerName || !model || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Note: In a real app, this would be saved to backend
    // For now, we'll just show success and reset form
    Alert.alert('Success', 'New sale recorded successfully!');
    setShowNewSale(false);
    setCustomerName('');
    setModel('');
    setPrice('');
  };

  const vehicles = [
    {name: 'E-Sedan Pro', price: 45000},
    {name: 'E-Sedan Elite', price: 55000},
    {name: 'E-SUV Pro', price: 52000},
    {name: 'E-SUV Elite', price: 62000},
    {name: 'E-Sport', price: 75000},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Sales Dashboard {usingML ? '(ML)' : ''}</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.location}>{user?.location}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{userSales.length}</Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>${(totalSales / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Total Value</Text>
            </Card>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              title="🚗 New Sale"
              onPress={() => setShowNewSale(!showNewSale)}
              size="large"
              variant={showNewSale ? 'secondary' : 'primary'}
            />
          </View>

          {showNewSale && (
            <Card style={styles.newSaleCard}>
              <Text style={styles.cardTitle}>Record New Sale</Text>

              <Input
                label="Customer Name"
                placeholder="Enter customer name"
                value={customerName}
                onChangeText={setCustomerName}
              />

              <Text style={styles.inputLabel}>Select Model</Text>
              <View style={styles.modelsContainer}>
                {vehicles.map(vehicle => (
                  <TouchableOpacity
                    key={vehicle.name}
                    onPress={() => {
                      setModel(vehicle.name);
                      setPrice(vehicle.price.toString());
                    }}
                    activeOpacity={0.7}>
                    <Card
                      style={[
                        styles.modelCard,
                        model === vehicle.name && styles.modelCardSelected,
                      ]}>
                      <Text style={styles.modelName}>{vehicle.name}</Text>
                      <Text style={styles.modelPrice}>${vehicle.price.toLocaleString()}</Text>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Sale Price"
                placeholder="Enter final price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <Button title="Record Sale" onPress={handleSubmitSale} size="large" />
            </Card>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Sales</Text>
            {userSales.length > 0 ? (
              userSales.map(sale => (
                <Card key={sale.id} style={styles.saleCard}>
                  <View style={styles.saleHeader}>
                    <Text style={styles.saleCustomer}>{sale.customerName}</Text>
                    <Text style={styles.salePrice}>${sale.price.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.saleModel}>🚗 {sale.model}</Text>
                  <Text style={styles.saleDate}>{sale.date.toLocaleDateString()}</Text>
                </Card>
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>No sales recorded yet</Text>
              </Card>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Lineup</Text>
            {vehicles.map(vehicle => (
              <Card key={vehicle.name} style={styles.vehicleCard}>
                <Text style={styles.vehicleName}>🚗 {vehicle.name}</Text>
                <Text style={styles.vehiclePrice}>
                  Starting at ${vehicle.price.toLocaleString()}
                </Text>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcome: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    ...typography.h2,
    color: colors.white,
    marginTop: spacing.xs,
  },
  location: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    ...typography.h1,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsContainer: {
    paddingHorizontal: spacing.lg,
  },
  newSaleCard: {
    margin: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  modelsContainer: {
    marginBottom: spacing.md,
  },
  modelCard: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  modelCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  modelName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  modelPrice: {
    ...typography.body,
    color: colors.primary,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  saleCard: {
    marginBottom: spacing.md,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  saleCustomer: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  salePrice: {
    ...typography.h3,
    color: colors.success,
  },
  saleModel: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  saleDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  vehicleCard: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  vehiclePrice: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default SalesDashboard;
