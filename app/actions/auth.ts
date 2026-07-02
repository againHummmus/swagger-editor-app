'use server';

import { cookies } from 'next/headers';
import { createClient } from '@utils/supabase/server';
import { redirect } from '@i18n/navigation';
import { ensureLocale } from '@i18n/getValidatedLocale';

export async function signIn(formData: {
  email: string;
  password: string;
  locale: string;
}): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: 'serverError' };
  }

  redirect({ href: '/', locale: ensureLocale(formData.locale) });
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';

  redirect({ href: '/', locale: ensureLocale(locale) });
}

export async function signUp(formData: {
  email: string;
  password: string;
  locale: string;
}): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: 'serverError' };
  }

  redirect({ href: '/', locale: ensureLocale(formData.locale) });
}
