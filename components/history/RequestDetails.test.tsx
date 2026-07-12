import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithIntl as render } from '@/test/intl';
import type { RequestLog } from '@/app/actions/requestHistory';
import RequestDetails from './RequestDetails';

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

describe('RequestDetails', () => {
  it('renders all info', () => {
    render(<RequestDetails log={log} locale="en" />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/pet/{id}')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText(log.url)).toBeInTheDocument();
    expect(screen.getByText('123 ms')).toBeInTheDocument();
    expect(screen.getByText('0 B')).toBeInTheDocument();
    expect(screen.getByText('456 B')).toBeInTheDocument();
  });

  it('shows the error details when they exist', () => {
    render(
      <RequestDetails
        log={{ ...log, status_code: 500, error_details: '500 Server Error' }}
        locale="en"
      />
    );
    expect(screen.getByText('500 Server Error')).toBeInTheDocument();
  });
});
