"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/ApiContext';

const VerificationQueue = () => {
  const { t } = useTranslation();
  const { providers } = useApi();
  const [verificationData, setVerificationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        setLoading(true);
        await providers.getProviders();
        setVerificationData([
          {
            id: '1',
            name: 'John Doe Plumbing',
            documents: [
              { type: 'meisterbrief', status: 'pending' },
              { type: 'idCard', status: 'pending' },
              { type: 'insurance', status: 'pending' },
            ],
          },
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
    setVerificationData(prev => prev.map(provider => {
      if (provider.id === providerId) {
        return {
          ...provider,
          documents: provider.documents.map(doc =>
            doc.type === documentType ? { ...doc, status: 'approved' } : doc
          ),
        };
      }
      return provider;
    }));
  };

  const handleReject = async (providerId: string, documentType: string) => {
    setVerificationData(prev => prev.map(provider => {
      if (provider.id === providerId) {
        return {
          ...provider,
          documents: provider.documents.map(doc =>
            doc.type === documentType ? { ...doc, status: 'rejected' } : doc
          ),
        };
      }
      return provider;
    }));
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('verification.title')}</h1>
      <div className="space-y-4">
        {verificationData.map((provider) => (
          <div key={provider.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{provider.name}</h2>
            <div className="space-y-2">
              {provider.documents.map((document) => (
                <div key={document.type} className="flex items-center justify-between p-2 border rounded">
                  <span>{document.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    document.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    document.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {document.status}
                  </span>
                  {document.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleApprove(provider.id, document.type)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        {t('verification.approve')}
                      </button>
                      <button
                        onClick={() => handleReject(provider.id, document.type)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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