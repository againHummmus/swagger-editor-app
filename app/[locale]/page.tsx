import { setRequestLocale } from 'next-intl/server';
import { ensureLocale } from '@i18n/getValidatedLocale';
import { getSavedSchema } from '@/app/actions/schema';
import {
  parseAndValidate,
  DEFAULT_SCHEMA,
} from '@/components/swagger-editor/utils';
import SwaggerWrapper from '@/components/SwaggerWrapper';
import ServerErrorHandler from '@/components/error/ServerErrorHandler';
import { createClient } from '@utils/supabase/server';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(ensureLocale(locale));

  const { data: savedSchema, error } = await getSavedSchema();
  const initial = await parseAndValidate(
    savedSchema?.content ?? DEFAULT_SCHEMA,
    savedSchema?.format ?? 'yaml'
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <ServerErrorHandler error={error ?? ''}>
      <div
        data-fullscreen-page
        className="container flex flex-1 flex-col lg:min-h-0"
      >
        <SwaggerWrapper
          savedSchema={savedSchema ?? null}
          initialApi={initial.ok ? initial.api : null}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </ServerErrorHandler>
  );
}
