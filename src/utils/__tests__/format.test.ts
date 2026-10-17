import { describe, it, expect } from 'vitest';
import { formatDate } from '../format';

describe('formatDate', () => {
  it('formats a valid date string', () => {
    expect(formatDate('2024-03-15T10:30:00Z')).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });

  it('pads month and day with zeros', () => {
    // January 5 should be 01.05
    const result = formatDate('2024-01-05T00:00:00Z');
    expect(result).toMatch(/2024\.01\.0[45]/); // timezone may shift the day
  });
});
