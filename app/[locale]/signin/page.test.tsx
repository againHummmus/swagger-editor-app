import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithIntl } from '@test/intl';
import SignInPage from './page';

const mockGetUser = vi.fn();

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {},
}));

vi.mock('@utils/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
  }),
}));

vi.mock('@i18n/navigation', () => ({
  redirect: () => {
    throw new Error('NEXT_REDIRECT');
  },
  useRouter: () => ({ push: vi.fn() }),
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Sign in page', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
  });

  it('renders the form when not authenticated', async () => {
    const ui = await SignInPage({ params: Promise.resolve({ locale: 'en' }) });
    const { container } = renderWithIntl(ui);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('redirects to home when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test' } },
    });

    await expect(
      SignInPage({ params: Promise.resolve({ locale: 'en' }) })
    ).rejects.toThrow('NEXT_REDIRECT');
  });
});
