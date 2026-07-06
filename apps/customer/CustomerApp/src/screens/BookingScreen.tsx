import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApi } from '../context/ApiContext';
import { useAuthContext } from '../context/AuthContext';

const BookingScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { bookings } = useApi();
  const { user } = useAuthContext();
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const providerId = route.params?.providerId;

  const handleBookingRequest = async () => {
    if (!date || !address || !description) {
      Alert.alert(t('booking.error'), t('booking.missingFields'));
      return;
    }
    
    if (!user?.id) {
      Alert.alert(t('booking.error'), t('booking.notLoggedIn'));
      return;
    }
    
    setLoading(true);
    try {
      await bookings.createBooking({
        customerId: user.id,
        providerId,
        serviceType: 'service', // This should be dynamic based on provider
        description,
        status: 'requested',
        scheduledAt: new Date(date).toISOString(),
        customerAddress: address,
      });
      
      Alert.alert(t('booking.success'), t('booking.requestSent'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('booking.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('booking.title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('booking.date')}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder={t('booking.address')}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder={t('booking.description')}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleBookingRequest} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>{t('booking.request')}</Text>
        )}
      </TouchableOpacity>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;