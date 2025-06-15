import React, { useState, useEffect } from 'react';
import {
StyleSheet,Text,View,Image,Switch,FlatList,TouchableOpacity,SafeAreaView,StatusBar,Alert,Modal,TextInput,ScrollView,} from 'react-native';

// Main Settings Screen Component
const SettingsScreen = ({ navigation }) => {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [twoStep, setTwoStep] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  
  // User profile state
  const [userName, setUserName] = useState('Addisons Sedudzi');
  const [userEmail] = useState('Addison.Sedudzi@example.com');
  const [userInitials, setUserInitials] = useState('AS');

  // Sync status state
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Generate initials from name
  const generateInitials = (name) => {
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Update initials when name changes
  useEffect(() => {
    setUserInitials(generateInitials(userName));
  }, [userName]);

  const toggleSync = () => {
    const newSyncState = !syncEnabled;
    setSyncEnabled(newSyncState);
    
    if (newSyncState) {
      // Simulate sync process
      setSyncInProgress(true);
      setTimeout(() => {
        setSyncInProgress(false);
        setLastSyncTime('Just now');
        Alert.alert('Sync Enabled', 'Your files will now sync automatically across all devices.');
      }, 2000);
    } else {
      Alert.alert('Sync Disabled', 'Auto-sync has been turned off. You can still manually sync your files.');
    }
    
    console.log(`Sync is now ${newSyncState ? 'ON' : 'OFF'}`);
  };

  const toggleTwoStep = () => {
    const newTwoStepState = !twoStep;
    
    if (!newTwoStepState) {
      // Show confirmation when disabling 2FA
      Alert.alert(
        'Disable Two-Factor Authentication',
        'This will make your account less secure. Are you sure you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              setTwoStep(false);
              Alert.alert('2FA Disabled', 'Two-factor authentication has been disabled for your account.');
            }
          }
        ]
      );
    } else {
      setTwoStep(true);
      Alert.alert(
        'Enable Two-Factor Authentication',
        'You will receive a verification code via SMS or email when signing in from a new device.',
        [{ text: 'OK' }]
      );
    }
    
    console.log(`2FA is now ${newTwoStepState ? 'ON' : 'OFF'}`);
  };

  const toggleDarkMode = () => {
    setDarkMode(previous => !previous);
    const newDarkMode = !darkMode;
    
    Alert.alert(
      'Theme Changed',
      `${newDarkMode ? 'Dark' : 'Light'} mode will be applied throughout the app.`,
      [{ text: 'OK' }]
    );
    
    console.log(`Dark mode is now ${newDarkMode ? 'ON' : 'OFF'}`);
  };

  const handleSettingPress = (settingName) => {
    switch (settingName) {
      case 'Add account':
        navigation?.navigate('AddAccount');
        break;
      case 'Change Password':
        setShowPasswordModal(true);
        break;
      case 'Privacy Policy':
        navigation?.navigate('PrivacyPolicy');
        break;
      case 'Send Feedback':
        setShowFeedbackModal(true);
        break;
      case 'Terms of service':
        navigation?.navigate('TermsOfService');
        break;
      case 'Storage Management':
        navigation?.navigate('StorageManagement');
        break;
      case 'Security Settings':
        navigation?.navigate('SecuritySettings');
        break;
      case 'App Version':
        Alert.alert('App Version', 'CloudStorage v1.2.3\nBuild 2024.12.01');
        break;
      default:
        console.log(`${settingName} pressed`);
    }
  };

  const settingsData = [
    { id: '1', name: 'Add account', icon: '👤' },
    { id: '2', name: 'Storage Management', icon: '💾' },
    { id: '3', name: 'Security Settings', icon: '🛡️' },
    { id: '4', name: 'Change Password', icon: '🔐' },
    { id: '5', name: 'Privacy Policy', icon: '📋' },
    { id: '6', name: 'Terms of service', icon: '📄' },
    { id: '7', name: 'Send Feedback', icon: '💬' },
    { id: '8', name: 'App Version', icon: 'ℹ️' },
  ];

  const renderSettingItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.settingItem, darkMode && styles.darkSettingItem]}
      onPress={() => handleSettingPress(item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemContent}>
        <Text style={styles.settingIcon}>{item.icon}</Text>
        <Text style={[styles.settingText, darkMode && styles.darkText]}>{item.name}</Text>
        <Text style={[styles.chevron, darkMode && styles.darkChevron]}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSwitchSetting = (label, value, onToggle, description = null, status = null) => (
    <View style={[styles.switchContainer, darkMode && styles.darkSwitchContainer]}>
      <View style={styles.switchContent}>
        <View>
          <Text style={[styles.switchLabel, darkMode && styles.darkText]}>{label}</Text>
          {description && <Text style={[styles.switchDescription, darkMode && styles.darkDescription]}>{description}</Text>}
          {status && <Text style={[styles.switchStatus, darkMode && styles.darkStatus]}>{status}</Text>}
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: darkMode ? '#374151' : '#E5E7EB', true: '#3B82F6' }}
          thumbColor="#fff"
          ios_backgroundColor={darkMode ? '#374151' : '#E5E7EB'}
        />
      </View>
    </View>
  );

  const currentTheme = darkMode ? darkStyles : {};

  return (
    <SafeAreaView style={[styles.container, currentTheme.container]}>
      <StatusBar 
        barStyle={darkMode ? "light-content" : "dark-content"} 
        backgroundColor={darkMode ? "#1F2937" : "#fff"} 
      />
      
      {/* Header */}
      <View style={[styles.header, currentTheme.header]}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Image
            source={require('../assets/images/Backarrow.png')}
            style={[styles.backArrow, darkMode && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, currentTheme.headerTitle]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={[styles.profileSection, currentTheme.profileSection]}>
          <TouchableOpacity 
            style={styles.profileInfo}
            onPress={() => setShowNameModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>{userInitials}</Text>
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.profileNameContainer}>
                <Text style={[styles.profileName, currentTheme.profileName]}>{userName}</Text>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
              <Text style={[styles.profileEmail, currentTheme.profileEmail]}>{userEmail}</Text>
              <Text style={[styles.profileStorage, currentTheme.profileStorage]}>2.1 GB of 15 GB used</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Switch Settings */}
        <View style={[styles.section, currentTheme.section]}>
          <Text style={[styles.sectionTitle, currentTheme.sectionTitle]}>Preferences</Text>
          {renderSwitchSetting(
            'Auto Sync',
            syncEnabled,
            toggleSync,
            'Automatically sync files across devices',
            syncEnabled ? (syncInProgress ? 'Syncing...' : `Last sync: ${lastSyncTime}`) : 'Disabled'
          )}
          {renderSwitchSetting(
            'Two-Factor Authentication',
            twoStep,
            toggleTwoStep,
            'Add extra security to your account',
            twoStep ? 'Active - Enhanced security enabled' : 'Disabled - Account less secure'
          )}
          {renderSwitchSetting(
            'Dark Mode',
            darkMode,
            toggleDarkMode,
            'Use dark theme throughout the app',
            darkMode ? 'Dark theme active' : 'Light theme active'
          )}
        </View>

        {/* Settings List */}
        <View style={[styles.section, currentTheme.section]}>
          <Text style={[styles.sectionTitle, currentTheme.sectionTitle]}>Account & Security</Text>
          <FlatList
            data={settingsData}
            keyExtractor={(item) => item.id}
            renderItem={renderSettingItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={[styles.separator, currentTheme.separator]} />}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        darkMode={darkMode}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        darkMode={darkMode}
      />

      {/* Edit Name Modal */}
      <EditNameModal
        visible={showNameModal}
        onClose={() => setShowNameModal(false)}
        userName={userName}
        setUserName={setUserName}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
};

