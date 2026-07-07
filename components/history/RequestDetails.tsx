import type { RequestLog } from '@/app/actions/requestHistory';
import {
  formatBytes,
  formatDuration,
  formatTimestamp,
  statusBackground,
} from './utils';

export default function RequestDetails({
  log,
  locale,
}: {
  log: RequestLog;
  locale: string;
}) {
  const rows: { label: string; value: string; className?: string }[] = [
    { label: 'URL', value: log.url, className: 'break-all' },
    { label: 'Timestamp', value: formatTimestamp(log.created_at, locale) },
    { label: 'Duration', value: formatDuration(log.duration_ms), className: 'tabular-nums' },
    { label: 'Request size', value: formatBytes(log.request_size), className: 'tabular-nums' },
    { label: 'Response size', value: formatBytes(log.response_size), className: 'tabular-nums' },
  ];

  return (
    <div className="relative container rounded-2xl border border-border flex max-w-2xl flex-1 flex-col gap-4 px-0">
      <div
        className={`flex items-center gap-3 p-4 rounded-t-2xl text-base lg:text-2xl text-white font-bold ${statusBackground(log.status_code)}`}
      >
        <span className="font-mono">{log.method.toUpperCase()}</span>
        <span className="min-w-0 flex-1 truncate text-sm lg:text-2xl ">{log.endpoint}</span>
        <span className="tabular-nums">
          {log.status_code ?? 'Error'}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody className="text-base divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="w-40 py-2.5 pr-6 text-left align-top font-medium text-muted"
                  >
                    {row.label}
                  </th>
                  <td className={`min-w-40 py-2.5 ${row.className ?? ''}`}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {log.error_details && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2 whitespace-pre-wrap text-red-700">
            {log.error_details}
          </div>
        )}
      </div>
    </div>
  );
}
