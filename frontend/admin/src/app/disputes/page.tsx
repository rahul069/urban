"use client";

import { useTranslation } from 'react-i18next';

const Disputes = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('disputes.title')}</h1>
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <p>Dispute resolution dashboard will be implemented here.</p>
      </div>
    </div>
  );
};

export default Disputes;