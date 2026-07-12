'use client';

import { useState } from 'react';
import InfoPopup from '@/components/popup/InfoPopup';
import { useTranslations } from 'next-intl';

type ServerErrorHandlerProps = {
  error: string;
  children: React.ReactNode;
};

export default function ServerErrorHandler({ error, children }: ServerErrorHandlerProps) {
  const [showError, setShowError] = useState(true);
  const tc = useTranslations('popup');

  if (showError && error) {
    return (
      <>
        {children}
        <InfoPopup
          message={error}
          dismissLabel={tc('dismiss')}
          onClose={() => setShowError(false)}
        />
      </>
    );
  }

  return <>{children}</>;
}
