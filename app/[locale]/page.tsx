import { getTranslations, setRequestLocale } from "next-intl/server";
import { ensureLocale } from "@i18n/getValidatedLocale";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(ensureLocale(locale));
  const t = await getTranslations("home");

  return (
    <div className="container flex flex-1 flex-col">
      <h1>{t("placeholder")}</h1>
    </div>
  );
}
