'use client';

import { useState } from 'react';
import SwaggerEditor from '@/components/swagger-editor/SwaggerEditor';
import SwaggerViewer from '@/components/swagger-viewer';
import type { ApiDocument } from '@/components/swagger-viewer/types';
import type { Format } from '@/components/swagger-editor/utils';

type SavedSchema = {
  content: string;
  format: Format;
} | null;

export default function SwaggerWrapper({
  savedSchema,
  initialApi,
}: {
  savedSchema: SavedSchema;
  initialApi: ApiDocument | null;
}) {
  const [validatedApi, setValidatedApi] = useState<ApiDocument | null>(initialApi);

  return (
    <div className="flex lg:h-[80vh] flex-col gap-4 lg:flex-row">
      <SwaggerEditor
        savedSchema={savedSchema}
        onValidated={setValidatedApi}
        initialIsValid={initialApi !== null}
      />
      <div className="w-full h-full min-w-0 flex overflow-y-auto">
        {validatedApi ? (
          <SwaggerViewer api={validatedApi} />
        ) : (
          <p className="text-muted">
            Validate the schema in the editor to see its endpoints.
          </p>
        )}
      </div>
    </div>
  );
}
