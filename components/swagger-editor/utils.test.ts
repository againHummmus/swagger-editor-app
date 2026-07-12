import { describe, it, expect } from 'vitest';
import { isValidJson, isValidYaml, detectFormat } from './utils';

describe('isValidJson', () => {
  it('valid JSON object', () => {
    expect(isValidJson('{"key": "value"}')).toBe(true);
  });

  it('invalid JSON', () => {
    expect(isValidJson('{ "key": }')).toBe(false);
  });

  it('empty string', () => {
    expect(isValidJson('')).toBe(false);
  });

  it('simple text', () => {
    expect(isValidJson('just some text')).toBe(false);
  });
});

const yamlInvalid = `key: value: invalid: :`;

describe('isValidYaml', () => {
  it('valid YAML', () => {
    const yaml = `
openapi: 3.0.0
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
    expect(isValidYaml(yaml)).toBe(true);
  });

  it('returns false for bad YAML', () => {

    expect(isValidYaml(yamlInvalid)).toBe(false);
  });

  it('returns false for simple string', () => {
    expect(isValidYaml('yaml')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidYaml('')).toBe(false);
  });
});

describe('detectFormat', () => {
  it('detects JSON format', () => {
    expect(detectFormat('{"a": 1}')).toBe('json');
  });

  it('detects YAML format', () => {
    const yaml = `
openapi: 3.0.0
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
    expect(detectFormat(yaml)).toBe('yaml');
  });

  it('returns null for empty input', () => {
    expect(detectFormat('')).toBe(null);
  });

  it('returns null for invalid input', () => {
    expect(detectFormat(yamlInvalid)).toBe(null);
  });
});