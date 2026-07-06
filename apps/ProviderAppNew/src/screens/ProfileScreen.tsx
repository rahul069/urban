import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApi } from '../context/ApiContext';
import { useAuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { providers, invoices } = useApi();
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [userInvoices, setUserInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Fetch provider profile
        const profileResponse = await providers.getProviderById(user.id);
        setProfile(profileResponse.data);
        
        // Fetch verification status
        const verificationResponse = await providers.getProviderVerificationStatus(user.id);
        setVerificationStatus(verificationResponse.data);
        
        // Fetch invoices
        const invoicesResponse = await invoices.getInvoicesByProvider(user.id);
        setUserInvoices(invoicesResponse.data);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user?.id, providers, invoices]);

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FFA500';
      case 'rejected': return '#F44336';
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{profile?.businessName || `${user?.firstName} ${user?.lastName}`}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.verificationStatus')}</Text>
        {verificationStatus ? (
          <View style={styles.verificationContainer}>
            <Text style={[styles.verificationStatus, { color: getVerificationColor(verificationStatus.status) }]}>
              {verificationStatus.status}
            </Text>
            {verificationStatus.documents && verificationStatus.documents.map((doc: any) => (
              <View key={doc.type} style={styles.documentItem}>
                <Text style={styles.documentType}>{doc.type.replace('_', ' ')}</Text>
                <Text style={[styles.documentStatus, { color: getVerificationColor(doc.status) }]}>
                  {doc.status}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>{t('profile.notVerified')}</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.businessInfo')}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('profile.trade')}:</Text>
          <Text style={styles.infoValue}>{profile?.trade || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('profile.serviceRadius')}:</Text>
          <Text style={styles.infoValue}>{profile?.serviceRadius || '0'} km</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.invoices')}</Text>
        {userInvoices.length > 0 ? (
          userInvoices.map((invoice) => (
            <View key={invoice.id} style={styles.invoiceItem}>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
              <Text style={styles.invoiceDate}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
              <Text style={styles.invoiceAmount}>€{invoice.totalAmount.toFixed(2)}</Text>
              <Text style={[styles.invoiceStatus, { color: invoice.status === 'paid' ? '#4CAF50' : '#FFA500' }]}>
                {invoice.status}
              </Text>
            </View>
          ))
        ) : (
          <Text>{t('profile.noInvoices')}</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  verificationContainer: {
    marginBottom: 12,
  },
  verificationStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  documentType: {
    fontSize: 14,
  },
  documentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  infoValue: {
    flex: 1,
  },
  invoiceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  invoiceStatus: {
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;