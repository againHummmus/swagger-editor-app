export function formatBytes(bytes: number | null): string {
  if (bytes == null) return '—';
  return `${bytes} B`;
}

export function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  return `${ms} ms`;
}

export function formatTimestamp(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function statusColor(statusCode: number | null): string {
  return statusCode != null && statusCode < 400
    ? 'text-green-700'
    : 'text-red-700';
}

export function statusBackground(statusCode: number | null): string {
  return statusCode != null && statusCode < 400
    ? 'bg-green-700'
    : 'bg-red-700';
}

