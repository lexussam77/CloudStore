import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';
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

const Favorites = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [favoriteFiles, setFavoriteFiles] = useState([]);

  // Get starred files - this would normally come from your global state/context
  // For now, using sample data similar to your Home screen
  const [allFiles, setAllFiles] = useState([
    { id: '1', name: 'My resume', type: 'document', color: '#8B4513', icon: 'description', isStarred: false },
    { id: '2', name: 'Project prototype', type: 'document', color: '#000', icon: 'description', isStarred: false },
    { id: '3', name: 'Mobile Apps', type: 'folder', color: '#9370DB', icon: 'folder', isStarred: true },
    { id: '4', name: 'Query Results', type: 'folder', color: '#4169E1', icon: 'folder', isStarred: false },
    { id: '5', name: 'Powerpoint Presentation', type: 'presentation', color: '#DC143C', icon: 'slideshow', isStarred: false },
    { id: '6', name: 'Design Mockup', type: 'design', color: '#32CD32', icon: 'palette', isStarred: true },
    { id: '7', name: 'Important Documents', type: 'folder', color: '#FF8C00', icon: 'folder', isStarred: true },
    { id: '8', name: 'Family Photos', type: 'folder', color: '#FF69B4', icon: 'folder', isStarred: true },
    { id: '9', name: 'Work Contracts', type: 'document', color: '#2E8B57', icon: 'description', isStarred: true },
  ]);

  // Filter to show only starred files
  useEffect(() => {
    const starred = allFiles.filter(file => file.isStarred);
    setFavoriteFiles(starred);
  }, [allFiles]);

  // Filter favorites based on search text
  const filteredFavorites = favoriteFiles.filter(file =>
    file.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle file actions
  const handleFileAction = (file) => {
    setSelectedFile(file);
    setShowActionMenu(true);
  };

  // Remove from favorites (unstar)
  const removeFromFavorites = () => {
    Alert.alert(
      "Remove from Favorites",
      `Remove "${selectedFile.name}" from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setAllFiles(prevFiles =>
              prevFiles.map(file =>
                file.id === selectedFile.id
                  ? { ...file, isStarred: false }
                  : file
              )
            );
            setShowActionMenu(false);
            setSelectedFile(null);
            Alert.alert("Removed", `"${selectedFile.name}" removed from favorites`);
          }
        }
      ]
    );
  };

  // Delete file
  const deleteFile = () => {
    Alert.alert(
      "Delete File",
      `Are you sure you want to delete "${selectedFile.name}"? This will also remove it from favorites.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setAllFiles(prevFiles => prevFiles.filter(file => file.id !== selectedFile.id));
            setShowActionMenu(false);
            setSelectedFile(null);
            Alert.alert("Deleted", `"${selectedFile.name}" has been deleted`);
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
        Alert.alert("Download Started", `Downloading "${selectedFile.name}"...`);
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

    setAllFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === selectedFile.id
          ? { ...file, name: newFileName.trim() }
          : file
      )
    );

    setShowRenameModal(false);
    setSelectedFile(null);
    setNewFileName('');
    Alert.alert("Renamed", "File has been renamed successfully");
  };

  // Copy file
  const copyFile = () => {
    const copiedFile = {
      ...selectedFile,
      id: Date.now().toString(),
      name: `${selectedFile.name} - Copy`,
      isStarred: false // Copies are not starred by default
    };
    
    setAllFiles(prevFiles => [...prevFiles, copiedFile]);
    setShowActionMenu(false);
    setSelectedFile(null);
    Alert.alert("File Copied", `Created a copy of "${selectedFile.name}"`);
  };

  // View file content
  const viewFile = () => {
    setShowActionMenu(false);
    
    if (selectedFile.type === 'folder') {
      Alert.alert("Open Folder", `Opening "${selectedFile.name}" folder...`);
    } else if (selectedFile.uri) {
      if (selectedFile.type === 'image') {
        Alert.alert("View Image", `Opening "${selectedFile.name}"...`);
      } else if (selectedFile.mimeType?.includes('pdf')) {
        Alert.alert("View PDF", `Opening "${selectedFile.name}"...`);
      } else {
        try {
          Linking.openURL(selectedFile.uri);
        } catch (error) {
          Alert.alert("Cannot Open", "Unable to open this file type");
        }
      }
    } else {
      Alert.alert("Preview", `This is a preview of "${selectedFile.name}"\n\nFile Type: ${selectedFile.type}\nThis is a sample favorite file.`);
    }
    
    setSelectedFile(null);
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    if (favoriteFiles.length === 0) {
      Alert.alert("No Favorites", "You don't have any favorite files to clear.");
      return;
    }

    Alert.alert(
      "Clear All Favorites",
      `Remove all ${favoriteFiles.length} files from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setAllFiles(prevFiles =>
              prevFiles.map(file => ({ ...file, isStarred: false }))
            );
            Alert.alert("Cleared", "All favorites have been removed");
          }
        }
      ]
    );
  };

  // Render individual file item
  const renderFileItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.fileItem, { backgroundColor: item.color }]}
      onPress={() => {
        setSelectedFile(item);
        viewFile();
      }}
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
        <MaterialIcons 
          name="star" 
          size={16} 
          color="#FFD700" 
          style={styles.starIcon}
        />
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => handleFileAction(item)}
      >
        <MaterialIcons name="more-vert" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="star-border" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Favorite Files</Text>
      <Text style={styles.emptySubtitle}>
        Files you mark as favorites will appear here
      </Text>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Browse Files</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {favoriteFiles.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearAllFavorites}
          >
            <MaterialIcons name="clear-all" size={24} color="#ff4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      {favoriteFiles.length > 0 && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search favorites..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Favorites Count */}
      {favoriteFiles.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredFavorites.length} of {favoriteFiles.length} favorites
          </Text>
        </View>
      )}

      {/* Files Grid or Empty State */}
      {favoriteFiles.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.filesContainer} showsVerticalScrollIndicator={false}>
          {filteredFavorites.length > 0 ? (
            <FlatList
              data={filteredFavorites}
              renderItem={renderFileItem}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              scrollEnabled={false}
              contentContainerStyle={styles.filesGrid}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <MaterialIcons name="search-off" size={60} color="#ccc" />
              <Text style={styles.noResultsText}>
                No favorites found matching "{searchText}"
              </Text>
            </View>
          )}
        </ScrollView>
      )}

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

            <TouchableOpacity style={styles.actionItem} onPress={removeFromFavorites}>
              <MaterialIcons name="star" size={20} color="#FFD700" />
              <Text style={[styles.actionText, { color: "#FFD700" }]}>
                Remove from Favorites
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

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  clearButton: {
    padding: 4,
    left : 280
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    marginLeft: 8,
  },
  countContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  countText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filesGrid: {
    paddingBottom: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
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