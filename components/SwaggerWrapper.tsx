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
  const [errorMessage, setErrorMessage] = useState<string>('');

  return (
    <div className="flex lg:h-[80vh] flex-col gap-4 lg:flex-row">
      <SwaggerEditor
        savedSchema={savedSchema}
        onValidated={setValidatedApi}
        onError={setErrorMessage}
        initialIsValid={initialApi !== null}
      />
      <div className="w-full h-full min-w-0 flex overflow-y-auto">
        {validatedApi ? (
          <SwaggerViewer api={validatedApi} />
        ) : errorMessage ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="max-w-full whitespace-pre-wrap rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700">
              {errorMessage}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div data-testid="loader" className="w-10 h-10 rounded-full border-2 border-border border-l-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
