import { getTranslations, setRequestLocale } from "next-intl/server";
import { ensureLocale } from "@i18n/getValidatedLocale";
import SwaggerViewer from "@/components/swagger-viewer";
import TestSpec from "@/components/test-spec";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(ensureLocale(locale));
  const t = await getTranslations("home");

  const api = TestSpec();

  return (
    <div className="container flex flex-1 flex-col">
      <h1>{t("placeholder")}</h1>
      <SwaggerViewer api={api}/>
    </div>
  );
}
