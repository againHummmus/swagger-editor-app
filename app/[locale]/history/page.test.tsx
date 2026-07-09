import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test/intl';
import type { RequestLog } from '@/app/actions/requestHistory';
import HistoryPage from './page';

const mockGetHistory = vi.fn();

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
}));

vi.mock('@i18n/getValidatedLocale', () => ({
  ensureLocale: (locale: string) => locale,
}));

vi.mock('@i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/app/actions/requestHistory', () => ({
  getHistory: () => mockGetHistory(),
}));

const makeLog = (overrides: Partial<RequestLog>): RequestLog => ({
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
  ...overrides,
});

describe('history page', () => {
  beforeEach(() => {
    mockGetHistory.mockReset();
  });

  it('shows a message and a link to the editor when there are no logs', async () => {
    mockGetHistory.mockResolvedValue({ data: [] });

    const ui = await HistoryPage({ params: Promise.resolve({ locale: 'en' }) });
    renderWithIntl(ui);

    expect(
      screen.getByText(/You haven't executed any requests yet/i)
    ).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /go to the editor/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders each log linking to its detail page', async () => {
    const logs = [
      makeLog({ id: 'entry-1', endpoint: '/pet/{id}' }),
    ];
    mockGetHistory.mockResolvedValue({ data: logs });

    const ui = await HistoryPage({ params: Promise.resolve({ locale: 'en' }) });
    renderWithIntl(ui);

    expect(screen.getByText('/pet/{id}')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/history/entry-1',
    ]);
  });
});
