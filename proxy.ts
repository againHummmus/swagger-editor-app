import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from '@i18n/routing'
import { updateSession } from '@utils/supabase/proxy'

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  return await updateSession(request, handleI18nRouting)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
