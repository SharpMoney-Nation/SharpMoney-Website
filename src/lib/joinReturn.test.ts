import { describe, expect, it } from 'vitest';
import { isValidReceiptId, readJoinReturn } from './joinReturn';

describe('readJoinReturn', () => {
  it('success with both ids: payment_id wins as the receipt', () => {
    const r = readJoinReturn(new URLSearchParams('receipt_id=pay_receipt0001&payment_id=pay_payment0001&checkout_status=success&status=success&state_id=chs_1'));
    expect(r).toEqual({ receiptId: 'pay_payment0001', outcome: 'success' });
  });
  it('receipt_id alone is accepted', () => {
    expect(readJoinReturn({ receipt_id: 'pay_abcdefgh', checkout_status: 'success' })).toEqual({ receiptId: 'pay_abcdefgh', outcome: 'success' });
  });
  it.each(['failed', 'failure', 'canceled', 'cancelled', 'declined', 'error', 'expired', 'FAILED'])('%s is failed', (s) => {
    expect(readJoinReturn({ checkout_status: s, payment_id: 'pay_abcdefgh' }).outcome).toBe('failed');
  });
  it('no status at all is unknown, never success', () => {
    expect(readJoinReturn({ payment_id: 'pay_abcdefgh' }).outcome).toBe('unknown');
    expect(readJoinReturn(new URLSearchParams('')).outcome).toBe('unknown');
  });
  it('an unrecognized status is unknown, and a mixed status is unknown', () => {
    expect(readJoinReturn({ checkout_status: 'processing' }).outcome).toBe('unknown');
    expect(readJoinReturn({ checkout_status: 'success', status: 'pending' }).outcome).toBe('unknown');
  });
  it('a failure beats a success value', () => {
    expect(readJoinReturn({ checkout_status: 'success', status: 'failed' }).outcome).toBe('failed');
  });
  it('malformed ids are rejected', () => {
    expect(readJoinReturn({ payment_id: 'pay_short', receipt_id: 'nope', checkout_status: 'success' }).receiptId).toBeNull();
    expect(isValidReceiptId('pay_abcdefgh')).toBe(true);
    expect(isValidReceiptId('pay_abc')).toBe(false);
    expect(isValidReceiptId('mem_abcdefghij')).toBe(false);
    expect(isValidReceiptId(undefined)).toBe(false);
  });
  it('array values take the first entry', () => {
    expect(readJoinReturn({ payment_id: ['pay_abcdefgh', 'pay_zzzzzzzz'], checkout_status: ['success'] })).toEqual({ receiptId: 'pay_abcdefgh', outcome: 'success' });
  });
});
