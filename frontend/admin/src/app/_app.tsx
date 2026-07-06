"use client";

import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store';
import { mockWorker } from '../services/mock';
import { useEffect } from 'react';

if (process.env.NODE_ENV === 'development') {
  mockWorker.start();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}