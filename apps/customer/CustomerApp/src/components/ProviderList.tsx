import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useApi } from '../context/ApiContext';
import { useAuthContext } from '../context/AuthContext';

const ProviderList: React.FC = () => {
  const { providers } = useApi();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.id) {
      providers.getProviders({
        latitude: 52.5200, // Berlin
        longitude: 13.4050,
        radius: 50,
      });
    }
  }, [user?.id]);

  if (providers.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (providers.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {providers.error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Providers</Text>
      <FlatList
        data={providers.providers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.providerItem}>
            <Text style={styles.providerName}>{item.businessName || `${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.providerTrade}>{item.trade}</Text>
            <Text style={styles.providerStatus}>Status: {item.verificationStatus}</Text>
            {item.ratingAvg && (
              <Text style={styles.providerRating}>Rating: {item.ratingAvg.toFixed(1)}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  providerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerTrade: {
    fontSize: 14,
    color: '#666',
  },
  providerStatus: {
    fontSize: 12,
    color: '#007bff',
  },
  providerRating: {
    fontSize: 12,
    color: '#28a745',
  },
  error: {
    color: 'red',
  },
});

export default ProviderList;