// Edit Name Modal Component
const EditNameModal = ({ visible, onClose, userName, setUserName, darkMode }) => {
  const [tempName, setTempName] = useState(userName);

  const handleSaveName = () => {
    if (!tempName.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }
    
    setUserName(tempName.trim());
    Alert.alert('Success', 'Your name has been updated successfully');
    onClose();
  };

  const currentTheme = darkMode ? darkStyles : {};

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, currentTheme.modalContainer]}>
        <View style={[styles.modalHeader, currentTheme.modalHeader]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalCancel, currentTheme.modalCancel]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, currentTheme.modalTitle]}>Edit Name</Text>
          <TouchableOpacity onPress={handleSaveName}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, currentTheme.inputLabel]}>Full Name</Text>
            <TextInput
              style={[styles.textInput, currentTheme.textInput]}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your full name"
              placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
            />
          </View>
          
          <Text style={[styles.passwordHint, currentTheme.passwordHint]}>
            Your initials will be automatically generated from your name and displayed in your profile.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Change Password Modal Component (Enhanced with dark mode)
const ChangePasswordModal = ({ visible, onClose, darkMode }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    
    Alert.alert('Success', 'Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const currentTheme = darkMode ? darkStyles : {};

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, currentTheme.modalContainer]}>
        <View style={[styles.modalHeader, currentTheme.modalHeader]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalCancel, currentTheme.modalCancel]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, currentTheme.modalTitle]}>Change Password</Text>
          <TouchableOpacity onPress={handleChangePassword}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, currentTheme.inputLabel]}>Current Password</Text>
            <TextInput
              style={[styles.textInput, currentTheme.textInput]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, currentTheme.inputLabel]}>New Password</Text>
            <TextInput
              style={[styles.textInput, currentTheme.textInput]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, currentTheme.inputLabel]}>Confirm New Password</Text>
            <TextInput
              style={[styles.textInput, currentTheme.textInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
            />
          </View>
          
          <Text style={[styles.passwordHint, currentTheme.passwordHint]}>
            Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Feedback Modal Component (Enhanced with dark mode)
const FeedbackModal = ({ visible, onClose, darkMode }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }
    
    Alert.alert('Thank you!', 'Your feedback has been sent successfully');
    setFeedback('');
    setRating(0);
    onClose();
  };

  const currentTheme = darkMode ? darkStyles : {};

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, currentTheme.modalContainer]}>
        <View style={[styles.modalHeader, currentTheme.modalHeader]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalCancel, currentTheme.modalCancel]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, currentTheme.modalTitle]}>Send Feedback</Text>
          <TouchableOpacity onPress={handleSendFeedback}>
            <Text style={styles.modalSave}>Send</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <Text style={[styles.inputLabel, currentTheme.inputLabel]}>How would you rate our app?</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.star}
              >
                <Text style={[styles.starText, rating >= star && styles.starSelected]}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, currentTheme.inputLabel]}>Your Feedback</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, currentTheme.textInput]}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Tell us what you think..."
              placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Storage Management Screen (Enhanced with dark mode)
