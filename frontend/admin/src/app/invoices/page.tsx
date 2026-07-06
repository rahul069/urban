"use client";

import { useTranslation } from 'react-i18next';

const Invoices = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('invoices.title')}</h1>
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <p>Invoice management dashboard will be implemented here.</p>
      </div>
    </div>
  );
};

export default Invoices;