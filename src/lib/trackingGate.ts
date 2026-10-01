// ============================================================================
// Tracking gate: decides, in the visitor's browser, whether this page view may
// load GA, the Whop pixel, the Meta pixel, the X pixel, and SendX.
//
// The site is statically prerendered, so the decision cannot happen on the
// server. GATE_SCRIPT runs first (beforeInteractive) and sets
// window.__smTrack. Every pixel snippet in layout.tsx checks that flag before
// it defines its global (gtag / whop / fbq / twq), so on preview hosts,
// localhost, /internal pages, and automated browsers the globals stay
// undefined and JoinCoreEmbed's optional calls do nothing.
//
// GATE_SCRIPT is a plain-JS string so the exact shipped code is what the
// tests run (src/lib/trackingGate.test.ts).
// ============================================================================

export const TRACKED_HOSTS = ['www.betsharpmoney.com', 'betsharpmoney.com'];

export const UNTRACKED_PATH_PREFIXES = ['/internal'];

// Automated or headless browsers. Real visitors never match these.
export const BOT_UA_PATTERN =
  'bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|preview|prerender|phantom|selenium|puppeteer|playwright';

export const GA_ID_FOR_GATE = 'G-N8L0PFJG7E';

export const GATE_SCRIPT = `
(function (w) {
  var ok = false;
  try {
    var hosts = ${JSON.stringify(TRACKED_HOSTS)};
    var paths = ${JSON.stringify(UNTRACKED_PATH_PREFIXES)};
    var host = String(w.location.hostname || '').toLowerCase();
    var path = String(w.location.pathname || '/');
    var ua = String((w.navigator && w.navigator.userAgent) || '');
    var automated = !!(w.navigator && w.navigator.webdriver);
    ok = hosts.indexOf(host) !== -1 && !automated && !new RegExp(${JSON.stringify(BOT_UA_PATTERN)}, 'i').test(ua);
    for (var i = 0; ok && i < paths.length; i++) {
      if (path === paths[i] || path.indexOf(paths[i] + '/') === 0) ok = false;
    }
  } catch (e) {
    ok = false;
  }
  w.__smTrack = ok;
  if (!ok) w['ga-disable-${GA_ID_FOR_GATE}'] = true;
})(window);
`;
