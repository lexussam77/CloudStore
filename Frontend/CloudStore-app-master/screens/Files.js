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
  FlatList,
  Modal,
  Linking,
  Platform
} from 'react-native';

const FileScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'size', 'type'
  const [filterType, setFilterType] = useState('all'); // 'all', 'document', 'image', 'folder', etc.
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const [files, setFiles] = useState([
    { id: '1', name: 'Annual Report 2024.pdf', type: 'document', color: '#DC143C', icon: 'picture_as_pdf', isStarred: false, dateModified: '2024-01-15', size: '2.1 MB' },
    { id: '2', name: 'Budget Spreadsheet.xlsx', type: 'document', color: '#228B22', icon: 'description', isStarred: true, dateModified: '2024-01-20', size: '856 KB' },
    { id: '3', name: 'Project Images', type: 'folder', color: '#4169E1', icon: 'folder', isStarred: false, dateModified: '2024-01-18', size: '45 files' },
    { id: '4', name: 'Meeting Notes.docx', type: 'document', color: '#4169E1', icon: 'description', isStarred: false, dateModified: '2024-01-22', size: '245 KB' },
    { id: '5', name: 'Profile Photo.jpg', type: 'image', color: '#FF6347', icon: 'photo', isStarred: true, dateModified: '2024-01-19', size: '1.2 MB' },
    { id: '6', name: 'Presentation Draft.pptx', type: 'presentation', color: '#FF8C00', icon: 'slideshow', isStarred: false, dateModified: '2024-01-21', size: '3.4 MB' },
    { id: '7', name: 'Audio Recording.mp3', type: 'audio', color: '#9932CC', icon: 'audiotrack', isStarred: false, dateModified: '2024-01-17', size: '5.2 MB' },
    { id: '8', name: 'Video Tutorial.mp4', type: 'video', color: '#FF1493', icon: 'movie', isStarred: false, dateModified: '2024-01-16', size: '15.6 MB' },
    { id: '9', name: 'Archive Files', type: 'folder', color: '#8B4513', icon: 'folder', isStarred: false, dateModified: '2024-01-12', size: '23 files' },
    { id: '10', name: 'Contract Template.pdf', type: 'document', color: '#DC143C', icon: 'picture_as_pdf', isStarred: true, dateModified: '2024-01-23', size: '678 KB' },
  ]);

  // Filter and sort files
  const getFilteredAndSortedFiles = () => {
    let filtered = files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesFilter = filterType === 'all' || file.type === filterType;
      return matchesSearch && matchesFilter;
    });

    // Sort files
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.dateModified) - new Date(a.dateModified);
        case 'size':
          // Simple size comparison (this would need more sophisticated parsing in real app)
          return a.size.localeCompare(b.size);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredFiles = getFilteredAndSortedFiles();

  // File operations (same as home screen)
  const openFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (!result.canceled) {
        const newFile = {
          id: Date.now().toString(),
          name: result.assets[0].name,
          type: 'document',
          color: '#666',
          icon: 'description',
          uri: result.assets[0].uri,
          size: result.assets[0].size,
          mimeType: result.assets[0].mimeType,
          isStarred: false,
          dateModified: new Date().toISOString().split('T')[0]
        };
        setFiles(prevFiles => [...prevFiles, newFile]);
        Alert.alert("File Added", result.assets[0].name);
      }
    } catch (error) {
      console.error("File picker error:", error);
    }
  };

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
        isStarred: false,
        dateModified: new Date().toISOString().split('T')[0],
        size: '1.2 MB'
      };
      setFiles(prevFiles => [...prevFiles, newFile]);
      Alert.alert("Photo Added", "Photo has been added to your files");
    }
  };

  const handleFileAction = (file) => {
    setSelectedFile(file);
    setShowActionMenu(true);
  };

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

  const renameFile = () => {
    setNewFileName(selectedFile.name);
    setShowActionMenu(false);
    setShowRenameModal(true);
  };

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

  const copyFile = () => {
    const copiedFile = {
      ...selectedFile,
      id: Date.now().toString(),
      name: `${selectedFile.name} - Copy`,
      isStarred: false,
      dateModified: new Date().toISOString().split('T')[0]
    };
    
    setFiles(prevFiles => [...prevFiles, copiedFile]);
    setShowActionMenu(false);
    setSelectedFile(null);
    Alert.alert("File Copied", `Created a copy of "${selectedFile.name}"`);
  };

  const viewFile = (file = selectedFile) => {
    setShowActionMenu(false);
    
    if (file.type === 'folder') {
      Alert.alert("Open Folder", `Opening "${file.name}" folder...`);
    } else if (file.uri) {
      if (file.type === 'image') {
        Alert.alert("View Image", `Opening "${file.name}"...`);
      } else if (file.mimeType?.includes('pdf')) {
        Alert.alert("View PDF", `Opening "${file.name}"...`);
      } else {
        try {
          Linking.openURL(file.uri);
        } catch (error) {
          Alert.alert("Cannot Open", "Unable to open this file type");
        }
      }
    } else {
      Alert.alert("Preview", `This is a preview of "${file.name}"\n\nFile Type: ${file.type}\nSize: ${file.size}\nLast Modified: ${file.dateModified}\n\nThis is a sample file for demonstration.`);
    }
    
    setSelectedFile(null);
  };

  // Render file item in grid view
  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.fileItem, { backgroundColor: item.color }]}
      onPress={() => viewFile(item)}
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

  // Render file item in list view
  const renderListItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => viewFile(item)}
    >
      <View style={[styles.listIconContainer, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={20} color="#fff" />
      </View>
      
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listFileName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.isStarred && (
            <MaterialIcons name="star" size={16} color="#FFD700" />
          )}
        </View>
        <Text style={styles.listFileInfo}>
          {item.size} • {item.dateModified}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.listMoreButton}
        onPress={() => handleFileAction(item)}
      >
        <MaterialIcons name="more-vert" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSortMenu(true)}
          >
            <MaterialIcons name="sort" size={24} color="#000" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowFilterMenu(true)}
          >
            <MaterialIcons name="filter-list" size={24} color="#000" />
          </TouchableOpacity>
          
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Filter/Sort Info */}
      {(filterType !== 'all' || sortBy !== 'name') && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            {filterType !== 'all' && `Showing ${filterType}s`}
            {filterType !== 'all' && sortBy !== 'name' && ' • '}
            {sortBy !== 'name' && `Sorted by ${sortBy}`}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setFilterType('all');
              setSortBy('name');
            }}
          >
            <MaterialIcons name="clear" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Files Display */}
      <ScrollView style={styles.filesContainer} showsVerticalScrollIndicator={false}>
        {viewMode === 'grid' ? (
          <FlatList
            data={filteredFiles}
            renderItem={renderGridItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={styles.filesGrid}
          />
        ) : (
          <FlatList
            data={filteredFiles}
            renderItem={renderListItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.filesList}
          />
        )}
        
        {filteredFiles.length === 0 && (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="folder-open" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>
              {searchText ? `No files found matching "${searchText}"` : 'No files found'}
            </Text>
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

      {/* Filter Menu Modal */}
      <Modal
        visible={showFilterMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowFilterMenu(false)}
        >
          <View style={styles.filterMenu}>
            <Text style={styles.menuTitle}>Filter by Type</Text>
            
            {['all', 'document', 'image', 'folder', 'video', 'audio', 'presentation'].map(type => (
              <TouchableOpacity 
                key={type}
                style={[styles.menuItem, filterType === type && styles.selectedMenuItem]}
                onPress={() => {
                  setFilterType(type);
                  setShowFilterMenu(false);
                }}
              >
                <Text style={[styles.menuItemText, filterType === type && styles.selectedMenuText]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {type === 'all' && ' Files'}
                  {type !== 'all' && 's'}
                </Text>
                {filterType === type && (
                  <MaterialIcons name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Sort Menu Modal */}
      <Modal
        visible={showSortMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowSortMenu(false)}
        >
          <View style={styles.filterMenu}>
            <Text style={styles.menuTitle}>Sort by</Text>
            
            {[
              { key: 'name', label: 'Name' },
              { key: 'date', label: 'Date Modified' },
              { key: 'size', label: 'Size' },
              { key: 'type', label: 'Type' }
            ].map(sort => (
              <TouchableOpacity 
                key={sort.key}
                style={[styles.menuItem, sortBy === sort.key && styles.selectedMenuItem]}
                onPress={() => {
                  setSortBy(sort.key);
                  setShowSortMenu(false);
                }}
              >
                <Text style={[styles.menuItemText, sortBy === sort.key && styles.selectedMenuText]}>
                  {sort.label}
                </Text>
                {sortBy === sort.key && (
                  <MaterialIcons name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Action Menu Modal (same as home screen) */}
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
            
            <TouchableOpacity style={styles.actionItem} onPress={() => viewFile()}>
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

      {/* Rename Modal (same as home screen) */}
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

export default FileScreen;

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
    paddingBottom: 16,
    backgroundColor: '#f5f5f5',
  },
 
  headerActions: {
    flexDirection: 'row',
    left : 200
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    marginLeft: 8,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e8f4f8',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filesGrid: {
    paddingBottom: 120,
  },
  filesList: {
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listFileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  listFileInfo: {
    fontSize: 12,
    color: '#666',
  },
  listMoreButton: {
    padding: 4,
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
  filterMenu: {
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
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedMenuItem: {
    backgroundColor: '#f0f8ff',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMenuText: {
    color: '#007AFF',
    fontWeight: '500',
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