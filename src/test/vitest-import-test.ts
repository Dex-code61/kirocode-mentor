/**
 * Simple test to verify Vitest imports work
 */

import { describe, test, expect } from 'vitest';

describe('Vitest Import Test', () => {
  test('should import Vitest functions correctly', () => {
    expect(typeof describe).toBe('function');
    expect(typeof test).toBe('function');
    expect(typeof expect).toBe('function');
  });

  test('basic assertion should work', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
  });
});