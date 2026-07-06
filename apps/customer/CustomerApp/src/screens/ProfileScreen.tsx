import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuthContext();
  const { bookings, invoices } = useApi();

  useEffect(() => {
    if (user?.id) {
      bookings.getBookingsByCustomer(user.id);
      invoices.getInvoicesByCustomer(user.id);
    }
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
  };

  if (bookings.loading || invoices.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>{t('profile.myBookings')}</Text>
      {bookings.bookings.length === 0 ? (
        <Text style={styles.emptyText}>{t('profile.noBookings')}</Text>
      ) : (
        bookings.bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingItem}>
            <Text style={styles.bookingService}>{booking.serviceType}</Text>
            <Text style={styles.bookingStatus}>{t('booking.status')}: {booking.status}</Text>
            <Text style={styles.bookingDate}>{new Date(booking.scheduledAt).toLocaleString()}</Text>
          </View>
        ))
      )}
      
      <Text style={styles.sectionTitle}>{t('profile.myInvoices')}</Text>
      {invoices.invoices.length === 0 ? (
        <Text style={styles.emptyText}>{t('profile.noInvoices')}</Text>
      ) : (
        invoices.invoices.map((invoice) => (
          <View key={invoice.id} style={styles.invoiceItem}>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceAmount}>€{invoice.totalAmount.toFixed(2)}</Text>
            <Text style={styles.invoiceStatus}>{t('invoice.status')}: {invoice.status}</Text>
            <Text style={styles.invoiceDate}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
          </View>
        ))
      )}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  bookingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  invoiceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  bookingService: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingStatus: {
    fontSize: 14,
    color: '#007AFF',
  },
  bookingDate: {
    fontSize: 12,
    color: '#666',
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  invoiceAmount: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  invoiceStatus: {
    fontSize: 14,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;