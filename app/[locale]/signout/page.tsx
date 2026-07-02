import { setRequestLocale } from "next-intl/server";
import { redirect } from "@i18n/navigation";
import { ensureLocale } from "@i18n/getValidatedLocale";
import { createClient } from "@utils/supabase/server";

export default async function SignOutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(ensureLocale(locale));

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect({ href: "/", locale: ensureLocale(locale) });
}
