'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as yaml from 'js-yaml';
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
  initialIsValid = false,
}: {
  savedSchema: SavedSchema;
  onValidated: (api: ApiDocument | null) => void;
  initialIsValid?: boolean;
}) {

  const [text, setText] = useState(savedSchema?.content ?? DEFAULT_SCHEMA);
  const [format, setFormat] = useState<Format>(savedSchema?.format ?? 'yaml');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(initialIsValid);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleChange = (value: string | undefined) => {
    const newText = value ?? '';
    setText(newText);
    setSaveMessage('');
    setErrorMessage('');
    setIsValid(false);
    onValidated(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const detected = detectFormat(text);
      if (detected) {
        setFormat((prev) => (prev === detected ? prev : detected));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [text]);

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
      setSaveMessage('');
      setIsValid(false);
      setErrorMessage('');
      onValidated(null);
    } catch (e) {
      setSaveMessage('');
      setIsValid(false);
      onValidated(null);
      const message = e instanceof Error ? e.message : 'Schema is invalid';
      setErrorMessage(`Cannot convert: ${message}`);
    }
  };

  const validateSchema = async () => {
    setIsValidating(true);
    setErrorMessage('');
    setSaveMessage('');
    setIsValid(false);
    onValidated(null);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 500));

    const [result] = await Promise.all([
      parseAndValidate(text, format),
      minDelay,
    ]);

    setIsValidating(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return false;
    }

    setIsValid(true);
    onValidated(result.api);
    return true;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const isSchemaValid = await validateSchema();
    if (!isSchemaValid) {
      setIsSaving(false);
      return
    };
    const result = await saveSchema(text, format);

    if (result?.error) {
      setErrorMessage('Failed to save schema');
      setSaveMessage('');
      setIsSaving(false);
      return;
    }

    setSaveMessage('Schema saved');
    setIsSaving(false);
  };


  return (
    <div className="w-full min-w-0 flex h-[80vh] lg:h-full flex-col">
      <div className="mb-2 flex items-center gap-3">
        <button
          onClick={toggleFormat}
          className="cursor-pointer rounded border border-border px-3 py-1 transition-colors hover:bg-surface-muted"
        >
          Convert to {format === 'json' ? 'YAML' : 'JSON'}
        </button>

        <button
          onClick={validateSchema}
          disabled={isValidating || !text.trim()}
          className="cursor-pointer rounded border border-border px-3 py-1 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Validate'}
        </button>

        <button
          onClick={handleSave}
          className="cursor-pointer rounded border border-border px-3 py-1 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving || isValidating || !text.trim()}
        >
          {isSaving ? 'Saving....' : 'Save'}
        </button>

        <span className="text-muted">
          Current format: <b>{format.toUpperCase()}</b>
        </span>
      </div>

      {saveMessage && 
       <span className="mb-2 rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
        {saveMessage}
      </span>}


      {errorMessage && (
        <div className="mb-2 whitespace-pre-wrap rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700">
          {errorMessage}
        </div>
      )}

      {!saveMessage && isValid && (
        <div className="mb-2 rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
          Schema is valid
        </div>
      )}

      <div className="flex-1 overflow-hidden rounded border border-border">
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