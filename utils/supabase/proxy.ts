import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@i18n/routing';

type I18nHandler = (request: NextRequest) => NextResponse;

export async function updateSession(
  request: NextRequest,
  handleI18nRouting: I18nHandler
) {
  const response = handleI18nRouting(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  const segments = request.nextUrl.pathname.split('/');
  const maybeLocale = segments[1];
  const hasLocalePrefix = (routing.locales as readonly string[]).includes(
    maybeLocale
  );
  const locale = hasLocalePrefix ? maybeLocale : routing.defaultLocale;
  const pathname = hasLocalePrefix
    ? `/${segments.slice(2).join('/')}`
    : request.nextUrl.pathname;

  //random protected routes that do not yet exist in the app (change later)
  const protectedPaths = ['/history'];
  const isProtectedPage = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = locale === routing.defaultLocale ? '/' : `/${locale}`;
    return NextResponse.redirect(url);
  }

  return response;
}
