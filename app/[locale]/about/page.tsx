import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ensureLocale } from '@i18n/getValidatedLocale';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(ensureLocale(locale));
  const t = await getTranslations('about');

  const technologies = [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind',
    'Supabase',
    'OpenAPI',
    'Vitest',
  ];

  return (
    <div className="container flex flex-1 flex-col gap-10 py-10">
      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <h1 className="text-4xl">{t('title')}</h1>
        <p className="text-muted max-w-3xl text-lg">{t('description')}</p>
      </section>

      <section className="rounded-lg border border-border bg-surface px-6 py-5">
        <h2 className="mb-3 text-xl">{t('course.title')}</h2>
        <p className="text-muted">{t('course.description')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">{t('team.title')}</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4">
            <div>
              <h3 className="">Eugene Kuzora</h3>
              <p className="text-muted text-sm">Frontend Developer / SDET</p>
            </div>
            <p className="text-muted text-sm">{t('team.Eugene')}</p>
            <a
              href="https://github.com/Eugeku"
              target="_blank"
              rel="noreferrer"
              className="mt-auto rounded-md border border-border px-3 py-1.5 text-center text-sm font-medium transition-colors hover:bg-surface-muted"
            >
              GitHub
            </a>
          </article>

          <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4">
            <div>
              <h3 className="">Yana Pridannikova</h3>
              <p className="text-muted text-sm">Developer</p>
            </div>
            <p className="text-muted text-sm"></p>
            <a
              href="https://github.com/againHummmuse"
              target="_blank"
              rel="noreferrer"
              className="mt-auto rounded-md border border-border px-3 py-1.5 text-center text-sm font-medium transition-colors hover:bg-surface-muted"
            >
              GitHub
            </a>
          </article>

          <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4">
            <div>
              <h3 className="">Pavel Kozin</h3>
              <p className="text-muted text-sm">Frontend Developer</p>
            </div>
            <p className="text-muted text-sm"></p>
            <a
              href="https://github.com/oreopk"
              target="_blank"
              rel="noreferrer"
              className="mt-auto rounded-md border border-border px-3 py-1.5 text-center text-sm font-medium transition-colors hover:bg-surface-muted"
            >
              GitHub
            </a>
          </article>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl">{t('technologies.title')}</h2>
        <ul className="flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm"
            >
              {technology}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl">{t('resources.title')}</h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          <li>
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface-muted"
            >
              RS School
            </a>
          </li>
          <li>
            <a
              href="https://github.com/rolling-scopes-school"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface-muted"
            >
              The Rolling Scopes GitHub
            </a>
          </li>
          <li>
            <a
              href="https://spec.openapis.org/oas/latest.html"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface-muted"
            >
              OpenAPI Specification
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
