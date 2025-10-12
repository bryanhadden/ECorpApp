import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, typography} from '../../styles/theme';
import {mockParts} from '../../utils/mockData';

interface OrderItem {
  partId: string;
  partName: string;
  quantity: number;
  price: number;
}

const OrderPartsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [selectedParts, setSelectedParts] = useState<OrderItem[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});

  const handleAddPart = (partId: string) => {
    const part = mockParts.find(p => p.id === partId);
    const quantity = parseInt(quantities[partId] || '0', 10);

    if (!part || quantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity.');
      return;
    }

    const existing = selectedParts.find(p => p.partId === partId);
    if (existing) {
      setSelectedParts(
        selectedParts.map(p => (p.partId === partId ? {...p, quantity: p.quantity + quantity} : p)),
      );
    } else {
      setSelectedParts([
        ...selectedParts,
        {
          partId: part.id,
          partName: part.name,
          quantity,
          price: part.price,
        },
      ]);
    }

    setQuantities({...quantities, [partId]: ''});
  };

  const handleRemovePart = (partId: string) => {
    setSelectedParts(selectedParts.filter(p => p.partId !== partId));
  };

  const getTotalCost = () => {
    return selectedParts.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = () => {
    if (selectedParts.length === 0) {
      Alert.alert('Error', 'Please add at least one part to your order.');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Submit order for ${
        selectedParts.length
      } part(s) totaling $${getTotalCost().toLocaleString()}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Submit',
          onPress: () => {
            Alert.alert('Success', 'Order submitted to HQ successfully!', [
              {text: 'OK', onPress: () => navigation.goBack()},
            ]);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>📦 Order from California HQ</Text>
          <Text style={styles.infoText}>Requesting as: {user?.name}</Text>
          <Text style={styles.infoText}>Location: {user?.location}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Available Parts</Text>

        {mockParts.map(part => (
          <Card key={part.id} style={styles.partCard}>
            <View style={styles.partHeader}>
              <View style={styles.partInfo}>
                <Text style={styles.partName}>{part.name}</Text>
                <Text style={styles.partSku}>SKU: {part.sku}</Text>
                <Text style={styles.partPrice}>${part.price.toLocaleString()} per unit</Text>
              </View>
            </View>

            <View style={styles.orderSection}>
              <Input
                placeholder="Qty"
                value={quantities[part.id] || ''}
                onChangeText={text => setQuantities({...quantities, [part.id]: text})}
                keyboardType="numeric"
                containerStyle={styles.quantityInput}
              />
              <Button
                title="Add to Order"
                onPress={() => handleAddPart(part.id)}
                size="small"
                style={styles.addButton}
              />
            </View>
          </Card>
        ))}

        {selectedParts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            {selectedParts.map(item => (
              <Card key={item.partId} style={styles.orderItemCard}>
                <View style={styles.orderItemHeader}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{item.partName}</Text>
                    <Text style={styles.orderItemDetail}>
                      Quantity: {item.quantity} × ${item.price.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemovePart(item.partId)}
                    style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.orderItemTotal}>
                  Subtotal: ${(item.quantity * item.price).toLocaleString()}
                </Text>
              </Card>
            ))}

            <Card style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Cost</Text>
                <Text style={styles.totalValue}>${getTotalCost().toLocaleString()}</Text>
              </View>
            </Card>

            <Button
              title="Submit Order to HQ"
              onPress={handleSubmitOrder}
              size="large"
              style={styles.submitButton}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.primary + '10',
    marginBottom: spacing.lg,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  partCard: {
    marginBottom: spacing.md,
  },
  partHeader: {
    marginBottom: spacing.md,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  partSku: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  partPrice: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  orderSection: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  quantityInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    marginTop: 0,
  },
  orderItemCard: {
    marginBottom: spacing.md,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  orderItemDetail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    ...typography.bodyBold,
    color: colors.error,
  },
  orderItemTotal: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  totalCard: {
    backgroundColor: colors.primary + '10',
    marginBottom: spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primary,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
});

export default OrderPartsScreen;
