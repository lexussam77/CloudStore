import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';

// Import your screens here
import Home from './Home';
import Favorites from './Favorites';
import Files from './Files';
import Settings from './Settings'
import Profile from './Profile';

// Import the Sidebar
import Sidebar from './Sidebar';

const BottomTabNavigation = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [showSidebar, setShowSidebar] = useState(false);
  const user = route?.params?.user;

  const tabs = [
    { name: 'Home', label: 'Home', icon: '🏠' },
    { name: 'Favorites', label: 'Favorites', icon: '❤️' },
    { name: 'Files', label: 'Files', icon: '📁' },
    { name: 'Compression', label: 'Compress', icon: '📦' },
    { name: 'Profile', label: 'Profile', icon: '🤵🏿' }
  ];

  const menuItems = [
    { icon: require('../assets/images/settings.png'), label: 'Settings', onPress: () => navigation.navigate('Settings') },
    { icon: require('../assets/images/Bin.png'), label: 'Bin', action: () => alert('Bin') },
    { icon: require('../assets/images/Offline.png'), label: 'Offline', action: () => alert('Offline') },
    { icon: require('../assets/images/Upload.png'), label: 'Uploads', action: () => alert('Uploads') },
    { icon: require('../assets/images/HelpIcon.png'), label: 'Need Help??', action: () => alert('Help') },
    { icon: require('../assets/images/Compressed.png'), label: 'Compressed files', action: () => alert('Compressed files') },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <View style={styles.screenContainer}>
            <Home navigation={navigation} user={user} />
          </View>
        );
      case 'Favorites':
        return (
          <View style={styles.screenContainer}>
            <Favorites navigation={navigation} />
          </View>
        );
      case 'Files':
        return (
          <View style={styles.screenContainer}>
            <Files navigation={navigation} />
          </View>
        );
      case 'Compression':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenText}>Compression Screen Content</Text>
            {/* Add your Compression Screen here */}
          </View>
        );
      case 'Profile':
        return (
          <View style={styles.screenContainer}>
            <Profile navigation={navigation}/>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Screen Content */}
      <View style={styles.content}>
        {/* Top Bar with Hamburger and Title */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setShowSidebar(true)} style={styles.hamburgerButton}>
            <Image
              source={require('../assets/images/menu.png')} // Adjust the path if needed
              style={styles.menuIcon}
            />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{activeTab}</Text>
        </View>

        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabItem,
              activeTab === tab.name && styles.activeTabItem
            ]}
            onPress={() => setActiveTab(tab.name)}
          >
            <Text style={[
              styles.tabIcon,
              activeTab === tab.name && styles.activeTabIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.name && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sidebar overlay */}
      {showSidebar && (
        <View style={styles.overlay}>
          <Sidebar items={menuItems} onClose={() => setShowSidebar(false)} />
        </View>
      )}
    </SafeAreaView>
  );
};

// ... keep all your existing styles exactly the same ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  topBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    top: 15
  },
  hamburgerButton: {
    marginRight: 20,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: '#000',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    // any style for active tab container
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeTabIcon: {
    // style for active icon if needed
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
});

export default BottomTabNavigation;