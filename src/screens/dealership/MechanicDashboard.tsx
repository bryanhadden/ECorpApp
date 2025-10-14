import React from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {colors, spacing, typography} from '../../styles/theme';
import {useServiceTickets} from '../../hooks/useMLData';

const MechanicDashboard: React.FC = () => {
  const {user, logout} = useAuth();
  const {tickets, loading, usingML} = useServiceTickets();

  const myTickets = tickets.filter(ticket => ticket.assignedMechanic === user?.name);

  const openTickets = tickets.filter(ticket => ticket.status === 'open');

  const handleLogout = () => {
    logout();
  };

  const handleClaimTicket = (_ticketId: string) => {
    Alert.alert('Success', 'Service ticket assigned to you!');
  };

  const handleCompleteTicket = (_ticketId: string) => {
    Alert.alert('Success', 'Service ticket marked as completed!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return colors.warning;
      case 'in_progress':
        return colors.primary;
      case 'completed':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    return getStatusColor(status) + '20';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Service Bay {usingML ? '(ML)' : ''}</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.location}>{user?.location}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
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
            <Text style={styles.statValue}>{myTickets.length}</Text>
            <Text style={styles.statLabel}>My Active Tickets</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{openTickets.length}</Text>
            <Text style={styles.statLabel}>Unassigned</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Service Tickets</Text>
          {myTickets.length > 0 ? (
            myTickets.map(ticket => (
              <Card key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketVehicle}>🚗 {ticket.vehicleModel}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getStatusBgColor(ticket.status)},
                    ]}>
                    <Text style={[styles.statusText, {color: getStatusColor(ticket.status)}]}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketCustomer}>Customer: {ticket.customerName}</Text>
                <Text style={styles.ticketIssue}>🔧 {ticket.issue}</Text>
                <Text style={styles.ticketDate}>
                  Created: {ticket.createdAt.toLocaleDateString()}
                </Text>

                {ticket.status === 'in_progress' && (
                  <Button
                    title="Mark as Completed"
                    onPress={() => handleCompleteTicket(ticket.id)}
                    variant="secondary"
                    size="small"
                    style={styles.actionButton}
                  />
                )}
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No assigned tickets at the moment</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tickets</Text>
          {openTickets.length > 0 ? (
            openTickets.map(ticket => (
              <Card key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketVehicle}>🚗 {ticket.vehicleModel}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getStatusBgColor(ticket.status)},
                    ]}>
                    <Text style={[styles.statusText, {color: getStatusColor(ticket.status)}]}>
                      OPEN
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketCustomer}>Customer: {ticket.customerName}</Text>
                <Text style={styles.ticketIssue}>🔧 {ticket.issue}</Text>
                <Text style={styles.ticketDate}>
                  Created: {ticket.createdAt.toLocaleDateString()}
                </Text>

                <Button
                  title="Claim Ticket"
                  onPress={() => handleClaimTicket(ticket.id)}
                  variant="outline"
                  size="small"
                  style={styles.actionButton}
                />
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No unassigned tickets available</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Services</Text>
          <Card style={styles.servicesCard}>
            <Text style={styles.serviceItem}>🔋 Battery Diagnostics</Text>
            <Text style={styles.serviceItem}>🔌 Charging System Check</Text>
            <Text style={styles.serviceItem}>⚡ Motor Inspection</Text>
            <Text style={styles.serviceItem}>🛞 Tire Rotation</Text>
            <Text style={styles.serviceItem}>🖥️ Software Update</Text>
            <Text style={styles.serviceItem}>❄️ Climate System Service</Text>
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
    textAlign: 'center',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  ticketCard: {
    marginBottom: spacing.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ticketVehicle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  ticketCustomer: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  ticketIssue: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ticketDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  actionButton: {
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
  servicesCard: {
    paddingVertical: spacing.lg,
  },
  serviceItem: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});

export default MechanicDashboard;
