import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RequestLog } from '@/app/actions/requestHistory';
import RequestCard from './RequestCard';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
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
  created_at: '2024-06-15T12:00:00.000Z',
};

describe('RequestCard', () => {
  it('links to the detail page of the log', () => {
    render(<RequestCard log={log} locale="en" />);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/history/entry-1'
    );
  });

  it('renders the method, endpoint and status code', () => {
    render(<RequestCard log={log} locale="en" />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/pet/{id}')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('shows "Error" when there is no status code', () => {
    render(
      <RequestCard log={{ ...log, status_code: null }} locale="en" />
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
