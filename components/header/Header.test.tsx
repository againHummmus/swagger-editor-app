import type { MouseEventHandler, ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '@test/intl';
import Header from './Header';

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    onClick,
    children,
  }: {
    href: string;
    onClick?: MouseEventHandler;
    children: ReactNode;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders the brand logo linking home', () => {
    renderWithIntl(<Header />);
    const brand = screen.getByRole('link', { name: /swagger editor/i });
    expect(brand).toHaveAttribute('href', '/');
  });

  it('renders navigation links to the main routes', () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      '/signin'
    );
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
      'href',
      '/signup'
    );
  });

  it('renders an accessible language switcher', () => {
    renderWithIntl(<Header />);
    expect(
      screen.getByRole('group', { name: /change language/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'RU' })).toBeInTheDocument();
  });

  it('toggles the mobile menu when the menu button is clicked', () => {
    renderWithIntl(<Header />);
    const toggle = screen.getByRole('button', { name: /toggle menu/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('link', { name: 'Sign Up' })).toHaveLength(1);

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('link', { name: 'Sign Up' })).toHaveLength(2);
  });

  it.each(['About', 'Sign In', 'Sign Up'])(
    'closes the mobile menu when the %s link inside it is clicked',
    (name) => {
      renderWithIntl(<Header />);
      const toggle = screen.getByRole('button', { name: /toggle menu/i });

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');

      const mobileLink = screen.getAllByRole('link', { name })[1];
      fireEvent.click(mobileLink);

      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getAllByRole('link', { name })).toHaveLength(1);
    }
  );

  describe('auth states', () => {
    it('renders Sign In and Sign Up when not authenticated', () => {
      renderWithIntl(<Header />);
      expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
        'href',
        '/signin'
      );
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
        'href',
        '/signup'
      );
      expect(
        screen.queryByRole('link', { name: 'History' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Sign Out' })
      ).not.toBeInTheDocument();
    });

    it('renders History and Sign Out when authenticated', () => {
      renderWithIntl(<Header isAuthenticated />);
      expect(screen.getByRole('link', { name: 'History' })).toHaveAttribute(
        'href',
        '/history'
      );
      expect(screen.getByRole('link', { name: 'Sign Out' })).toHaveAttribute(
        'href',
        '/auth/signout'
      );
      expect(
        screen.queryByRole('link', { name: 'Sign In' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Sign Up' })
      ).not.toBeInTheDocument();
    });

    it('renders About link when not authenticated', () => {
      renderWithIntl(<Header />);
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
        'href',
        '/about'
      );
    });

    it('renders About link when authenticated', () => {
      renderWithIntl(<Header isAuthenticated />);
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
        'href',
        '/about'
      );
    });

    it('renders language switcher when not authenticated', () => {
      renderWithIntl(<Header />);
      expect(
        screen.getByRole('group', { name: /change language/i })
      ).toBeInTheDocument();
    });

    it('renders language switcher when authenticated', () => {
      renderWithIntl(<Header isAuthenticated />);
      expect(
        screen.getByRole('group', { name: /change language/i })
      ).toBeInTheDocument();
    });
  });
});
