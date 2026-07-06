import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const resources = {
  en: {
    translation: {
      onboarding: {
        title: 'Provider Onboarding',
        welcome: 'Welcome to Urban Home Services',
        businessName: 'Business Name',
        trade: 'Trade (e.g., Plumber, Electrician)',
        next: 'Next',
        documentUpload: 'Document Verification',
        hwkNumber: 'HWK Number',
        insuranceNumber: 'Insurance Number',
        iban: 'IBAN (Bank Account)',
        uploadMeisterbrief: 'Upload Meisterbrief',
        uploadID: 'Upload ID Card',
        uploadInsurance: 'Upload Insurance Certificate',
        uploadIBAN: 'Upload Bank Statement',
        submit: 'Complete Onboarding',
        success: 'Success',
        documentUploaded: 'Document uploaded successfully',
        error: 'Error',
      },
      jobRequests: {
        title: 'Job Requests',
        accept: 'Accept',
        decline: 'Decline',
        noJobs: 'No job requests available',
      },
      profile: {
        verificationStatus: 'Verification Status',
        businessInfo: 'Business Information',
        trade: 'Trade',
        serviceRadius: 'Service Radius',
        invoices: 'Invoices',
        logout: 'Logout',
        notVerified: 'Not verified yet',
        noInvoices: 'No invoices available',
      },
      common: {
        loading: 'Loading...',
      }
    }
  }
};

export const initI18n = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
};

export default i18n;