'use client';

import InfoPopup from '@/components/popup/InfoPopup';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tc = useTranslations('popup');

  return (
    <InfoPopup
      title={tc('serverErrorTitle')}
      variant="none"
      message={`${tc('serverErrorMessage')}\n${error.message}`}
      dismissLabel={tc('reload')}
      onClose={reset}
    />
  );
}
