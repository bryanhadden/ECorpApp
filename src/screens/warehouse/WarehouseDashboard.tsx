import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {colors, spacing, typography} from '../../styles/theme';
import {mockParts, mockScanRecords} from '../../utils/mockData';

const WarehouseDashboard: React.FC = () => {
  const navigation = useNavigation();
  const {user, logout} = useAuth();

  const todayScans = mockScanRecords.filter(record => {
    const today = new Date();
    return (
      record.timestamp.getDate() === today.getDate() &&
      record.timestamp.getMonth() === today.getMonth()
    );
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.location}>{user?.location}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockParts.length}</Text>
            <Text style={styles.statLabel}>Parts in Stock</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{todayScans.length}</Text>
            <Text style={styles.statLabel}>Scans Today</Text>
          </Card>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="📷 Scan Part"
            onPress={() => navigation.navigate('ScanPart' as never)}
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="📦 Order from HQ"
            onPress={() => navigation.navigate('OrderParts' as never)}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {todayScans.length > 0 ? (
            todayScans.map(record => (
              <Card key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordTitle}>{record.partName}</Text>
                  <View
                    style={[
                      styles.typeBadge,
                      record.type === 'incoming'
                        ? styles.typeBadgeIncoming
                        : styles.typeBadgeOutgoing,
                    ]}>
                    <Text style={styles.typeBadgeText}>
                      {record.type === 'incoming' ? '📥' : '📤'} {record.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.recordDetail}>SKU: {record.sku}</Text>
                <Text style={styles.recordDetail}>Quantity: {record.quantity}</Text>
                {record.destination && (
                  <Text style={styles.recordDetail}>To: {record.destination}</Text>
                )}
                <Text style={styles.recordTime}>{record.timestamp.toLocaleTimeString()}</Text>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No scans recorded today</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parts Inventory</Text>
          {mockParts.map(part => (
            <Card key={part.id} style={styles.partCard}>
              <View style={styles.partHeader}>
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{part.name}</Text>
                  <Text style={styles.partSku}>SKU: {part.sku}</Text>
                </View>
                <View style={styles.partQuantity}>
                  <Text style={styles.quantityValue}>{part.quantity}</Text>
                  <Text style={styles.quantityLabel}>in stock</Text>
                </View>
              </View>
              <View style={styles.partDetails}>
                <Text style={styles.partDetail}>📍 Location: {part.location}</Text>
                <Text style={styles.partDetail}>🏷️ ${part.price.toLocaleString()}</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  recordCard: {
    marginBottom: spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recordTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  typeBadgeIncoming: {
    backgroundColor: colors.success + '20',
  },
  typeBadgeOutgoing: {
    backgroundColor: colors.primary + '20',
  },
  typeBadgeText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recordDetail: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  recordTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  partCard: {
    marginBottom: spacing.md,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
  partQuantity: {
    alignItems: 'flex-end',
  },
  quantityValue: {
    ...typography.h3,
    color: colors.primary,
  },
  quantityLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  partDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  partDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default WarehouseDashboard;