export const StorageManagementScreen = ({ darkMode = false }) => {
  const storageData = [
    { type: 'Photos', size: '1.2 GB', color: '#10B981' },
    { type: 'Documents', size: '650 MB', color: '#3B82F6' },
    { type: 'Videos', size: '320 MB', color: '#8B5CF6' },
    { type: 'Other', size: '180 MB', color: '#F59E0B' },
  ];

  const currentTheme = darkMode ? darkStyles : {};

  return (
    <SafeAreaView style={[styles.container, currentTheme.container]}>
      <View style={[styles.header, currentTheme.header]}>
        <TouchableOpacity>
          <Text style={[styles.backButton, currentTheme.backButton]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, currentTheme.headerTitle]}>Storage Management</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.storageOverview, currentTheme.storageOverview]}>
          <Text style={[styles.storageTitle, currentTheme.storageTitle]}>Storage Usage</Text>
          <Text style={[styles.storageUsed, currentTheme.storageUsed]}>2.1 GB of 15 GB used</Text>
          <View style={styles.storageBar}>
            <View style={[styles.storageProgress, { width: '14%' }]} />
          </View>
        </View>
        
        <View style={[styles.section, currentTheme.section]}>
          <Text style={[styles.sectionTitle, currentTheme.sectionTitle]}>Storage Breakdown</Text>
          {storageData.map((item, index) => (
            <View key={index} style={styles.storageItem}>
              <View style={[styles.storageColorDot, { backgroundColor: item.color }]} />
              <Text style={[styles.storageType, currentTheme.storageType]}>{item.type}</Text>
              <Text style={[styles.storageSize, currentTheme.storageSize]}>{item.size}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.cleanupButton}>
          <Text style={styles.cleanupButtonText}>Clean Up Storage</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Privacy Policy Screen (Enhanced with dark mode)
export const PrivacyPolicyScreen = ({ darkMode = false }) => {
  const currentTheme = darkMode ? darkStyles : {};

  return (
    <SafeAreaView style={[styles.container, currentTheme.container]}>
      <View style={[styles.header, currentTheme.header]}>
        <TouchableOpacity>
          <Text style={[styles.backButton, currentTheme.backButton]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, currentTheme.headerTitle]}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.policyTitle, currentTheme.policyTitle]}>Privacy Policy</Text>
        <Text style={[styles.policyDate, currentTheme.policyDate]}>Last updated: December 2024</Text>
        
        <Text style={[styles.policySection, currentTheme.policySection]}>
          1. Information We Collect{'\n'}
          We collect information you provide directly to us, such as when you create an account, upload files, or contact us for support.
        </Text>
        
        <Text style={[styles.policySection, currentTheme.policySection]}>
          2. How We Use Your Information{'\n'}
          We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
        </Text>
        
        <Text style={[styles.policySection, currentTheme.policySection]}>
          3. Information Sharing{'\n'}
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
        </Text>
        
        <Text style={[styles.policySection, currentTheme.policySection]}>
          4. Data Security{'\n'}
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  profileDetails: {
    flex: 1,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  editIcon: {
    fontSize: 16,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileStorage: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  switchContainer: {
    backgroundColor: 'white',
  },
  switchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  switchStatus: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  settingItem: {
    backgroundColor: 'white',
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 48,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalSave: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  passwordHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  star: {
    paddingHorizontal: 8,
  },
  starText: {
    fontSize: 32,
    opacity: 0.3,
  },
  starSelected: {
    opacity: 1,
  },
  // Storage Management Styles
  storageOverview: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  storageUsed: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  storageBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storageColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  storageType: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  storageSize: {
    fontSize: 16,
    color: '#6B7280',
  },
  cleanupButton: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cleanupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    fontSize: 16,
    color: '#3B82F6',
  },
  // Privacy Policy Styles
  policyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  policyDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  policySection: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
});

// Dark Mode Styles
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
  },
  header: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  headerTitle: {
    color: '#F9FAFB',
  },
  profileSection: {
    backgroundColor: '#374151',
  },
  profileName: {
    color: '#F9FAFB',
  },
  profileEmail: {
    color: '#D1D5DB',
  },
  profileStorage: {
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#1F2937',
  },
  sectionTitle: {
    color: '#F9FAFB',
    backgroundColor: '#374151',
  },
  switchContainer: {
    backgroundColor: '#1F2937',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkDescription: {
    color: '#D1D5DB',
  },
  darkStatus: {
    color: '#60A5FA',
  },
  darkSettingItem: {
    backgroundColor: '#1F2937',
  },
  darkChevron: {
    color: '#6B7280',
  },
  separator: {
    backgroundColor: '#374151',
  },
  // Modal Dark Styles
  modalContainer: {
    backgroundColor: '#1F2937',
  },
  modalHeader: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  modalTitle: {
    color: '#F9FAFB',
  },
  modalCancel: {
    color: '#D1D5DB',
  },
  inputLabel: {
    color: '#F9FAFB',
  },
  textInput: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: '#F9FAFB',
  },
  passwordHint: {
    color: '#D1D5DB',
  },
  // Storage Management Dark Styles
  storageOverview: {
    backgroundColor: '#374151',
  },
  storageTitle: {
    color: '#F9FAFB',
  },
  storageUsed: {
    color: '#D1D5DB',
  },
  storageType: {
    color: '#F9FAFB',
  },
  storageSize: {
    color: '#D1D5DB',
  },
  backButton: {
    color: '#60A5FA',
  },
  // Privacy Policy Dark Styles
  policyTitle: {
    color: '#F9FAFB',
  },
  policyDate: {
    color: '#D1D5DB',
  },
  policySection: {
    color: '#E5E7EB',
  },
});


// Add these placeholder screens (you can create proper ones later)
export const AddAccountScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/Backarrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Account</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Add Account Screen - Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

export const TermsOfService = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/Backarrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Terms of Service Screen - Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

export const SecuritySettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/Backarrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Settings</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Security Settings Screen - Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;