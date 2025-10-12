import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {UserRole} from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import {colors, spacing, typography} from '../../styles/theme';

const LoginScreen: React.FC = () => {
  const {login} = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

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

  const handleLogin = () => {
    if (selectedRole) {
      const roleName = roles.find(r => r.id === selectedRole)?.title || '';
      login(selectedRole, roleName);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>E Corp</Text>
          <Text style={styles.tagline}>Electric Vehicle Excellence</Text>
        </View>

        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Choose your role to access your workspace</Text>

        <View style={styles.rolesContainer}>
          {roles.map(role => (
            <TouchableOpacity
              key={role.id}
              onPress={() => setSelectedRole(role.id)}
              activeOpacity={0.7}>
              <Card style={[styles.roleCard, selectedRole === role.id && styles.roleCardSelected]}>
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Continue"
          onPress={handleLogin}
          disabled={!selectedRole}
          size="large"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 48,
  },
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
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
    borderColor: colors.transparent,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
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
  button: {
    marginBottom: spacing.xl,
  },
});

export default LoginScreen;
