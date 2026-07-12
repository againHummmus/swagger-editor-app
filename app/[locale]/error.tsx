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
      message={`Unhandled server error: ${error.message}`}
      dismissLabel={tc('dismiss')}
      onClose={reset}
    />
  );
}
