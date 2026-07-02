import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@i18n/navigation';
import { ensureLocale } from '@i18n/getValidatedLocale';
import { createClient } from '@utils/supabase/server';
import SignUpForm from '@components/auth/SignUpForm';

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(ensureLocale(locale));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect({ href: '/', locale: ensureLocale(locale) });
  }

  const t = await getTranslations('signUp');

  return (
    <div className="container flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-sm rounded-xl border p-6">
        <h1 className="mb-6">{t('title')}</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
