import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useApi } from '../context/ApiContext';
import { useAuthContext } from '../context/AuthContext';

interface BookingFormProps {
  providerId: string;
  onBookingCreated: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ providerId, onBookingCreated }) => {
  const { bookings } = useApi();
  const { user } = useAuthContext();
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a booking');
      return;
    }

    try {
      await bookings.createBooking({
        customerId: user.id,
        providerId,
        serviceType,
        description,
        status: 'requested',
        scheduledAt: new Date(scheduledAt).toISOString(),
        customerAddress: address,
      });
      Alert.alert('Success', 'Booking request sent!');
      onBookingCreated();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Booking</Text>

      <Text style={styles.label}>Service Type</Text>
      <TextInput
        style={styles.input}
        value={serviceType}
        onChangeText={setServiceType}
        placeholder="e.g., Plumbing, Electrical"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the work needed"
        multiline
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Where should the work be done?"
      />

      <Text style={styles.label}>Scheduled Date & Time</Text>
      <TextInput
        style={styles.input}
        value={scheduledAt}
        onChangeText={setScheduledAt}
        placeholder="YYYY-MM-DD HH:MM"
      />

      <Button title="Request Booking" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default BookingForm;