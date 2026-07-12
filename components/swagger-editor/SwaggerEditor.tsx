'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as yaml from 'js-yaml';
import { useTranslations } from 'next-intl';
import {
  detectFormat,
  parseAndValidate,
  DEFAULT_SCHEMA,
  type Format,
} from './utils';
import { saveSchema } from '@/app/actions/schema';
import type { ApiDocument } from '@/components/swagger-viewer/types';

type SavedSchema = {
  content: string;
  format: Format;
} | null;

export default function SwaggerEditor({
  savedSchema,
  onValidated,
  onError,
  initialIsValid = false,
  isAuthenticated = false,
}: {
  savedSchema: SavedSchema;
  onValidated: (api: ApiDocument | null) => void;
  onError: (message: string) => void;
  initialIsValid?: boolean;
  isAuthenticated?: boolean;
}) {
  const t = useTranslations('editor');
  const [text, setText] = useState(savedSchema?.content ?? DEFAULT_SCHEMA);
  const [format, setFormat] = useState<Format>(savedSchema?.format ?? 'yaml');
  const [isValid, setIsValid] = useState<boolean>(initialIsValid);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const skipInitialValidation = useRef(initialIsValid);

  const resetValidation = useCallback(() => {
    setSaveMessage('');
    onError('');
    onValidated(null);
    setIsValid(false);
    setIsValidating(true);
  }, [onError, onValidated]);

  const handleChange = (value: string | undefined) => {
    setText(value ?? '');
    resetValidation();
  };

  const validateSchema = useCallback(
    async ({ text, format }: { text: string; format: Format }) => {
      resetValidation();

      const minDelay = new Promise((resolve) => setTimeout(resolve, 500));

      const [result] = await Promise.all([
        parseAndValidate(text, format),
        minDelay,
      ]);

      setIsValidating(false);

      if (!result.ok) {
        setIsValid(false);
        onError(result.error);
        return false;
      }

      setIsValid(true);
      onValidated(result.api);
      return true;
    },
    [resetValidation, onError, onValidated]
  );

  useEffect(() => {
    if (skipInitialValidation.current) {
      skipInitialValidation.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const detected = detectFormat(text) ?? format;
      setFormat(detected);
      validateSchema({ text, format: detected });
    }, 600);
    return () => clearTimeout(timer);
  }, [text, format, validateSchema]);

  const toggleFormat = () => {
    try {
      if (format === 'json') {
        const obj = JSON.parse(text);
        setText(yaml.dump(obj));
        setFormat('yaml');
      } else {
        const obj = yaml.load(text);
        setText(JSON.stringify(obj, null, 2));
        setFormat('json');
      }
      resetValidation();
    } catch (e) {
      setSaveMessage('');
      setIsValidating(false);
      setIsValid(false);
      onValidated(null);
      const message = e instanceof Error ? e.message : 'Schema is invalid';
      onError(t('cannotConvert', { message }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const isSchemaValid = await validateSchema({ text, format });
    if (!isSchemaValid) {
      setIsSaving(false);
      return;
    }
    const result = await saveSchema(text, format);

    if (result?.error) {
      onError(t('saveFailed'));
      setSaveMessage('');
      setIsSaving(false);
      return;
    }

    setSaveMessage(t('schemaSaved'));
    setIsSaving(false);
  };


  return (
    <div className="w-full min-w-0 flex h-[80vh] lg:h-full flex-col">
      <div className="mb-2 flex text-sm items-center flex-wrap gap-3">
        <button
          onClick={toggleFormat}
          className="cursor-pointer rounded border border-border px-3 py-1 transition-colors hover:bg-surface-muted"
        >
          {format === 'json' ? t('convertToYaml') : t('convertToJson')}
        </button>

        <button
          onClick={() => validateSchema({ text, format })}
          disabled={isValidating || !text.trim()}
          className="cursor-pointer rounded border border-border px-3 py-1 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isValidating ? t('validating') : t('validate')}
        </button>

        {isAuthenticated && (
          <button
            onClick={handleSave}
            className="cursor-pointer rounded border border-border px-3 py-1 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving || isValidating || !text.trim()}
          >
            {isSaving ? t('saving') : t('save')}
          </button>
        )}

        <span className="text-muted border-2 border-muted text-sm px-2 py-0.5 rounded-full">
          <b>{format.toUpperCase()}</b>
        </span>

        {isValidating ? (
          <div className="border-2 font-bold border-yellow-300 bg-yellow-300/30 text-yellow-700 text-sm px-2 py-0.5 rounded-full">
            {t('validating')}
          </div>
        ) : isValid ? (
          <div className="border-2 font-bold border-green-300 bg-green-300/30 text-green-700 text-sm px-2 py-0.5 rounded-full">
            {t('valid')}
          </div>
        ) : (
          <div className="border-2 font-bold border-red-300 bg-red-300/30 text-red-700 text-sm px-2 py-0.5 rounded-full">
            {t('invalid')}
          </div>
        )}
      </div>

      {saveMessage && (
        <span className="mb-2 rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
          {saveMessage}
        </span>
      )}

      <div className="flex-1 overflow-hidden rounded-lg border border-border">
        <Editor
          height="100%"
          language={format}
          value={text}
          onChange={handleChange}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}
