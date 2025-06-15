import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Image,
  FlatList,
  Modal,
  Linking,
  Platform
} from 'react-native';

const Home = ({ navigation, user }) => {
  const [searchText, setSearchText] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [files, setFiles] = useState([
    // Sample files to match your UI design
    { id: '1', name: 'My resume', type: 'document', color: '#8B4513', icon: 'description', isStarred: false },
    { id: '2', name: 'Project prototype', type: 'document', color: '#000', icon: 'description', isStarred: false },
    { id: '3', name: 'Mobile Apps', type: 'folder', color: '#9370DB', icon: 'folder', isStarred: true },
    { id: '4', name: 'Query Results', type: 'folder', color: '#4169E1', icon: 'folder', isStarred: false },
    { id: '5', name: 'Powerpoint Presentation', type: 'presentation', color: '#DC143C', icon: 'slideshow', isStarred: false },
    { id: '6', name: 'Design Mockup', type: 'design', color: '#32CD32', icon: 'palette', isStarred: true },
  ]);

  // Filter files based on search text
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // File Picker
  const openFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) {
        console.log("User canceled file picking");
      } else {
        const newFile = {
          id: Date.now().toString(),
          name: result.assets[0].name,
          type: 'document',
          color: '#666',
          icon: 'description',
          uri: result.assets[0].uri,
          size: result.assets[0].size,
          mimeType: result.assets[0].mimeType,
          isStarred: false
        };
        setFiles(prevFiles => [...prevFiles, newFile]);
        Alert.alert("File Added", result.assets[0].name);
      }
    } catch (error) {
      console.error("File picker error:", error);
    }
  };

  // Camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Camera access is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newFile = {
        id: Date.now().toString(),
        name: `Photo_${Date.now()}`,
        type: 'image',
        color: '#FF6347',
        icon: 'photo',
        uri: result.assets[0].uri,
        mimeType: 'image/jpeg',
        isStarred: false
      };
      setFiles(prevFiles => [...prevFiles, newFile]);
      Alert.alert("Photo Added", "Photo has been added to your files");
    } else {
      console.log("User canceled camera");
    }
  };

  // Handle file actions
  const handleFileAction = (file) => {
    setSelectedFile(file);
    setShowActionMenu(true);
  };

  // Delete file
  const deleteFile = () => {
    Alert.alert(
      "Delete File",
      `Are you sure you want to delete "${selectedFile.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setFiles(prevFiles => prevFiles.filter(file => file.id !== selectedFile.id));
            setShowActionMenu(false);
            setSelectedFile(null);
          }
        }
      ]
    );
  };

  // Share file
  const shareFile = async () => {
    try {
      if (selectedFile.uri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(selectedFile.uri);
        } else {
          Alert.alert("Sharing not available", "Sharing is not available on this device");
        }
      } else {
        Alert.alert("Cannot Share", "This file cannot be shared as it has no content");
      }
      setShowActionMenu(false);
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Share Error", "Failed to share the file");
    }
  };

  // Download file
  const downloadFile = async () => {
    try {
      if (selectedFile.uri) {
        // For demo purposes, we'll just show an alert
        // In a real app, you might save to device storage or show download progress
        Alert.alert("Download Started", `Downloading "${selectedFile.name}"...`);
        
        // Example of actual download implementation:
        // const downloadDir = FileSystem.documentDirectory + 'Downloads/';
        // const downloadPath = downloadDir + selectedFile.name;
        // await FileSystem.downloadAsync(selectedFile.uri, downloadPath);
      } else {
        Alert.alert("Cannot Download", "This file is not available for download");
      }
      setShowActionMenu(false);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Download Error", "Failed to download the file");
    }
  };

  // Rename file
  const renameFile = () => {
    setNewFileName(selectedFile.name);
    setShowActionMenu(false);
    setShowRenameModal(true);
  };

  // Confirm rename
  const confirmRename = () => {
    if (newFileName.trim() === '') {
      Alert.alert("Invalid Name", "File name cannot be empty");
      return;
    }

    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === selectedFile.id
          ? { ...file, name: newFileName.trim() }
          : file
      )
    );

    setShowRenameModal(false);
    setSelectedFile(null);
    setNewFileName('');
  };

  // Toggle star/favorite
  const toggleStar = () => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === selectedFile.id
          ? { ...file, isStarred: !file.isStarred }
          : file
      )
    );

    const action = selectedFile.isStarred ? 'Removed from' : 'Added to';
    Alert.alert("Success", `${action} favorites: "${selectedFile.name}"`);
    setShowActionMenu(false);
    setSelectedFile(null);
  };

  // Copy file
  const copyFile = () => {
    const copiedFile = {
      ...selectedFile,
      id: Date.now().toString(),
      name: `${selectedFile.name} - Copy`,
      isStarred: false // Copies are not starred by default
    };
    
    setFiles(prevFiles => [...prevFiles, copiedFile]);
    setShowActionMenu(false);
    setSelectedFile(null);
    Alert.alert("File Copied", `Created a copy of "${selectedFile.name}"`);
  };

  // View file content
  const viewFile = () => {
    setShowActionMenu(false);
    
    if (selectedFile.type === 'folder') {
      // Navigate to folder contents or show folder view
      Alert.alert("Open Folder", `Opening "${selectedFile.name}" folder...`);
      // navigation.navigate('FolderView', { folder: selectedFile });
    } else if (selectedFile.uri) {
      // For files with actual content
      if (selectedFile.type === 'image') {
        // Navigate to image viewer
        Alert.alert("View Image", `Opening "${selectedFile.name}"...`);
        // navigation.navigate('ImageViewer', { file: selectedFile });
      } else if (selectedFile.mimeType?.includes('pdf')) {
        // Open PDF viewer
        Alert.alert("View PDF", `Opening "${selectedFile.name}"...`);
        // navigation.navigate('PDFViewer', { file: selectedFile });
      } else {
        // Try to open with default app
        try {
          Linking.openURL(selectedFile.uri);
        } catch (error) {
          Alert.alert("Cannot Open", "Unable to open this file type");
        }
      }
    } else {
      // For sample files without actual content
      Alert.alert("Preview", `This is a preview of "${selectedFile.name}"\n\nFile Type: ${selectedFile.type}\nThis is a sample file for demonstration.`);
    }
    
    setSelectedFile(null);
  };

  // Render individual file item
  const renderFileItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.fileItem, { backgroundColor: item.color }]}
      onPress={() => viewFile()} // Quick tap to view
    >
      <View style={styles.fileContent}>
        <MaterialIcons 
          name={item.icon} 
          size={24} 
          color="#fff" 
          style={styles.fileIcon}
        />
        <Text style={styles.fileName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.isStarred && (
          <MaterialIcons 
            name="star" 
            size={16} 
            color="#FFD700" 
            style={styles.starIcon}
          />
        )}
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => handleFileAction(item)}
      >
        <MaterialIcons name="more-vert" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Welcome Note */}
      <View style={{paddingHorizontal: 16, paddingTop: 30, paddingBottom: 10}}>
        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#6C63FF'}}>
          Welcome{user ? `, ${user}` : ''}!
        </Text>
      </View>
      {/* Header with menu and search */}
      <View style={styles.header}>
        
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="search"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Files Grid */}
      <ScrollView style={styles.filesContainer} showsVerticalScrollIndicator={false}>
        <FlatList
          data={filteredFiles}
          renderItem={renderFileItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.filesGrid}
        />
        
        {filteredFiles.length === 0 && searchText !== '' && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No files found matching "{searchText}"</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Buttons */}
      <TouchableOpacity style={styles.fabCamera} onPress={openCamera}>
        <MaterialIcons name="photo-camera" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fabPlus} onPress={openFilePicker}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Action Menu Modal */}
      <Modal
        visible={showActionMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.actionMenu}>
            <Text style={styles.actionMenuTitle}>{selectedFile?.name}</Text>
            
            <TouchableOpacity style={styles.actionItem} onPress={viewFile}>
              <MaterialIcons name="visibility" size={20} color="#333" />
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={toggleStar}>
              <MaterialIcons 
                name={selectedFile?.isStarred ? "star" : "star-border"} 
                size={20} 
                color={selectedFile?.isStarred ? "#FFD700" : "#333"} 
              />
              <Text style={[
                styles.actionText, 
                selectedFile?.isStarred && { color: "#FFD700" }
              ]}>
                {selectedFile?.isStarred ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={shareFile}>
              <MaterialIcons name="share" size={20} color="#333" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={downloadFile}>
              <MaterialIcons name="download" size={20} color="#333" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={renameFile}>
              <MaterialIcons name="edit" size={20} color="#333" />
              <Text style={styles.actionText}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={copyFile}>
              <MaterialIcons name="content-copy" size={20} color="#333" />
              <Text style={styles.actionText}>Make a Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionItem, styles.deleteAction]} onPress={deleteFile}>
              <MaterialIcons name="delete" size={20} color="#ff4444" />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rename Modal */}
      <Modal
        visible={showRenameModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.renameModal}>
            <Text style={styles.renameTitle}>Rename File</Text>
            <TextInput
              style={styles.renameInput}
              value={newFileName}
              onChangeText={setNewFileName}
              placeholder="Enter new name"
              autoFocus={true}
              selectTextOnFocus={true}
            />
            <View style={styles.renameButtons}>
              <TouchableOpacity 
                style={[styles.renameButton, styles.cancelButton]}
                onPress={() => setShowRenameModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.renameButton, styles.confirmButton]}
                onPress={confirmRename}
              >
                <Text style={styles.confirmButtonText}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  menuButton: {
    marginRight: 12,
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    marginLeft: 8,
  },
  filesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filesGrid: {
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fileItem: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fileContent: {
    flex: 1,
    justifyContent: 'center',
  },
  fileIcon: {
    marginBottom: 8,
  },
  fileName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },
  starIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 2,
  },
  moreButton: {
    alignSelf: 'flex-end',
    padding: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fabCamera: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPlus: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    maxWidth: 300,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  actionMenuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  deleteAction: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  deleteText: {
    color: '#ff4444',
  },
  renameModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  renameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  renameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  renameButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  renameButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});