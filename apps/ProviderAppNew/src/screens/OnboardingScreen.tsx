import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApi } from '../context/ApiContext';
import { useAuthContext } from '../context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';

const OnboardingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { providers } = useApi();
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [trade, setTrade] = useState('');
  const [hwkNumber, setHwkNumber] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [iban, setIban] = useState('');

  const handleDocumentUpload = async (documentType: 'meisterbrief' | 'idCard' | 'insurance' | 'bankStatement') => {
    if (!user?.id) return;
    
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.assets && result.assets[0]) {
        setLoading(true);
        const file = result.assets[0];
        
        const metadata = {
          hwkNumber: documentType === 'meisterbrief' ? hwkNumber : undefined,
          insuranceNumber: documentType === 'insurance' ? insuranceNumber : undefined,
          iban: documentType === 'bankStatement' ? iban : undefined,
        };
        
        await providers.uploadProviderDocument(
          user.id,
          documentType,
          file,
          metadata
        );
        
        Alert.alert(t('onboarding.success'), t('onboarding.documentUploaded'));
      }
    } catch (err) {
      Alert.alert(t('onboarding.error'), err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert(t('onboarding.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.title')}</Text>
      {step === 1 && (
        <View>
          <Text style={styles.welcomeText}>{t('onboarding.welcome')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.businessName')}
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.trade')}
            value={trade}
            onChangeText={setTrade}
          />
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>{t('onboarding.next')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 2 && (
        <View>
          <Text style={styles.subtitle}>{t('onboarding.documentUpload')}</Text>
          
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.hwkNumber')}
            value={hwkNumber}
            onChangeText={setHwkNumber}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('meisterbrief')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadMeisterbrief')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('idCard')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadID')}</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.insuranceNumber')}
            value={insuranceNumber}
            onChangeText={setInsuranceNumber}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('insurance')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadInsurance')}</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.iban')}
            value={iban}
            onChangeText={setIban}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('bankStatement')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadIBAN')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>{t('onboarding.submit')}</Text>
            )}
          </TouchableOpacity>
        </View>
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
  welcomeText: {
    fontSize: 18,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});

export default OnboardingScreen;