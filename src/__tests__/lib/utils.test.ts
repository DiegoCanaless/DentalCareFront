import { formatPrice, formatDuration, toLocalDateString, getToday, getTomorrow, cn } from '@/lib/utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('formats price with dollar sign and decimals', () => {
      expect(formatPrice(100)).toBe('$100.00');
    });

    it('formats price with decimals', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
    });

    it('formats zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('formats large numbers', () => {
      expect(formatPrice(1000)).toBe('$1000.00');
    });
  });

  describe('formatDuration', () => {
    it('formats minutes with singular', () => {
      expect(formatDuration(1)).toBe('1 min');
    });

    it('formats minutes with plural', () => {
      expect(formatDuration(30)).toBe('30 min');
    });

    it('formats hour format for 60 minutes', () => {
      expect(formatDuration(60)).toBe('1h');
    });

    it('formats hour format for 90 minutes', () => {
      expect(formatDuration(90)).toBe('1h 30min');
    });

    it('formats hour format for 120 minutes', () => {
      expect(formatDuration(120)).toBe('2h');
    });
  });

  describe('toLocalDateString', () => {
    it('converts Date to local date string', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      const result = toLocalDateString(date);
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('handles different months', () => {
      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      months.forEach((month) => {
        const date = new Date(2024, month, 1);
        const result = toLocalDateString(date);
        expect(result).toMatch(/2024-\d{2}-01/);
      });
    });
  });

  describe('getToday', () => {
    it('returns today date', () => {
      const today = getToday();
      const now = new Date();
      expect(today.getFullYear()).toBe(now.getFullYear());
      expect(today.getMonth()).toBe(now.getMonth());
      expect(today.getDate()).toBe(now.getDate());
    });
  });

  describe('getTomorrow', () => {
    it('returns tomorrow date', () => {
      const tomorrow = getTomorrow();
      const today = getToday();
      const expectedTomorrow = new Date(today);
      expectedTomorrow.setDate(expectedTomorrow.getDate() + 1);

      expect(tomorrow.getDate()).toBe(expectedTomorrow.getDate());
    });
  });

  describe('cn', () => {
    it('joins class names', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('filters out falsy values', () => {
      const result = cn('class1', false && 'class2', null, 'class3', undefined && 'class4');
      expect(result).toBe('class1 class3');
    });

    it('handles conditional objects', () => {
      const result = cn('class1', { 'class2': true, 'class3': false });
      expect(result).toBe('class1 class2');
    });

    it('handles empty arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });
});