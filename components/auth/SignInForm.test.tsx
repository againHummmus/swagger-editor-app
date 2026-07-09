import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@test/intl';
import SignInForm from './SignInForm';

const mockSignIn = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/auth', () => ({
  signIn: mockSignIn,
}));

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password fields', () => {
    renderWithProviders(<SignInForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<SignInForm />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(emailInput, 'a');
    await userEvent.clear(emailInput);
    await userEvent.type(passwordInput, 'a');
    await userEvent.clear(passwordInput);
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('calls server signIn on valid submit', async () => {
    mockSignIn.mockResolvedValue(undefined);
    renderWithProviders(<SignInForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'ValidPass1!',
        locale: 'en',
      });
    });
  });

  it('shows no error on successful login', async () => {
    mockSignIn.mockResolvedValue(undefined);
    renderWithProviders(<SignInForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows server error on failed login', async () => {
    mockSignIn.mockResolvedValue({ error: 'invalid_credentials' });
    renderWithProviders(<SignInForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});
