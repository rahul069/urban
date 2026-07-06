import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApi } from '../context/ApiContext';
import { useAuthContext } from '../context/AuthContext';

const JobRequestsScreen = () => {
  const { t } = useTranslation();
  const { bookings } = useApi();
  const { user } = useAuthContext();
  const [jobRequests, setJobRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobRequests = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await bookings.getBookingsByProvider(user.id);
        setJobRequests(response.data);
      } catch (error) {
        console.error('Error fetching job requests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobRequests();
  }, [user?.id, bookings]);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      setLoading(true);
      await bookings.updateBookingStatus(bookingId, status);
      // Refresh the job requests
      const response = await bookings.getBookingsByProvider(user.id);
      setJobRequests(response.data);
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{item.serviceType}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <Text style={styles.jobDate}>{new Date(item.scheduledAt).toLocaleString()}</Text>
      <Text style={[styles.jobStatus, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
      {item.status === 'requested' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleStatusUpdate(item.id, 'accepted')}
          >
            <Text style={styles.buttonText}>{t('jobRequests.accept')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => handleStatusUpdate(item.id, 'cancelled')}
          >
            <Text style={styles.buttonText}>{t('jobRequests.decline')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return '#FFA500';
      case 'accepted': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('jobRequests.title')}</Text>
      {jobRequests.length === 0 ? (
        <Text style={styles.noJobs}>{t('jobRequests.noJobs')}</Text>
      ) : (
        <FlatList
          data={jobRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
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
  list: {
    paddingBottom: 16,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  jobStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noJobs: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
});

export default JobRequestsScreen;