import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, typography} from '../../styles/theme';
import {mockParts} from '../../utils/mockData';

interface ScannedPart {
  sku: string;
  name: string;
  quantity: number;
  location?: string;
}

const ScanPartScreen: React.FC = () => {
  const navigation = useNavigation();
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState<'incoming' | 'outgoing' | null>(null);
  const [destination, setDestination] = useState('');
  const [scannedPart, setScannedPart] = useState<ScannedPart | null>(null);

  const handleScan = () => {
    // Simulate scanning
    const part = mockParts.find(p => p.sku === sku.toUpperCase());
    if (part) {
      setScannedPart(part);
    } else {
      Alert.alert('Error', 'Part not found. Please check the SKU.');
    }
  };

  const handleSubmit = () => {
    if (!type || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (type === 'outgoing' && !destination) {
      Alert.alert('Error', 'Please specify a destination for outgoing parts.');
      return;
    }

    Alert.alert('Success', 'Part scan recorded successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleSimulateScan = () => {
    // Simulate scanning a barcode by using the first part
    setSku(mockParts[0].sku);
    setScannedPart(mockParts[0]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.scanCard}>
          <Text style={styles.scanTitle}>📷 Scan Barcode</Text>
          <Text style={styles.scanDescription}>
            Enter SKU manually or tap the button below to simulate scanning
          </Text>
          <Button
            title="Simulate Barcode Scan"
            onPress={handleSimulateScan}
            variant="outline"
            style={styles.scanButton}
          />
        </Card>

        <Input
          label="Part SKU"
          placeholder="Enter or scan SKU"
          value={sku}
          onChangeText={setSku}
          autoCapitalize="characters"
        />

        {!scannedPart && <Button title="Search Part" onPress={handleScan} />}

        {scannedPart && (
          <>
            <Card style={styles.partInfoCard}>
              <Text style={styles.partInfoTitle}>✅ Part Found</Text>
              <Text style={styles.partName}>{scannedPart.name}</Text>
              <Text style={styles.partDetail}>SKU: {scannedPart.sku}</Text>
              <Text style={styles.partDetail}>Current Stock: {scannedPart.quantity}</Text>
              <Text style={styles.partDetail}>
                Location: {scannedPart.location || 'Not specified'}
              </Text>
            </Card>

            <Text style={styles.sectionTitle}>Scan Details</Text>

            <View style={styles.typeContainer}>
              <Button
                title="📥 Incoming"
                onPress={() => setType('incoming')}
                variant={type === 'incoming' ? 'primary' : 'outline'}
                style={styles.typeButton}
              />
              <Button
                title="📤 Outgoing"
                onPress={() => setType('outgoing')}
                variant={type === 'outgoing' ? 'primary' : 'outline'}
                style={styles.typeButton}
              />
            </View>

            <Input
              label="Quantity"
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            {type === 'outgoing' && (
              <Input
                label="Destination"
                placeholder="e.g., New York Dealership"
                value={destination}
                onChangeText={setDestination}
              />
            )}

            <Button
              title="Submit Scan"
              onPress={handleSubmit}
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
  scanCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
  },
  scanTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  scanDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scanButton: {
    width: '100%',
  },
  partInfoCard: {
    backgroundColor: colors.success + '10',
    borderWidth: 2,
    borderColor: colors.success,
    marginBottom: spacing.lg,
  },
  partInfoTitle: {
    ...typography.h3,
    color: colors.success,
    marginBottom: spacing.md,
  },
  partName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  partDetail: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default ScanPartScreen;
