import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorPage from './error';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/popup/InfoPopup', () => ({
  default: ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div data-testid="info-popup">
      <span data-testid="popup-message">{message}</span>
      <button onClick={onClose}>Dismiss</button>
    </div>
  ),
}));

describe('ErrorPage', () => {
  it('renders error message in popup', () => {
    const error = new Error('Test error message');
    const reset = vi.fn();

    render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByTestId('info-popup')).toBeInTheDocument();
    expect(screen.getByTestId('popup-message')).toHaveTextContent('Test error message');
  });

  it('calls reset when popup is closed', () => {
    const error = new Error('Test error');
    const reset = vi.fn();

    render(<ErrorPage error={error} reset={reset} />);

    fireEvent.click(screen.getByText('Dismiss'));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
