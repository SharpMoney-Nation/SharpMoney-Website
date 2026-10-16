'use client';

import { useEffect, useMemo, useRef } from 'react';
import { loadWhop } from '@whop/elements';
import { Checkout, CheckoutElement, WhopElements } from '@whop/elements-react';
import { parseFirstTouch } from '@/lib/firstTouch';
import { joinAttribution, joinMetadata } from '@/lib/joinMetadata';
import { CORE_AFFILIATE, JOIN_COMPLETE_PATH } from '@/lib/whop';

// ============================================================================
// The home-page join box on Whop Elements (plan: sharpmoney-whop-app
// tasks/plans/website-join-elements-plan.md, Phase 3). A copy of the app's
// src/app/signup/ElementsCheckout.tsx trimmed to the free Core plan.
//
// The full Checkout element opens its own session (no access token, no server
// confirm). Completion is a REDIRECT, never a callback: the checkout
// configuration's `redirect_url` sends the finished tab to /join/complete on
// this site (the element's `returnUrl` covers off-site steps like 3DS only).
// Fulfilment comes from Whop's webhooks into the app, as before.
//
// Every <Checkout> option is set at create and a changed option object is
// refused, so every object option below is memoized on a PRIMITIVE key
// (never on an object that the parent can re-create on a state change).
//
// loadWhop() HOLDS a failed load (one shared rejected promise, no self-retry);
// one automatic retry, then `disabled` (the parent shows the JOIN FREE link).
//
// This file is the ONLY importer of @whop/elements* (src/lib/legacyEmbedGone.test.ts)
// and is loaded with next/dynamic ssr:false by JoinCoreEmbed.
// ============================================================================

export interface JoinElementsBoxProps {
  /** The Whop checkout configuration (`ch_...`), validated by the parent. */
  configId: string;
  /** utm_* tags for this visit (URL first, else the first-touch cookie); undefined = none. */
  utm?: Record<string, string>;
  /** Primitive memo key for `utm`. */
  utmKey: string;
  /** The raw sm_ft cookie value (primitive memo key for the metadata). */
  firstTouchRaw: string;
  onStateChange: (state: 'loading' | 'ready' | 'disabled') => void;
}

const APPEARANCE = { theme: { appearance: 'dark' as const, accentColor: 'cyan' as const } };

export default function JoinElementsBox({ configId, utm, utmKey, firstTouchRaw, onStateChange }: JoinElementsBoxProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- utmKey is the primitive key for utm on purpose
  const attribution = useMemo(() => joinAttribution(utm), [utmKey]);
  const metadata = useMemo(() => joinMetadata(parseFirstTouch(firstTouchRaw)), [firstTouchRaw]);
  const returnUrl = useMemo(() => `${window.location.origin}${JOIN_COMPLETE_PATH}`, []);
  const elements = useMemo(() => loadWhop(), []);
  const retried = useRef(false);
  // Once this mount reports an error, a later loading-finished signal must not
  // hide the escape link; only the element's own onReady clears it.
  const errored = useRef(false);
  const report = (state: 'loading' | 'ready' | 'disabled') => {
    if (state === 'disabled') errored.current = true;
    if (errored.current && state !== 'disabled') return;
    onStateChange(state);
  };

  useEffect(() => {
    onStateChange('loading');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per mount on purpose
  }, []);

  return (
    <WhopElements
      elements={elements}
      environment="production"
      appearance={APPEARANCE}
      toasts={false}
      onLoadError={(_error, retry) => {
        if (!retried.current) {
          retried.current = true;
          retry();
          return;
        }
        report('disabled');
      }}
    >
      <Checkout
        key={configId}
        checkoutConfiguration={configId}
        affiliateCode={CORE_AFFILIATE}
        attribution={attribution}
        metadata={metadata}
        returnUrl={returnUrl}
        fallback={<div style={{ minHeight: 260, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading the join box&hellip;</div>}
        onLoadingChange={(loading) => report(loading ? 'loading' : 'ready')}
      >
        <CheckoutElement
          onReady={() => {
            errored.current = false;
            onStateChange('ready');
          }}
          onError={() => report('disabled')}
        />
      </Checkout>
    </WhopElements>
  );
}
