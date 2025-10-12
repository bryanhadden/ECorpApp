import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {UserRole} from '../../types';
import Card from '../../components/Card';
import {colors, spacing, typography} from '../../styles/theme';

const LoginScreen: React.FC = () => {
  const {login} = useAuth();

  const roles = [
    {
      id: 'warehouse' as UserRole,
      title: 'Warehouse Worker',
      description: 'Scan parts & manage inventory',
      icon: '📦',
    },
    {
      id: 'sales' as UserRole,
      title: 'Sales Person',
      description: 'Manage sales & customers',
      icon: '💼',
    },
    {
      id: 'customer_service' as UserRole,
      title: 'Customer Service',
      description: 'Handle customer inquiries',
      icon: '🎧',
    },
    {
      id: 'mechanic' as UserRole,
      title: 'Mechanic',
      description: 'Service tickets & repairs',
      icon: '🔧',
    },
    {
      id: 'csuite' as UserRole,
      title: 'Executive',
      description: 'View analytics & reports',
      icon: '📊',
    },
  ];

  const handleRoleSelect = (roleId: UserRole) => {
    const roleName = roles.find(r => r.id === roleId)?.title || '';
    login(roleId, roleName);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>E Corp</Text>
            <Text style={styles.tagline}>Electric Vehicle Excellence</Text>
          </View>

          <Text style={styles.subtitle}>Choose your role to access your workspace</Text>

          <View style={styles.rolesContainer}>
            {roles.map(role => (
              <TouchableOpacity
                key={role.id}
                onPress={() => handleRoleSelect(role.id)}
                activeOpacity={0.7}>
                <Card style={styles.roleCard}>
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 42,
  },
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  rolesContainer: {
    marginBottom: spacing.xl,
  },
  roleCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  roleTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  roleDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoginScreen;
