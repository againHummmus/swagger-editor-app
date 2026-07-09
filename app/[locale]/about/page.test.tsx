import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

const messages: Record<string, string> = {
  title: 'About',
  description:
    'An analogue of Swagger, for creating, editing, validating, and viewing OpenAPI specifications. The user can work with API documentation, view endpoints, execute requests, generate cURL commands, and view request history.',
  'course.title': 'About RS School Course',
  'course.description':
    'RS School is a free course offered by the Rolling Scopes developer community since 2013. Anyone can study at RS School, regardless of age, occupation, or location.',
  'team.title': 'Development Team',
  'team.Eugene':
    'Passionate front-end developer and SDET(java, js stack) with a love for creating beautiful and user-friendly web applications.',
  'technologies.title': 'Technologies Used',
  'resources.title': 'Resources',
};

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => messages[key],
  setRequestLocale: () => {},
}));

describe('About page', () => {
  it('renders project, course, team, technologies and resources sections', async () => {
    const ui = await AboutPage({ params: Promise.resolve({ locale: 'en' }) });
    render(ui);

    expect(
      screen.getByRole('heading', { level: 1, name: 'About' })
    ).toBeInTheDocument();

    expect(screen.getByText(/An analogue of Swagger/)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'About RS School Course',
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/RS School is a free course/)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Development Team' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Technologies Used' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Resources' })
    ).toBeInTheDocument();
  });

  it('renders team members with roles and GitHub links', async () => {
    const ui = await AboutPage({ params: Promise.resolve({ locale: 'en' }) });
    render(ui);

    expect(screen.getByText('Eugene Kuzora')).toBeInTheDocument();
    expect(screen.getByText('Yana Pridannikova')).toBeInTheDocument();
    expect(screen.getByText('Pavel Kozin')).toBeInTheDocument();

    expect(screen.getByText('Frontend Developer / SDET')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();

    const githubLinks = screen.getAllByRole('link', { name: 'GitHub' });

    expect(githubLinks).toHaveLength(3);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/Eugeku');
    expect(githubLinks[1]).toHaveAttribute(
      'href',
      'https://github.com/againHummmuse'
    );
    expect(githubLinks[2]).toHaveAttribute('href', 'https://github.com/oreopk');
  });

  it('renders technologies used in the project', async () => {
    const ui = await AboutPage({ params: Promise.resolve({ locale: 'en' }) });
    render(ui);

    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
    expect(screen.getByText('Supabase')).toBeInTheDocument();
    expect(screen.getByText('OpenAPI')).toBeInTheDocument();
    expect(screen.getByText('Vitest')).toBeInTheDocument();
  });

  it('renders resource links', async () => {
    const ui = await AboutPage({ params: Promise.resolve({ locale: 'en' }) });
    render(ui);

    expect(screen.getByRole('link', { name: 'RS School' })).toHaveAttribute(
      'href',
      'https://rs.school/'
    );

    expect(
      screen.getByRole('link', { name: 'The Rolling Scopes GitHub' })
    ).toHaveAttribute('href', 'https://github.com/rolling-scopes-school');

    expect(
      screen.getByRole('link', { name: 'OpenAPI Specification' })
    ).toHaveAttribute('href', 'https://spec.openapis.org/oas/latest.html');
  });
});
