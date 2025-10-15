import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, typography} from '../../styles/theme';

interface Inquiry {
  id: string;
  customerName: string;
  topic: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: Date;
}

const CustomerServiceDashboard: React.FC = () => {
  const {user, logout} = useAuth();
  const [showNewInquiry, setShowNewInquiry] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: 'I001',
      customerName: 'John Doe',
      topic: 'Charging Question',
      description: 'How long does it take to fully charge?',
      status: 'open',
      createdAt: new Date('2025-10-10'),
    },
    {
      id: 'I002',
      customerName: 'Jane Smith',
      topic: 'Warranty Info',
      description: 'What does the warranty cover?',
      status: 'resolved',
      createdAt: new Date('2025-10-09'),
    },
    {
      id: 'I003',
      customerName: 'Mike Johnson',
      topic: 'Range Concerns',
      description: "I'm worried about range anxiety. What's the real-world range?",
      status: 'open',
      createdAt: new Date('2025-10-11'),
    },
    {
      id: 'I004',
      customerName: 'Sarah Wilson',
      topic: 'Financing Options',
      description: 'What financing plans do you offer? Can I get pre-approved?',
      status: 'open',
      createdAt: new Date('2025-10-11'),
    },
    {
      id: 'I005',
      customerName: 'David Brown',
      topic: 'Maintenance Schedule',
      description: 'How often do I need to bring the car in for maintenance?',
      status: 'open',
      createdAt: new Date('2025-10-10'),
    },
    {
      id: 'I006',
      customerName: 'Lisa Garcia',
      topic: 'Test Drive Request',
      description: "I'd like to schedule a test drive for this weekend.",
      status: 'open',
      createdAt: new Date('2025-10-12'),
    },
    {
      id: 'I007',
      customerName: 'Robert Taylor',
      topic: 'Software Updates',
      description: 'How do I get the latest software updates for my vehicle?',
      status: 'resolved',
      createdAt: new Date('2025-10-08'),
    },
    {
      id: 'I008',
      customerName: 'Emily Davis',
      topic: 'Charging Station Locator',
      description: 'Where can I find charging stations near my home?',
      status: 'resolved',
      createdAt: new Date('2025-10-07'),
    },
    {
      id: 'I009',
      customerName: 'Chris Anderson',
      topic: 'Delivery Timeline',
      description: 'When will my ordered vehicle be ready for pickup?',
      status: 'resolved',
      createdAt: new Date('2025-10-06'),
    },
  ]);

  const handleLogout = () => {
    logout();
  };

  const handleSubmitInquiry = () => {
    if (!customerName || !topic || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Generate new inquiry ID
    const newId = `I${String(inquiries.length + 1).padStart(3, '0')}`;

    // Create new inquiry
    const newInquiry: Inquiry = {
      id: newId,
      customerName,
      topic,
      description,
      status: 'open',
      createdAt: new Date(),
    };

    // Add to inquiries state
    setInquiries(prevInquiries => [newInquiry, ...prevInquiries]);

    Alert.alert('Success', 'Inquiry logged successfully!');
    setShowNewInquiry(false);
    setCustomerName('');
    setTopic('');
    setDescription('');
  };

  const handleResolveInquiry = (inquiryId: string) => {
    setInquiries(prevInquiries =>
      prevInquiries.map(inquiry =>
        inquiry.id === inquiryId ? {...inquiry, status: 'resolved' as const} : inquiry,
      ),
    );
    Alert.alert('Success', 'Inquiry resolved!');
  };

  const openInquiries = inquiries.filter(i => i.status === 'open');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Customer Service</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.location}>{user?.location}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{openInquiries.length}</Text>
            <Text style={styles.statLabel}>Open Inquiries</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{inquiries.length}</Text>
            <Text style={styles.statLabel}>Total Today</Text>
          </Card>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="🎧 New Inquiry"
            onPress={() => setShowNewInquiry(!showNewInquiry)}
            size="large"
            variant={showNewInquiry ? 'secondary' : 'primary'}
          />
        </View>

        {showNewInquiry && (
          <Card style={styles.newInquiryCard}>
            <Text style={styles.cardTitle}>Log Customer Inquiry</Text>

            <Input
              label="Customer Name"
              placeholder="Enter customer name"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Input
              label="Topic"
              placeholder="e.g., Charging, Warranty, Features"
              value={topic}
              onChangeText={setTopic}
            />

            <Input
              label="Description"
              placeholder="Describe the inquiry"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />

            <Button title="Log Inquiry" onPress={handleSubmitInquiry} size="large" />
          </Card>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Inquiries</Text>
          {openInquiries.length > 0 ? (
            openInquiries.map(inquiry => (
              <Card key={inquiry.id} style={styles.inquiryCard}>
                <View style={styles.inquiryHeader}>
                  <Text style={styles.inquiryCustomer}>{inquiry.customerName}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>OPEN</Text>
                  </View>
                </View>
                <Text style={styles.inquiryTopic}>📋 {inquiry.topic}</Text>
                <Text style={styles.inquiryDescription}>{inquiry.description}</Text>
                <Text style={styles.inquiryDate}>{inquiry.createdAt.toLocaleDateString()}</Text>
                <Button
                  title="Mark as Resolved"
                  onPress={() => handleResolveInquiry(inquiry.id)}
                  variant="secondary"
                  size="small"
                  style={styles.resolveButton}
                />
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No open inquiries at the moment</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Resolved</Text>
          {inquiries
            .filter(i => i.status === 'resolved')
            .slice(0, 3)
            .map(inquiry => (
              <Card key={inquiry.id} style={styles.inquiryCard}>
                <View style={styles.inquiryHeader}>
                  <Text style={styles.inquiryCustomer}>{inquiry.customerName}</Text>
                  <View style={[styles.statusBadge, {backgroundColor: colors.success + '20'}]}>
                    <Text style={[styles.statusText, {color: colors.success}]}>RESOLVED</Text>
                  </View>
                </View>
                <Text style={styles.inquiryTopic}>📋 {inquiry.topic}</Text>
                <Text style={styles.inquiryDescription}>{inquiry.description}</Text>
                <Text style={styles.inquiryDate}>{inquiry.createdAt.toLocaleDateString()}</Text>
              </Card>
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Topics</Text>
          <Card style={styles.topicCard}>
            <Text style={styles.topicItem}>🔋 Charging & Range</Text>
            <Text style={styles.topicItem}>🛡️ Warranty Information</Text>
            <Text style={styles.topicItem}>🔧 Maintenance Schedule</Text>
            <Text style={styles.topicItem}>💳 Financing Options</Text>
            <Text style={styles.topicItem}>🚗 Test Drive Booking</Text>
          </Card>
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
  },
  newInquiryCard: {
    margin: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inquiryCard: {
    marginBottom: spacing.md,
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inquiryCustomer: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.warning + '20',
    borderRadius: 12,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.warning,
  },
  inquiryTopic: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  inquiryDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inquiryDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  resolveButton: {
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
  topicCard: {
    paddingVertical: spacing.lg,
  },
  topicItem: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});

export default CustomerServiceDashboard;
