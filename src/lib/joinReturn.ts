// ============================================================================
// Parse a /join/complete landing. Whop sends the finished Elements checkout to
// the configuration's redirect_url and appends its own query (receipt_id,
// payment_id, checkout_status, status, state_id). Same rules as the app's
// readCheckoutReturn (sharpmoney-whop-app src/lib/checkout.ts): the receipt is
// payment_id, else receipt_id; auto-enter needs an EXPLICIT success; known
// failure values are failed; anything else is unknown, never success.
// ============================================================================

export type JoinOutcome = 'success' | 'failed' | 'unknown';

export interface JoinReturn {
  /** The `pay_` id Whop appended (payment_id, else receipt_id); null when absent or malformed. */
  receiptId: string | null;
  outcome: JoinOutcome;
}

const RECEIPT_ID_PATTERN = /^pay_[A-Za-z0-9]{8,40}$/;

/** Whop outcome values that mean "not charged / not completed". Anything else that is not `success` is unknown. */
const FAILURE_STATUSES = new Set(['failed', 'failure', 'canceled', 'cancelled', 'declined', 'error', 'expired']);

export function isValidReceiptId(value: string | null | undefined): value is string {
  return typeof value === 'string' && RECEIPT_ID_PATTERN.test(value);
}

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function read(params: ParamSource, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

export function readJoinReturn(params: ParamSource): JoinReturn {
  const paymentId = read(params, 'payment_id');
  const receiptParam = read(params, 'receipt_id');
  const receiptId = isValidReceiptId(paymentId) ? paymentId : isValidReceiptId(receiptParam) ? receiptParam : null;
  const statuses = [read(params, 'checkout_status'), read(params, 'status')]
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .map((s) => s.toLowerCase());
  const failed = statuses.some((s) => FAILURE_STATUSES.has(s));
  if (failed) return { receiptId, outcome: 'failed' };
  // Auto-enter needs an EXPLICIT success. No status at all (for example a
  // 3DS return through the element's returnUrl) is unknown, not success.
  const success = statuses.length > 0 && statuses.every((s) => s === 'success');
  return { receiptId, outcome: success ? 'success' : 'unknown' };
}
