'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

type InfoPopupProps = {
  message: string;
  onClose: () => void;
  title?: string;
  variant?: 'error' | 'success' | 'none';
  dismissLabel?: string;
};

export default function InfoPopup({
  message,
  onClose,
  title,
  variant = 'error',
  dismissLabel,
}: InfoPopupProps) {
  const t = useTranslations('popup');
  const resolvedTitle = title ?? t('errorTitle');
  const resolvedDismiss = dismissLabel ?? t('dismiss');
  const isSuccess = variant === 'success';
  const isNone = variant === 'none';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={resolvedTitle}
    >
      <div
        className="mx-4 w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <CheckCircle className="h-6 w-6 shrink-0 text-method-post" />
            ) : (
              <AlertCircle className="h-6 w-6 shrink-0 text-method-delete" />
            )}
            <h2 className="text-lg font-semibold text-foreground">{resolvedTitle}</h2>
          </div>
          {!isNone && (
            <button
              onClick={onClose}
              className="cursor-pointer rounded p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              aria-label={t('close')}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {message}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`cursor-pointer rounded px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 ${isSuccess ? 'bg-method-post' : 'bg-method-delete'}`}
          >
            {resolvedDismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
