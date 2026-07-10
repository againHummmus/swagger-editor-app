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
    <div className="flex flex-col gap-4 lg:min-h-0 lg:flex-1 lg:flex-row">
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
          <div className="w-full py-10">
            <div className="relative w-full whitespace-pre-wrap rounded-lg border border-dashed border-red-300 bg-red-50/40 px-3 py-2 text-red-700">
              {errorMessage}
              <div className="absolute top-2 right-2 text-xl font-bold rounded-full border border-red-300 text-red-700 bg-red-50/50 w-8 h-8 flex items-center justify-center">
                !
              </div>
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
