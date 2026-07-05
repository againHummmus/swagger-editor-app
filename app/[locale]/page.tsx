import { getTranslations, setRequestLocale } from "next-intl/server";
import SwaggerParser from "@apidevtools/swagger-parser";
import { ensureLocale } from "@i18n/getValidatedLocale";
import SwaggerViewer from "@/components/swagger-viewer";
import TestSpec from "@/components/test-spec";
import type { ApiDocument } from "@/components/swagger-viewer/types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(ensureLocale(locale));
  const t = await getTranslations("home");

  const api = (await SwaggerParser.dereference(TestSpec() as never)) as ApiDocument;

  return (
    <div className="container flex flex-1 flex-col">
      <h1>{t("placeholder")}</h1>
      <SwaggerViewer api={api}/>
    </div>
  );
}
