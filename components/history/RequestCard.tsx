'use client';

import { RequestLog } from '@/app/actions/requestHistory';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { statusColor, formatDuration, formatTimestamp } from './utils';
import { Locale } from 'use-intl';

export default function RequestCard({
  log,
  locale,
}: {
  log: RequestLog;
  locale: Locale;
}) {
  const t = useTranslations('history');
  return (
    <li>
      <Link
        href={`/history/${log.id}`}
        className="border-border hover:bg-surface-muted flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-4 py-3 transition-colors"
      >
        <span className="w-16 font-mono text-sm font-semibold">
          {log.method.toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate font-medium" title={log.url}>
          {log.endpoint}
        </span>
        <span
          className={`text-sm font-semibold tabular-nums ${statusColor(log.status_code)}`}
        >
          {log.status_code ?? t('error')}
        </span>
        <span className="text-muted w-20 text-right text-sm tabular-nums">
          {formatDuration(log.duration_ms)}
        </span>
        <span className="text-muted text-sm whitespace-nowrap">
          {formatTimestamp(log.created_at, locale)}
        </span>
      </Link>
    </li>
  );
}
