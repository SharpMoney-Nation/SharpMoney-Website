// A temporary probe page to test our Whop connection.
// It calls Whop on the server (keeping the key private) and prints the raw response.

const WHOP_BASE = "https://api.whop.com";
const WHOP_ENDPOINT = "/api/v1/payments?company_id=biz_lbUgwQ0bQ8BxtD";


export const dynamic = "force-dynamic"; // always fetch fresh, never cache

async function callWhop() {
  const key = process.env.WHOP_API_KEY;
  if (!key) {
    return { status: 0, ok: false, body: "No WHOP_API_KEY found. Check .env.local and restart the server." };
  }
  try {
    const res = await fetch(`${WHOP_BASE}${WHOP_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const body = await res.text();
    return { status: res.status, ok: res.ok, body };
  } catch (err) {
    return { status: 0, ok: false, body: "Request failed: " + String(err) };
  }
}

export default async function WhopTestPage() {
  const result = await callWhop();
  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Whop API test</h1>
      <p>
        Endpoint called: <code>{WHOP_ENDPOINT}</code>
        <br />
        HTTP status: <strong>{result.status}</strong>{" "}
        {result.ok ? "✅ success" : "⚠️ not a success — read the response below"}
      </p>
      <pre style={{ background: "#111", color: "#3f3", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {result.body}
      </pre>
    </main>
  );
}
