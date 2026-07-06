import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import * as DocumentPicker from 'expo-document-picker';
import { uploadDocument, getVerificationStatus } from '../services/verification';
import { createProvider, getProviderByUserId } from '../services/providers.service';
import { RootState } from '../store';

const OnboardingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.auth);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!userId) return;
      try {
        const provider = await getProviderByUserId(userId);
        setProviderId(provider.id);
      } catch (error) {
        console.log('No provider found, starting onboarding');
      }
    };
    fetchProvider();
  }, [userId]);

  const handleDocumentUpload = async (documentType: DocumentType) => {
    if (!providerId) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.assets && result.assets[0]) {
        setLoading(true);
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
        } as any;
        await uploadDocument(providerId, documentType, file);
        Alert.alert(t('onboarding.success'), t('onboarding.documentUploaded'));
      }
    } catch (err) {
      Alert.alert(t('onboarding.error'), t('onboarding.uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      if (!providerId) {
        const providerData = {
          userId,
          businessName: 'My Business', // Replace with actual form data
          businessAddress: 'Sample Address', // Replace with actual form data
          taxId: '123456789', // Replace with actual form data
          certificationNumber: 'CERT123', // Replace with actual form data
        };
        const provider = await createProvider(providerData);
        setProviderId(provider.id);
      }
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
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>{t('onboarding.next')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 2 && (
        <View>
          <Text style={styles.subtitle}>{t('onboarding.documentUpload')}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('meisterbrief')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadMeisterbrief')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('id')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadID')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('insurance')}>
            <Text style={styles.buttonText}>{t('onboarding.uploadInsurance')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleDocumentUpload('iban')}>
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
    marginBottom: 24,
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
});

export default OnboardingScreen;