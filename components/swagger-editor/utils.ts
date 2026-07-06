import * as yaml from 'js-yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPI } from 'openapi-types';
import type { ApiDocument } from '@/components/swagger-viewer/types';

export type Format = 'json' | 'yaml';

export const DEFAULT_SCHEMA = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API to get started
paths:
  /hello:
    get:
      summary: Say hello
      responses:
        '200':
          description: Successful response
`;

export function isValidJson(text: string): boolean {
  try {
    const parsed = JSON.parse(text);
    return parsed !== null && typeof parsed === 'object';
  } catch {
    return false;
  }
}

export function isValidYaml(text: string): boolean {
  try {
    const parsed = yaml.load(text);
    return parsed !== null && typeof parsed === 'object';
  } catch {
    return false;
  }
}

export function detectFormat(text: string): Format | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (isValidJson(trimmed)) return 'json';
  if (isValidYaml(trimmed)) return 'yaml';
  return null;
}

export function parseSchema(text: string, format: Format): unknown {
  return format === 'json' ? JSON.parse(text) : yaml.load(text);
}

export type ValidationResult =
  | { ok: true; api: ApiDocument }
  | { ok: false; error: string };

export async function parseAndValidate(
  text: string,
  format: Format
): Promise<ValidationResult> {
  try {
    const obj = parseSchema(text, format);

    if (!obj || typeof obj !== 'object') {
      throw new Error('Schema must be a JSON or YAML object');
    }

    await SwaggerParser.validate(structuredClone(obj) as OpenAPI.Document);
    return { ok: true, api: obj as ApiDocument };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Schema is invalid',
    };
  }
}