import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ensureLocale } from '@i18n/getValidatedLocale';
import { Link } from '@i18n/navigation';
import { getHistoryEntry } from '@/app/actions/requestHistory';
import RequestDetails from '@/components/history/RequestDetails';
import ServerErrorHandler from '@/components/error/ServerErrorHandler';

export default async function HistoryEntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const validLocale = ensureLocale(locale);
  setRequestLocale(validLocale);
  const t = await getTranslations({ locale: validLocale, namespace: 'history' });

  const { data: log, error } = await getHistoryEntry(id);

  if (!log) {
    notFound();
  }

  return (
    <ServerErrorHandler error={error ?? ''}>
      <div className="container">
        <Link
          href="/history"
          className="text-muted hover:text-foreground text-sm transition-colors"
        >
          ← {t('back')}
        </Link>
        <RequestDetails log={log} locale={validLocale} />
      </div>
    </ServerErrorHandler>
  );
}
