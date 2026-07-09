import { describe, expect, it } from 'vitest';
import {
  formatBytes,
  formatDuration,
  formatTimestamp,
  statusColor,
  statusBackground,
} from './utils';

describe('formatBytes', () => {
  it('returns a dash for null', () => {
    expect(formatBytes(null)).toBe('—');
  });

  it('appends the unit for a number', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(456)).toBe('456 B');
  });
});

describe('formatDuration', () => {
  it('returns a dash for null', () => {
    expect(formatDuration(null)).toBe('—');
  });

  it('appends the unit for a number', () => {
    expect(formatDuration(0)).toBe('0 ms');
    expect(formatDuration(123)).toBe('123 ms');
  });
});

describe('formatTimestamp', () => {
  it('formats an ISO string with a medium date and short time', () => {
    const iso = '2024-06-15T12:00:00.000Z';
    expect(formatTimestamp(iso, 'en')).toContain('2024');
  });
});

describe('statusColor', () => {
  it('is green for successful codes', () => {
    expect(statusColor(200)).toBe('text-green-700');
    expect(statusColor(399)).toBe('text-green-700');
  });

  it('is red for error codes and null', () => {
    expect(statusColor(400)).toBe('text-red-700');
    expect(statusColor(500)).toBe('text-red-700');
    expect(statusColor(null)).toBe('text-red-700');
  });
});

describe('statusBackground', () => {
  it('is green for successful codes', () => {
    expect(statusBackground(200)).toBe('bg-green-700');
    expect(statusBackground(399)).toBe('bg-green-700');
  });

  it('is red for error codes and null', () => {
    expect(statusBackground(400)).toBe('bg-red-700');
    expect(statusBackground(null)).toBe('bg-red-700');
  });
});
