import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InfoPopup from './InfoPopup';

describe('InfoPopup', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders message, title and dismiss label', () => {
    render(
      <InfoPopup
        message="Test message"
        title="Test title"
        dismissLabel="OK"
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('uses default title "Error" when not provided', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('uses default dismiss label "Dismiss" when not provided', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('sets aria-label to title', () => {
    render(
      <InfoPopup message="msg" title="My Title" onClose={onClose} />,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      'My Title',
    );
  });

  it('calls onClose when clicking the backdrop', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    const innerDiv = screen.getByText('msg').parentElement!;
    fireEvent.click(innerDiv);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the close button', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the dismiss button', () => {
    render(
      <InfoPopup message="msg" dismissLabel="OK" onClose={onClose} />,
    );
    fireEvent.click(screen.getByText('OK'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other key presses', () => {
    render(<InfoPopup message="msg" onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('removes keydown listener on unmount', () => {
    const { unmount } = render(
      <InfoPopup message="msg" onClose={onClose} />,
    );
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
