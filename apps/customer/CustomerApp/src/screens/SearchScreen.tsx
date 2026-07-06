import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApi } from '../context/ApiContext';

const SearchScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { providers } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const category = route.params?.category;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        await providers.getProviders({
          serviceType: category,
          latitude: 52.5200, // Berlin
          longitude: 13.4050,
          radius: 50,
        });
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    
    fetchProviders();
  }, [category]);

  const handleSearch = async () => {
    try {
      await providers.getProviders({
        serviceType: searchQuery || category,
        latitude: 52.5200,
        longitude: 13.4050,
        radius: 50,
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('search.title')}</Text>
      <TextInput
        style={styles.searchInput}
        placeholder={t('search.placeholder')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      
      {providers.loading && <ActivityIndicator size="large" style={styles.loader} />}
      
      {!providers.loading && providers.error && (
        <Text style={styles.error}>Error: {providers.error.message}</Text>
      )}
      
      {!providers.loading && !providers.error && (
        providers.providers.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.providerItem}
            onPress={() => navigation.navigate('Booking', { providerId: item.id })}
          >
            <Text style={styles.providerName}>{item.businessName || `${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.providerService}>{item.trade}</Text>
            {item.ratingAvg && (
              <Text style={styles.providerRating}>⭐ {item.ratingAvg.toFixed(1)}</Text>
            )}
            <Text style={styles.verificationStatus}>Status: {item.verificationStatus}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  providerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  providerService: {
    fontSize: 16,
    color: '#666',
  },
  providerRating: {
    fontSize: 14,
    color: '#FFD700',
  },
});

export default SearchScreen;