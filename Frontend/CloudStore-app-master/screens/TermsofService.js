import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsOfServiceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Terms of Service</Text>

        <Text style={styles.paragraph}>
          By using our cloud storage app, you agree to the following terms. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the app, you agree to be bound by these Terms of Service and our Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          - Do not upload illegal, harmful, or copyrighted content without authorization.{'\n'}
          - You are responsible for the security of your account and the data you upload.
        </Text>

        <Text style={styles.sectionTitle}>3. Account Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate your account if you violate these terms or misuse the service.
        </Text>

        <Text style={styles.sectionTitle}>4. Service Availability</Text>
        <Text style={styles.paragraph}>
          We strive to ensure continuous access, but we do not guarantee uninterrupted service. Maintenance and updates may occur.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          We are not liable for data loss, unauthorized access, or any damages resulting from use of the app.
        </Text>

        <Text style={styles.sectionTitle}>6. Modifications</Text>
        <Text style={styles.paragraph}>
          We may modify these terms at any time. Continued use of the app after changes means you accept the new terms.
        </Text>

        <Text style={styles.sectionTitle}>7. Governing Law</Text>
        <Text style={styles.paragraph}>
          These terms are governed by the laws of [Your Country or State].
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have questions about these terms, contact us at support@yourapp.com.
        </Text>

        <Text style={styles.lastUpdated}>Last updated: June 12, 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#111827',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 30,
    textAlign: 'center',
  },
});
