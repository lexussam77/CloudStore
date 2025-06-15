import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CloudStorageSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('modified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const recentSearches = [
    'presentation slides',
    'vacation photos 2024',
    'project documents',
    'invoices',
  ];

  const fileTypes = [
    { id: 'documents', label: 'Documents', icon: 'file-text', color: '#3B82F6', count: 234 },
    { id: 'images', label: 'Images', icon: 'image', color: '#10B981', count: 156 },
    { id: 'videos', label: 'Videos', icon: 'video', color: '#8B5CF6', count: 45 },
    { id: 'audio', label: 'Audio', icon: 'music', color: '#F59E0B', count: 28 },
    { id: 'archives', label: 'Archives', icon: 'archive', color: '#6B7280', count: 12 },
    { id: 'other', label: 'Other', icon: 'file', color: '#9CA3AF', count: 67 },
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past week' },
    { value: 'month', label: 'Past month' },
    { value: '3months', label: 'Past 3 months' },
    { value: 'year', label: 'Past year' },
    { value: 'custom', label: 'Custom range' },
  ];

  const sortOptions = [
    { value: 'modified', label: 'Last modified' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'File size' },
    { value: 'type', label: 'File type' },
    { value: 'created', label: 'Date created' },
  ];

  const toggleFileType = (typeId) => {
    setSelectedFileTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFileTypes([]);
    setDateRange('');
    setSortBy('modified');
    setSortOrder('desc');
  };

  const activeFiltersCount = selectedFileTypes.length + (dateRange ? 1 : 0);

  const renderFileType = ({ item }) => {
    const isSelected = selectedFileTypes.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.fileTypeCard,
          isSelected && styles.fileTypeCardSelected,
        ]}
        onPress={() => toggleFileType(item.id)}
      >
        <View style={[styles.fileTypeIcon, { backgroundColor: item.color + '20' }]}>
          <Icon name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.fileTypeInfo}>
          <Text style={styles.fileTypeLabel}>{item.label}</Text>
          <Text style={styles.fileTypeCount}>{item.count} files</Text>
        </View>
        {isSelected && (
          <Icon name="check" size={20} color="#3B82F6" />
        )}
      </TouchableOpacity>
    );
  };

  const renderDateRange = ({ item }) => {
    const isSelected = dateRange === item.value;
    return (
      <TouchableOpacity
        style={[
          styles.dateRangeCard,
          isSelected && styles.dateRangeCardSelected,
        ]}
        onPress={() => {
          setDateRange(item.value);
          setShowDateModal(false);
        }}
      >
        <Icon name="calendar" size={16} color="#6B7280" style={styles.dateIcon} />
        <Text style={[styles.dateRangeLabel, isSelected && styles.dateRangeLabelSelected]}>
          {item.label}
        </Text>
        {isSelected && (
          <Icon name="check" size={16} color="#3B82F6" />
        )}
      </TouchableOpacity>
    );
  };

  const renderSortOption = ({ item }) => {
    const isSelected = sortBy === item.value;
    return (
      <TouchableOpacity
        style={[
          styles.sortOption,
          isSelected && styles.sortOptionSelected,
        ]}
        onPress={() => {
          setSortBy(item.value);
          setShowSortModal(false);
        }}
      >
        <Text style={[styles.sortOptionText, isSelected && styles.sortOptionTextSelected]}>
          {item.label}
        </Text>
        {isSelected && (
          <Icon name="check" size={16} color="#3B82F6" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search files and folders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Searches */}
        {!searchQuery && (
          <View style={styles.recentSearches}>
            <View style={styles.recentHeader}>
              <Icon name="clock" size={16} color="#6B7280" />
              <Text style={styles.recentTitle}>Recent searches</Text>
            </View>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => setSearchQuery(search)}
              >
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filter and Sort Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (showFilters || activeFiltersCount > 0) && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Icon name="sliders" size={16} color={
              showFilters || activeFiltersCount > 0 ? '#3B82F6' : '#6B7280'
            } />
            <Text style={[
              styles.filterButtonText,
              (showFilters || activeFiltersCount > 0) && styles.filterButtonTextActive,
            ]}>
              Filters
            </Text>
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Icon name="arrow-up-down" size={16} color="#6B7280" />
            <Text style={styles.sortButtonText}>
              Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
            </Text>
            <Icon name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* File Types */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>File Types</Text>
              <FlatList
                data={fileTypes}
                renderItem={renderFileType}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.fileTypeRow}
              />
            </View>

            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Modified</Text>
              <TouchableOpacity
                style={styles.dateRangeButton}
                onPress={() => setShowDateModal(true)}
              >
                <Icon name="calendar" size={16} color="#6B7280" />
                <Text style={styles.dateRangeButtonText}>
                  {dateRange ? dateRanges.find(d => d.value === dateRange)?.label : 'Select date range'}
                </Text>
                <Icon name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <View style={styles.clearFiltersSection}>
                <Text style={styles.activeFiltersText}>
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
                </Text>
                <TouchableOpacity onPress={clearAllFilters}>
                  <Text style={styles.clearFiltersButton}>Clear all filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Content Area */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.emptyState}>
          <Icon name="search" size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>
            {searchQuery ? `Searching for "${searchQuery}"...` : 'Start typing to search your files'}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {activeFiltersCount > 0
              ? `${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied`
              : 'Use filters to narrow down your search'
            }
          </Text>
        </View>
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Icon name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={sortOptions}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.value}
            />
            <View style={styles.sortOrderSection}>
              <Text style={styles.sortOrderTitle}>Order</Text>
              <View style={styles.sortOrderButtons}>
                <TouchableOpacity
                  style={[
                    styles.sortOrderButton,
                    sortOrder === 'desc' && styles.sortOrderButtonActive,
                  ]}
                  onPress={() => setSortOrder('desc')}
                >
                  <Text style={[
                    styles.sortOrderButtonText,
                    sortOrder === 'desc' && styles.sortOrderButtonTextActive,
                  ]}>
                    Desc
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOrderButton,
                    sortOrder === 'asc' && styles.sortOrderButtonActive,
                  ]}
                  onPress={() => setSortOrder('asc')}
                >
                  <Text style={[
                    styles.sortOrderButtonText,
                    sortOrder === 'asc' && styles.sortOrderButtonTextActive,
                  ]}>
                    Asc
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Range Modal */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Date Modified</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Icon name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={dateRanges}
              renderItem={renderDateRange}
              keyExtractor={(item) => item.value}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  recentSearches: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  recentItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  recentText: {
    fontSize: 14,
    color: '#374151',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  filterButtonTextActive: {
    color: '#3B82F6',
  },
  filterBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  filtersPanel: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 400,
  },
  filterSection: {
    padding: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  fileTypeRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fileTypeCard: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  fileTypeCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  fileTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fileTypeInfo: {
    flex: 1,
  },
  fileTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fileTypeCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  dateRangeButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  clearFiltersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearFiltersButton: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  sortOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  sortOrderSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sortOrderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  sortOrderButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  sortOrderButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  sortOrderButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sortOrderButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sortOrderButtonTextActive: {
    color: '#111827',
    fontWeight: '500',
  },
  dateRangeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateRangeCardSelected: {
    backgroundColor: '#EFF6FF',
  },
  dateIcon: {
    marginRight: 12,
  },
  dateRangeLabel: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  dateRangeLabelSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default CloudStorageSearch;