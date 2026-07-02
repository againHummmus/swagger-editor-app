import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@utils/supabase/server';

export async function GET(request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value ?? 'en';
  const redirectUrl = new URL(
    locale === 'en' ? '/' : `/${locale}`,
    request.url
  );

  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(redirectUrl);
}
