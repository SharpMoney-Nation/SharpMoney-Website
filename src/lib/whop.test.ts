import { describe, expect, it } from 'vitest';
import {
  CORE_AFFILIATE,
  CORE_PLAN_ID,
  JOIN_CHECKOUT_CONFIG,
  JOIN_CHECKOUT_CONFIG_DEFAULT,
  JOIN_COMPLETE_PATH,
  joinBoxEnabled,
} from './whop';

// The built-in configuration id is what the deploy carries (no hosting
// setting). These pin the facts the live box depends on.
describe('join box constants', () => {
  it('ships a valid built-in checkout configuration id', () => {
    expect(JOIN_CHECKOUT_CONFIG_DEFAULT).toBe('ch_OIp7WFXpcc0ilrj');
    expect(joinBoxEnabled(true, JOIN_CHECKOUT_CONFIG_DEFAULT)).toBe(true);
  });

  it('uses the built-in id when no override is set (the test env sets none)', () => {
    expect(JOIN_CHECKOUT_CONFIG).toBe(JOIN_CHECKOUT_CONFIG_DEFAULT);
    expect(joinBoxEnabled()).toBe(true);
  });

  it('hides the box when the lever is off or the id is not a ch_ id', () => {
    expect(joinBoxEnabled(false, JOIN_CHECKOUT_CONFIG_DEFAULT)).toBe(false);
    expect(joinBoxEnabled(true, '')).toBe(false);
    expect(joinBoxEnabled(true, 'plan_q2zQ6EHBluewl')).toBe(false);
    expect(joinBoxEnabled(true, 'ch_')).toBe(false);
  });

  it('keeps the plan, affiliate and completion path fixed', () => {
    expect(CORE_PLAN_ID).toBe('plan_q2zQ6EHBluewl');
    expect(CORE_AFFILIATE).toBe('websitecore');
    expect(JOIN_COMPLETE_PATH).toBe('/join/complete');
  });
});
