
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import './VerificationQueue.css';
import '../App.css';

const VerificationQueue = () => {
  const { t } = useTranslation();
  const { providers } = useApi();
  const [verificationData, setVerificationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch providers with pending verification
        await providers.getProviders();
        // For now, use mock data structure
        setVerificationData([
          {
            id: '1',
            name: 'John Doe Plumbing',
            documents: [
              { type: 'meisterbrief', status: 'pending' },
              { type: 'idCard', status: 'pending' },
              { type: 'insurance', status: 'pending' },
            ]
          }
        ]);
      } catch (error) {
        console.error('Error fetching verification data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVerificationData();
  }, [providers]);

  const handleApprove = async (providerId: string, documentType: string) => {
    try {
      // In a real app, we would call the API to update the document status
      console.log(`Approving ${documentType} for provider ${providerId}`);
      // await providers.updateDocumentStatus(providerId, documentType, 'approved');
      
      // Update local state
      setVerificationData(prev => prev.map(provider => {
        if (provider.id === providerId) {
          return {
            ...provider,
            documents: provider.documents.map(doc =>
              doc.type === documentType ? { ...doc, status: 'approved' } : doc
            )
          };
        }
        return provider;
      }));
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async (providerId: string, documentType: string) => {
    try {
      // In a real app, we would call the API to update the document status
      console.log(`Rejecting ${documentType} for provider ${providerId}`);
      // await providers.updateDocumentStatus(providerId, documentType, 'rejected');
      
      // Update local state
      setVerificationData(prev => prev.map(provider => {
        if (provider.id === providerId) {
          return {
            ...provider,
            documents: provider.documents.map(doc =>
              doc.type === documentType ? { ...doc, status: 'rejected' } : doc
            )
          };
        }
        return provider;
      }));
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  if (loading) {
    return <div className="verification-container">{t('common.loading')}</div>;
  }

  return (
    <div className="verification-container">
      <h1>{t('verification.title')}</h1>
      <div className="providers-list">
        {verificationData.map((provider) => (
          <div key={provider.id} className="provider-card">
            <h2>{provider.name}</h2>
            <div className="documents-list">
              {provider.documents.map((document) => (
                <div key={document.type} className="document-item">
                  <span>{document.type.replace('_', ' ')}</span>
                  <span className={`status ${document.status}`}>{document.status}</span>
                  {document.status === 'pending' && (
                    <div className="actions">
                      <button
                        className="approve"
                        onClick={() => handleApprove(provider.id, document.type)}
                      >
                        {t('verification.approve')}
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleReject(provider.id, document.type)}
                      >
                        {t('verification.reject')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationQueue;