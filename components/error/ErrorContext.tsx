'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';
import InfoPopup from '@/components/popup/InfoPopup';

type ErrorContextValue = {
  showError: (message: string, title?: string) => void;
};

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return ctx;
}

type ErrorProviderProps = {
  children: ReactNode;
};

type ErrorState = {
  message: string;
  title: string;
} | null;

export function ErrorProvider({ children }: ErrorProviderProps) {
  const tc = useTranslations('popup');
  const [error, setError] = useState<ErrorState>(null);

  const showError = useCallback((message: string, title = 'Error') => {
    setError({ message, title });
  }, []);

  const handleClose = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {error && (
        <InfoPopup
          message={error.message}
          title={error.title}
          dismissLabel={tc('dismiss')}
          onClose={handleClose}
        />
      )}
    </ErrorContext.Provider>
  );
}
