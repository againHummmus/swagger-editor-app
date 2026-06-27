import { getTranslations, setRequestLocale } from "next-intl/server";
import { ensureLocale } from "@/i18n/getValidatedLocale";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(ensureLocale(locale));
  const t = await getTranslations("signUp");

  return (
    <div className="container flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full h-125 max-w-sm rounded-xl border border-border bg-surface p-6">
        <h1>{t("title")}</h1>
      </div>
    </div>
  );
}
