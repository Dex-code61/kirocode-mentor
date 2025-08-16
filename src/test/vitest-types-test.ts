/**
 * Simple test to verify Vitest types are working
 */

import { describe, test, expect, vi } from 'vitest';

describe('Vitest Types Test', () => {
  test('should have access to Vitest globals', () => {
    // Test that we can use Vitest functions
    expect(true).toBe(true);
    
    // Test that we can create mocks
    const mockFn = vi.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});

export {};