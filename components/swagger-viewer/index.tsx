'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { ApiDocument } from './types';
import { getEndpointGroups, getBaseUrl } from './utils';
import EndpointRow from './Endpoint';

export default function SwaggerViewer({ api }: { api: ApiDocument }) {
  const t = useTranslations('viewer');
  const baseUrl = useMemo(() => getBaseUrl(api), [api]);
  const groups = useMemo(() => getEndpointGroups(api), [api]);

  if (groups.length === 0) {
    return <p className="text-muted">{t('noEndpoints')}</p>;
  }

  return (
    <div className="flex w-full lg:overflow-auto flex-col gap-6">
      {groups.map(([path, operations]) => (
        <section key={path} className="flex flex-col gap-5">
          <h2 className="border-b border-border px-4 py-2 font-mono text-sm">
            {path}
          </h2>
          <ul className="flex flex-col gap-2">
            {operations.map((endpoint) => (
              <EndpointRow
                key={endpoint.method + path}
                endpoint={endpoint}
                baseUrl={baseUrl}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
