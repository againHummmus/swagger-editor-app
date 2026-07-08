import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockCreateClient = vi.fn(() => ({
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    signOut: mockSignOut,
  },
}));

const mockRedirect = vi.fn();
const mockCookieGet = vi.fn();

vi.mock('@utils/supabase/server', () => ({
  createClient: mockCreateClient,
}));

vi.mock('@i18n/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@i18n/getValidatedLocale', () => ({
  ensureLocale: (locale: string) => locale,
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockCookieGet })),
}));

const { signIn, signOut, signUp } = await import('./auth');

const validCredentials = {
  email: 'user@test.com',
  password: 'ValidPass1!',
  locale: 'en',
};

describe('signIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error code when signInWithPassword fails with a code', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { code: 'invalid_credentials', message: 'Invalid login credentials' },
    });

    const result = await signIn(validCredentials);

    expect(result).toEqual({ error: 'invalid_credentials' });
  });

  it('returns error message when signInWithPassword fails without a code', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { code: null, message: 'Some server error' },
    });

    const result = await signIn(validCredentials);

    expect(result).toEqual({ error: 'Some server error' });
  });

  it('redirects to home on success', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    });

    const result = await signIn(validCredentials);

    expect(result).toBeUndefined();
    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/',
      locale: 'en',
    });
  });

  it('uses locale from formData for redirect', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    });

    await signIn({ ...validCredentials, locale: 'ru' });

    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/',
      locale: 'ru',
    });
  });

  it('passes email and password to supabase', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { code: 'invalid_credentials', message: '' },
    });

    await signIn(validCredentials);

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'ValidPass1!',
    });
  });
});

describe('signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error code when signUp fails with a code', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { code: 'user_repeated_signup', message: 'User already registered' },
    });

    const result = await signUp(validCredentials);

    expect(result).toEqual({ error: 'user_repeated_signup' });
  });

  it('returns error message when signUp fails without a code', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { code: null, message: 'Server error' },
    });

    const result = await signUp(validCredentials);

    expect(result).toEqual({ error: 'Server error' });
  });

  it('returns success on successful signup', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    });

    const result = await signUp(validCredentials);

    expect(result).toEqual({ success: true });
  });

  it('passes email and password to supabase', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    });

    await signUp(validCredentials);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'ValidPass1!',
    });
  });
});

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls supabase.auth.signOut', async () => {
    mockCookieGet.mockReturnValue({ value: 'en' });

    await signOut();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('redirects to home with locale from cookie', async () => {
    mockCookieGet.mockReturnValue({ value: 'ru' });

    await signOut();

    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/',
      locale: 'ru',
    });
  });

  it('defaults to en when no locale cookie', async () => {
    mockCookieGet.mockReturnValue(undefined);

    await signOut();

    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/',
      locale: 'en',
    });
  });

  it('creates supabase client', async () => {
    mockCookieGet.mockReturnValue({ value: 'en' });

    await signOut();

    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });
});
