import * as yaml from 'js-yaml';

export type Format = 'json' | 'yaml';

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