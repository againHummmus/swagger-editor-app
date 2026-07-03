import SwaggerEditor from '@/components/swagger-editor/SwaggerEditor';
import SwaggerViewer from '@/components/swagger-viewer/SwaggerViewer';
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
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex-1 min-w-0">
            <SwaggerEditor />
          </div>
          <div className="flex-1 min-w-0">
            <SwaggerViewer />
          </div>
        </div>
    </div>
  );
}
