import { describe, it, expect } from 'vitest';
import { formatDate, formatTimeAgo } from '../format';

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

describe('formatTimeAgo', () => {
  const now = Date.parse('2026-01-02T12:00:00Z');

  it('1분 안이면 방금 전, 그다음은 분·시간·일 단위로 내림한다', () => {
    expect(formatTimeAgo('2026-01-02T11:59:30Z', now)).toBe('방금 전');
    expect(formatTimeAgo('2026-01-02T11:15:00Z', now)).toBe('45분 전');
    expect(formatTimeAgo('2026-01-02T09:30:00Z', now)).toBe('2시간 전');
    expect(formatTimeAgo('2025-12-30T12:00:00Z', now)).toBe('3일 전');
  });
});
