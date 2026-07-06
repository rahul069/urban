import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const jobs = [
  { id: '1', customer: 'John Doe', service: 'cleaning', status: 'pending', date: '2026-07-05' },
  { id: '2', customer: 'Jane Smith', service: 'plumbing', status: 'accepted', date: '2026-07-06' },
  { id: '3', customer: 'Max Mustermann', service: 'electrical', status: 'completed', date: '2026-07-04' },
];

const JobRequestsScreen = () => {
  const { t } = useTranslation();

  const pendingJobs = jobs.filter((job) => job.status === 'pending');
  const acceptedJobs = jobs.filter((job) => job.status === 'accepted');
  const completedJobs = jobs.filter((job) => job.status === 'completed');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('jobs.title')}</Text>

      <Text style={styles.sectionTitle}>{t('jobs.pending')}</Text>
      <FlatList
        data={pendingJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobText}>{item.customer}</Text>
            <Text style={styles.jobText}>{item.date}</Text>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>{t('jobs.accepted')}</Text>
      <FlatList
        data={acceptedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobText}>{item.customer}</Text>
            <Text style={styles.jobText}>{item.date}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>{t('jobs.completed')}</Text>
      <FlatList
        data={completedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobText}>{item.customer}</Text>
            <Text style={styles.jobText}>{item.date}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  jobItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobText: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#34C759',
    padding: 8,
    borderRadius: 4,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default JobRequestsScreen;