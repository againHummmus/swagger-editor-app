import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

vi.mock('@/components/popup/InfoPopup', () => ({
  default: ({ message, title, onClose }: { message: string; title: string; onClose: () => void }) => (
    <div data-testid="info-popup">
      <span data-testid="popup-title">{title}</span>
      <span data-testid="popup-message">{message}</span>
      <button onClick={onClose}>Dismiss</button>
    </div>
  ),
}));

function GoodChild() {
  return <div>Good child</div>;
}

function BadChild({ message }: { message?: string }): ReactNode {
  throw new Error(message ?? 'Test error');
}

let shouldThrow = true;

function ThrowsOnce() {
  if (shouldThrow) {
    return <BadChild />;
  }
  return <div>Recovered</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    shouldThrow = true;
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Good child')).toBeInTheDocument();
  });

  it('catches rendering error and shows popup', () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('info-popup')).toBeInTheDocument();
  });

  it('displays the error message', () => {
    render(
      <ErrorBoundary>
        <BadChild message="Oops!" />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('popup-message')).toHaveTextContent('Oops!');
  });

  it('shows default message when error has no message', () => {
    render(
      <ErrorBoundary>
        <BadChild message="" />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('popup-message')).toHaveTextContent(
      'An unexpected error occurred. Please try again.',
    );
  });

  it('shows popup with title "Something went wrong"', () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('popup-title')).toHaveTextContent(
      'Something went wrong',
    );
  });

  it('resets and renders children after dismiss', () => {
    render(
      <ErrorBoundary>
        <ThrowsOnce />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('info-popup')).toBeInTheDocument();
    shouldThrow = false;

    fireEvent.click(screen.getByText('Dismiss'));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
    expect(screen.queryByTestId('info-popup')).not.toBeInTheDocument();
  });
});
