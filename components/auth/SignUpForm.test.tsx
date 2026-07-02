import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@test/intl';
import SignUpForm from './SignUpForm';

const mockSignUp = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/auth', () => ({
  signUp: mockSignUp,
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields and submit button', () => {
    renderWithIntl(<SignUpForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Account' })
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithIntl(<SignUpForm />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmInput = screen.getByLabelText('Confirm Password');
    for (const input of [emailInput, passwordInput, confirmInput]) {
      await userEvent.type(input, 'a');
      await userEvent.clear(input);
    }
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it("shows mismatch error when passwords don't match", async () => {
    renderWithIntl(<SignUpForm />);
    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'Different1!'
    );
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('calls server signUp on valid submit', async () => {
    mockSignUp.mockResolvedValue(undefined);
    renderWithIntl(<SignUpForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'ValidPass1!'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'ValidPass1!',
        locale: 'en',
      });
    });
  });

  it('shows no error on successful sign up', async () => {
    mockSignUp.mockResolvedValue(undefined);
    renderWithIntl(<SignUpForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'ValidPass1!'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    await waitFor(() => {
      expect(
        screen.queryByText('An account with this email already exists')
      ).not.toBeInTheDocument();
    });
  });

  it('shows server error on failed sign up', async () => {
    mockSignUp.mockResolvedValue({ error: 'serverError' });
    renderWithIntl(<SignUpForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'ValidPass1!'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('An account with this email already exists')
      ).toBeInTheDocument();
    });
  });
});
