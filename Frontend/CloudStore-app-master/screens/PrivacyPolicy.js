import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Privacy Policy</Text>
        
        <Text style={styles.paragraph}>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our cloud storage application.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          - Account information (name, email address, etc.){'\n'}
          - Files and documents you upload{'\n'}
          - Device and usage data (e.g. IP address, device type, crash logs)
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          - To provide and maintain our services{'\n'}
          - To improve user experience and app performance{'\n'}
          - To communicate updates, offers, and important notices
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your data, including encryption, secure servers, and access controls.
        </Text>

        <Text style={styles.sectionTitle}>4. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We do not sell your data. We may share information with trusted third parties only for the purposes of service delivery and legal compliance.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your information at any time through your account settings.
        </Text>

        <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this policy from time to time. Changes will be notified via the app or email.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns about this Privacy Policy, please contact us at support@yourapp.com.
        </Text>

        <Text style={styles.lastUpdated}>Last updated: June 12, 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

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
