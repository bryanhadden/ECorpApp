import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Card from '../../components/Card';
import {colors, spacing, typography} from '../../styles/theme';
import {useAnalytics} from '../../hooks/useMLData';

const CSuiteDashboard: React.FC = () => {
  const {user, logout} = useAuth();
  const {analytics, loading, usingML, refresh} = useAnalytics();

  const handleLogout = () => {
    logout();
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const getProjectionPercentage = (ytd: number, projected: number) => {
    const percentage = ((projected - ytd) / ytd) * 100;
    return `+${percentage.toFixed(0)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Executive Dashboard</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.subtitle}>
            E Corp Analytics {usingML ? '(ML Powered)' : '(Offline)'}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={refresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company Overview</Text>

            <Card style={styles.metricCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Total Sales YTD</Text>
                  <Text style={styles.metricValue}>{formatCurrency(analytics.totalSalesYTD)}</Text>
                  <Text style={styles.metricSubtext}>Year to Date</Text>
                </View>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Projected 2025</Text>
                  <Text style={[styles.metricValue, styles.projectedValue]}>
                    {formatCurrency(analytics.totalSalesProjected)}
                  </Text>
                  <Text style={styles.projectionBadge}>
                    {getProjectionPercentage(
                      analytics.totalSalesYTD,
                      analytics.totalSalesProjected,
                    )}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.metricCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Parts Cost YTD</Text>
                  <Text style={[styles.metricValue, styles.costValue]}>
                    {formatCurrency(analytics.totalPartsCostYTD)}
                  </Text>
                  <Text style={styles.metricSubtext}>Operating Expense</Text>
                </View>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Projected Cost</Text>
                  <Text style={[styles.metricValue, styles.costValue]}>
                    {formatCurrency(analytics.totalPartsCostProjected)}
                  </Text>
                  <Text style={styles.metricSubtext}>
                    {((analytics.totalPartsCostYTD / analytics.totalSalesYTD) * 100).toFixed(1)}% of
                    sales
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Sales Trend</Text>
            <Card style={styles.chartCard}>
              {analytics.monthlySales.map((month, index) => {
                const maxSales = Math.max(...analytics.monthlySales.map(m => m.amount));
                const barWidth = (month.amount / maxSales) * 100;

                return (
                  <View key={index} style={styles.barContainer}>
                    <Text style={styles.monthLabel}>{month.month}</Text>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            width: `${barWidth}%`,
                            backgroundColor:
                              index === analytics.monthlySales.length - 1
                                ? colors.warning
                                : colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.amountLabel}>${(month.amount / 1000).toFixed(0)}K</Text>
                  </View>
                );
              })}
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dealership Performance</Text>

            {analytics.dealerships.map((dealership, index) => (
              <Card key={index} style={styles.dealershipCard}>
                <View style={styles.dealershipHeader}>
                  <View>
                    <Text style={styles.dealershipName}>{dealership.name}</Text>
                    <Text style={styles.dealershipLocation}>📍 {dealership.location}</Text>
                  </View>
                </View>

                <View style={styles.dealershipMetrics}>
                  <View style={styles.dealershipMetric}>
                    <Text style={styles.dealershipMetricLabel}>Sales YTD</Text>
                    <Text style={styles.dealershipMetricValue}>
                      {formatCurrency(dealership.salesYTD)}
                    </Text>
                    <Text style={styles.dealershipMetricProjection}>
                      → {formatCurrency(dealership.salesProjected)}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.dealershipMetric}>
                    <Text style={styles.dealershipMetricLabel}>Parts Cost</Text>
                    <Text style={[styles.dealershipMetricValue, styles.costValue]}>
                      {formatCurrency(dealership.partsCostYTD)}
                    </Text>
                    <Text style={styles.dealershipMetricProjection}>
                      → {formatCurrency(dealership.partsCostProjected)}
                    </Text>
                  </View>
                </View>

                <View style={styles.marginCard}>
                  <Text style={styles.marginLabel}>Gross Margin</Text>
                  <Text style={styles.marginValue}>
                    {(
                      ((dealership.salesYTD - dealership.partsCostYTD) / dealership.salesYTD) *
                      100
                    ).toFixed(1)}
                    %
                  </Text>
                </View>
              </Card>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>

            <Card style={styles.kpiCard}>
              <View style={styles.kpiRow}>
                <View style={styles.kpi}>
                  <Text style={styles.kpiValue}>{analytics.dealerships.length}</Text>
                  <Text style={styles.kpiLabel}>Active Dealerships</Text>
                </View>
                <View style={styles.kpi}>
                  <Text style={styles.kpiValue}>
                    {(analytics.totalSalesYTD / analytics.dealerships.length / 1000000).toFixed(1)}M
                  </Text>
                  <Text style={styles.kpiLabel}>Avg per Dealership</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.kpiCard}>
              <View style={styles.kpiRow}>
                <View style={styles.kpi}>
                  <Text style={styles.kpiValue}>
                    {(
                      ((analytics.totalSalesYTD - analytics.totalPartsCostYTD) /
                        analytics.totalSalesYTD) *
                      100
                    ).toFixed(1)}
                    %
                  </Text>
                  <Text style={styles.kpiLabel}>Company Margin</Text>
                </View>
                <View style={styles.kpi}>
                  <Text style={styles.kpiValue}>Q4</Text>
                  <Text style={styles.kpiLabel}>Current Quarter</Text>
                </View>
              </View>
            </Card>
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
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
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
  subtitle: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  refreshButton: {
    padding: spacing.sm,
  },
  refreshText: {
    fontSize: 24,
    color: colors.white,
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
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metricCard: {
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricColumn: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  metricValue: {
    ...typography.h1,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  projectedValue: {
    color: colors.primary,
  },
  costValue: {
    color: colors.error,
  },
  metricSubtext: {
    ...typography.small,
    color: colors.textSecondary,
  },
  projectionBadge: {
    ...typography.bodyBold,
    color: colors.success,
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  chartCard: {
    paddingVertical: spacing.lg,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    width: 40,
  },
  barWrapper: {
    flex: 1,
    height: 24,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 60,
    textAlign: 'right',
  },
  dealershipCard: {
    marginBottom: spacing.md,
  },
  dealershipHeader: {
    marginBottom: spacing.md,
  },
  dealershipName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  dealershipLocation: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dealershipMetrics: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  dealershipMetric: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  dealershipMetricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dealershipMetricValue: {
    ...typography.h3,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  dealershipMetricProjection: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  marginCard: {
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  marginValue: {
    ...typography.h3,
    color: colors.primary,
  },
  kpiCard: {
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  kpi: {
    alignItems: 'center',
    flex: 1,
  },
  kpiValue: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CSuiteDashboard;
