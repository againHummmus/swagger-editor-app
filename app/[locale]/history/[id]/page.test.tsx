import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test/intl';
import type { RequestLog } from '@/app/actions/requestHistory';
import HistoryEntryPage from './page';

const mockGetHistoryEntry = vi.fn();

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));

vi.mock('@i18n/getValidatedLocale', () => ({
  ensureLocale: (locale: string) => locale,
}));

vi.mock('@i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

vi.mock('@/app/actions/requestHistory', () => ({
  getHistoryEntry: (id: string) => mockGetHistoryEntry(id),
}));

const log: RequestLog = {
  id: 'entry-1',
  method: 'get',
  endpoint: '/pet/{id}',
  url: 'https://api.example.com/pet/1',
  status_code: 200,
  duration_ms: 123,
  request_size: 0,
  response_size: 456,
  error_details: null,
  created_at: '2024-01-01T10:00:00.000Z',
};

describe('history entry page', () => {
  beforeEach(() => {
    mockGetHistoryEntry.mockReset();
  });

  it('returns not found if no item is found', async () => {
    mockGetHistoryEntry.mockResolvedValue({ data: undefined });

    await expect(
      HistoryEntryPage({
        params: Promise.resolve({ locale: 'en', id: 'missing' }),
      })
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('renders the details for an existing entry', async () => {
    mockGetHistoryEntry.mockResolvedValue({ data: log });

    const ui = await HistoryEntryPage({
      params: Promise.resolve({ locale: 'en', id: 'entry-1' }),
    });
    renderWithIntl(ui);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/pet/{id}')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText(log.url)).toBeInTheDocument();
    expect(mockGetHistoryEntry).toHaveBeenCalledWith('entry-1');
  });
});
