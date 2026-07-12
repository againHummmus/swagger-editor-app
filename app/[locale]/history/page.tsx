import { setRequestLocale } from 'next-intl/server';
import { ensureLocale } from '@i18n/getValidatedLocale';
import { Link } from '@i18n/navigation';
import { getHistory } from '@/app/actions/requestHistory';
import RequestCard from '@/components/history/RequestCard';
import ServerErrorHandler from '@/components/error/ServerErrorHandler';

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = ensureLocale(locale);
  setRequestLocale(validLocale);

  const { data: logs = [], error } = await getHistory();

  if (logs.length === 0) {
    return (
      <ServerErrorHandler error={error ?? ''}>
        <div className="container flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">History &amp; Analytics</h1>
          <p className="text-muted">You haven&apos;t executed any requests yet!</p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-foreground text-surface hover:bg-foreground-hover rounded-lg px-4 py-2 font-medium transition-colors"
            >
              Go to the Editor
            </Link>
          </div>
        </div>
      </ServerErrorHandler>
    );
  }

  return (
    <ServerErrorHandler error={error ?? ''}>
      <div className="container flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold">History &amp; Analytics</h1>
        <ul className="flex flex-col gap-2">
          {logs.map((log) => (
            <RequestCard key={log.id} log={log} locale={validLocale} />
          ))}
        </ul>
      </div>
    </ServerErrorHandler>
  );
}
