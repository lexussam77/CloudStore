// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // This is storing user data
import ProgressBar from 'react-native-progress/Bar'; // This shows how much of space the user has used

//This is user data, we would have to replace with Backend API Calls 
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: null, // URI or null
  storageUsed: 7.5, // in GB
  storageTotal: 15, // in GB
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetches user data on mount (we will replace with our API call)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          // If only name is present, fetch email from backend
          const parsed = JSON.parse(userData);
          if (parsed.name && !parsed.email) {
            // Try to fetch email from backend
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch('http://localhost:8081/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                const backendUser = await res.json();
                setUser({
                  name: backendUser.name || parsed.name,
                  email: backendUser.email || '',
                  profilePicture: parsed.profilePicture || null,
                  storageUsed: backendUser.storageUsed || 0,
                  storageTotal: backendUser.storageTotal || 0
                });
                // Optionally update AsyncStorage
                await AsyncStorage.setItem('user', JSON.stringify({
                  name: backendUser.name || parsed.name,
                  email: backendUser.email || '',
                  profilePicture: parsed.profilePicture || null
                }));
                return;
              }
            } catch (e) { /* ignore, fallback to parsed */ }
          }
          setUser({
            name: parsed.name || mockUser.name,
            email: parsed.email || mockUser.email,
            profilePicture: parsed.profilePicture || null,
            storageUsed: mockUser.storageUsed,
            storageTotal: mockUser.storageTotal
          });
        } else {
          setUser(mockUser); // Fallback to mock data
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Handles profile picture upload
  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setUploading(true);
          const imageUri = response.assets[0].uri;
          // Update user with new profile picture (This will be replaced with our backend upload logic)
          setUser((prev) => ({ ...prev, profilePicture: imageUri }));
          AsyncStorage.setItem('user', JSON.stringify({ ...user, profilePicture: imageUri }));
          setUploading(false);
        }
      }
    );
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user');
            // Navigate to login screen (adjust based on your navigation setup)
            navigation.replace('Login');
          } catch (error) {
            Alert.alert('Error', 'Failed to log out');
          }
        },
      },
    ]);
  };

  // Handle navigation to settings or other screens
  const navigateToSettings = () => {
    // Adjust based on your navigation setup
    navigation.navigate('Settings');
  };

 

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.profilePic} />
          ) : (
            <View style={[styles.profilePic, styles.placeholderPic]}>
              <Text style={styles.placeholderText}>{user.name.charAt(0)}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Storage Usage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Usage</Text>
        <Text style={styles.storageText}>
          {user.storageUsed} GB of {user.storageTotal} GB used
        </Text>
        <ProgressBar
          progress={user.storageUsed / user.storageTotal}
          width={null}
          height={10}
          color="#007AFF"
          unfilledColor="#E5E5EA"
          borderWidth={0}
          style={styles.progressBar}
        />
        {/*<TouchableOpacity style={styles.upgradeButton} onPress={navigateToUpgradePlan}>
          <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
        </TouchableOpacity>*/}
      </View>

      {/* Account Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.option} onPress={navigateToSettings}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Manage Subscriptions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholderPic: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  email: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  storageText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  progressBar: {
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;