"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  type MarketingDashboardStore,
  type MarketingWeekEntry,
  newWeekEntry,
  effectiveTwitterCpc,
  totalWhopRevenue,
} from "@/lib/marketing-dashboard/types";
import {
  loadStore,
  saveStore,
  exportStoreJson,
  mergeImport,
} from "@/lib/marketing-dashboard/storage";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

/** Plain text field: no spinner arrows; clear fully while editing; commit on blur. */
function IntField({
  value,
  onCommit,
  className,
}: {
  value: number;
  onCommit: (n: number) => void;
  className?: string;
}) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={text}
      className={className}
      onFocus={() => {
        focused.current = true;
        setText(String(value));
      }}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        focused.current = false;
        const cleaned = text.replace(/,/g, "").trim();
        if (cleaned === "") {
          onCommit(0);
          setText("0");
          return;
        }
        const n = parseInt(cleaned, 10);
        const v = Number.isFinite(n) ? Math.max(0, n) : 0;
        onCommit(v);
        setText(String(v));
      }}
    />
  );
}

function DecField({
  value,
  onCommit,
  className,
  title,
}: {
  value: number;
  onCommit: (n: number) => void;
  className?: string;
  title?: string;
}) {
  const [text, setText] = useState(() =>
    value === 0 ? "" : String(value),
  );
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setText(value === 0 ? "" : String(value));
    }
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={text}
      className={className}
      title={title}
      onFocus={() => {
        focused.current = true;
        setText(value === 0 ? "" : String(value));
      }}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        focused.current = false;
        const cleaned = text.replace(/,/g, "").trim();
        if (cleaned === "" || cleaned === ".") {
          onCommit(0);
          setText("");
          return;
        }
        const n = parseFloat(cleaned);
        const v = Number.isFinite(n) ? Math.max(0, n) : 0;
        onCommit(v);
        setText(v === 0 ? "" : String(v));
      }}
    />
  );
}

export default function MarketingDashboardClient() {
  const [store, setStore] = useState<MarketingDashboardStore>({
    version: 1,
    weeks: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadStore();
    setStore(s);
    setSelectedId(s.weeks[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStore(store);
  }, [store, hydrated]);

  useEffect(() => {
    if (!selectedId || store.weeks.some((w) => w.id === selectedId)) return;
    setSelectedId(store.weeks[0]?.id ?? null);
  }, [store.weeks, selectedId]);

  const week = useMemo(
    () => store.weeks.find((w) => w.id === selectedId) ?? null,
    [store.weeks, selectedId],
  );

  const chartRows = useMemo(() => {
    const sorted = [...store.weeks].sort(
      (a, b) => a.weekStart.localeCompare(b.weekStart),
    );
    return sorted.map((w) => ({
      week: w.weekStart,
      spend: w.twitter.spend,
      revenue: totalWhopRevenue(w),
      sessions: w.ga.sessions,
      newUsers: w.ga.newUsers,
    }));
  }, [store.weeks]);

  const updateWeek = useCallback((id: string, fn: (w: MarketingWeekEntry) => MarketingWeekEntry) => {
    setStore((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => (w.id === id ? fn(w) : w)),
    }));
  }, []);

  function addWeek() {
    const d = new Date();
    const iso = d.toISOString().slice(0, 10);
    const entry = newWeekEntry(iso);
    setStore((prev) => ({
      ...prev,
      weeks: [entry, ...prev.weeks],
    }));
    setSelectedId(entry.id);
  }

  function removeWeek(id: string) {
    setStore((prev) => ({
      ...prev,
      weeks: prev.weeks.filter((w) => w.id !== id),
    }));
  }

  async function logout() {
    await fetch("/api/internal/marketing-dashboard/session", { method: "DELETE" });
    window.location.href = "/internal/marketing-dashboard/login";
  }

  function onExport() {
    const blob = new Blob([exportStoreJson(store)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sharpmoney-marketing-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(String(reader.result)) as MarketingDashboardStore;
        if (!incoming.weeks) throw new Error("Invalid file");
        setStore((prev) => mergeImport(prev, incoming));
      } catch {
        alert("Could not read JSON backup.");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <header className="border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-cyan font-semibold tracking-wider uppercase">
            Internal · not linked in nav
          </p>
          <h1 className="text-xl font-bold">Weekly marketing & revenue</h1>
          <p className="text-white/45 text-sm mt-1">
            Data stays in this browser unless you export JSON. Set{" "}
            <code className="text-white/70">MARKETING_DASHBOARD_SECRET</code>{" "}
            for login.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addWeek}
            className="px-4 py-2 rounded-lg bg-cyan text-black text-sm font-semibold hover:opacity-90"
          >
            + New week
          </button>
          <button
            type="button"
            onClick={onExport}
            className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/15"
          >
            Export JSON
          </button>
          <label className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/15 cursor-pointer">
            Import merge
            <input type="file" accept="application/json" className="hidden" onChange={onImportFile} />
          </label>
          <button
            type="button"
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-10">
        {chartRows.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Trends</h2>
            <div className="h-72 w-full border border-white/10 rounded-xl p-4 bg-[#0a0a0a]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "#111", border: "1px solid #333" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="spend" name="X spend" stroke="#00e5ff" strokeWidth={2} dot />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Whop revenue"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="GA sessions"
                    stroke="#888"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        <section className="flex flex-col md:flex-row gap-6">
          <div className="md:w-56 shrink-0 space-y-2">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">
              Weeks
      </h2>
            <ul className="space-y-1">
              {store.weeks.map((w) => (
                <li key={w.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(w.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      w.id === selectedId
                        ? "bg-cyan/15 border border-cyan/40 text-cyan"
                        : "bg-white/5 border border-transparent hover:bg-white/10"
                    }`}
                  >
                    {w.weekStart}
                  </button>
                </li>
              ))}
            </ul>
            {store.weeks.length === 0 && (
              <p className="text-white/40 text-sm">Add a week to start.</p>
            )}
          </div>

          {week && (
            <div className="flex-1 space-y-10">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-white/50">
                  Week start
                  <input
                    type="date"
                    value={week.weekStart}
                    onChange={(e) =>
                      updateWeek(week.id, (w) => ({
                        ...w,
                        weekStart: e.target.value,
                      }))
                    }
                    className="block mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeWeek(week.id)}
                  className="mt-6 text-sm text-red-400 hover:underline"
                >
                  Delete this week
                </button>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-3 text-cyan">X (Twitter) ads</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(
                    [
                      ["spend", "Weekly ad spend ($)"],
                      ["impressions", "Impressions"],
                      ["linkClicks", "Link clicks"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="text-sm text-white/50 block">
                      {label}
                      {key === "spend" ? (
                        <DecField
                          value={week.twitter.spend}
                          onCommit={(v) =>
                            updateWeek(week.id, (w) => ({
                              ...w,
                              twitter: { ...w.twitter, spend: v },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        />
                      ) : key === "impressions" ? (
                        <IntField
                          value={week.twitter.impressions}
                          onCommit={(v) =>
                            updateWeek(week.id, (w) => ({
                              ...w,
                              twitter: { ...w.twitter, impressions: v },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        />
                      ) : (
                        <IntField
                          value={week.twitter.linkClicks}
                          onCommit={(v) =>
                            updateWeek(week.id, (w) => ({
                              ...w,
                              twitter: { ...w.twitter, linkClicks: v },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        />
                      )}
                    </label>
                  ))}
                  <div className="text-sm text-white/50">
                    Cost / link click (auto)
                    <div className="mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm">
                      {formatMoney(effectiveTwitterCpc(week))}
                    </div>
                    <p className="text-white/35 text-xs mt-1">
                      Spend ÷ link clicks unless you add manual override later.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-3 text-cyan">
                  Whop tracking links
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/50 bg-white/5">
                        <th className="p-2">Name</th>
                        <th className="p-2">Clicks</th>
                        <th className="p-2">Revenue</th>
                        <th className="p-2">Converted</th>
                        <th className="p-2">Conv. rate</th>
                        <th className="p-2 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {week.whop.map((row, idx) => (
                        <tr key={idx} className="border-t border-white/5">
                          <td className="p-2">
                            <input
                              value={row.name}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateWeek(week.id, (w) => {
                                  const whop = [...w.whop];
                                  whop[idx] = { ...whop[idx], name: v };
                                  return { ...w, whop };
                                });
                              }}
                              placeholder="e.g. Website-Pro"
                              className="w-full min-w-[120px] px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <IntField
                              value={row.clicks}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const whop = [...w.whop];
                                  whop[idx] = { ...whop[idx], clicks: v };
                                  return { ...w, whop };
                                })
                              }
                              className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <DecField
                              value={row.revenue}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const whop = [...w.whop];
                                  whop[idx] = { ...whop[idx], revenue: v };
                                  return { ...w, whop };
                                })
                              }
                              className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <IntField
                              value={row.convertedUsers}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const whop = [...w.whop];
                                  whop[idx] = {
                                    ...whop[idx],
                                    convertedUsers: v,
                                  };
                                  return { ...w, whop };
                                })
                              }
                              className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <DecField
                              value={row.conversionRate}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const whop = [...w.whop];
                                  whop[idx] = {
                                    ...whop[idx],
                                    conversionRate: v,
                                  };
                                  return { ...w, whop };
                                })
                              }
                              className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10"
                              title="Decimal: 0.08 = 8%"
                            />
                          </td>
                          <td className="p-2">
                            <button
                              type="button"
                              className="text-red-400 text-xs"
                              onClick={() =>
                                updateWeek(week.id, (w) => ({
                                  ...w,
                                  whop: w.whop.filter((_, i) => i !== idx),
                                }))
                              }
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="mt-2 text-sm text-cyan hover:underline"
                  onClick={() =>
                    updateWeek(week.id, (w) => ({
                      ...w,
                      whop: [
                        ...w.whop,
                        {
                          name: "",
                          clicks: 0,
                          revenue: 0,
                          convertedUsers: 0,
                          conversionRate: 0,
                        },
                      ],
                    }))
                  }
                >
                  + Add Whop row
                </button>
                <p className="text-white/35 text-xs mt-2">
                  Conv. rate: enter decimal (0.08 = 8%). Total revenue this week:{" "}
                  <strong className="text-white">
                    {formatMoney(totalWhopRevenue(week))}
                  </strong>
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-3 text-cyan">
                  Google Analytics (totals)
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {(
                    [
                      ["newUsers", "New users"] as const,
                      ["sessions", "Sessions"] as const,
                      ["views", "Views (screen/page)"] as const,
                    ]
                  ).map(([k, label]) => (
                    <label key={k} className="text-sm text-white/50 block">
                      {label}
                      <IntField
                        value={week.ga[k]}
                        onCommit={(v) =>
                          updateWeek(week.id, (w) => ({
                            ...w,
                            ga: { ...w.ga, [k]: v },
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                      />
                    </label>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-white/70 mb-2">
                  By channel (or source / medium label)
                </h4>
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-white/5">
                        <th className="p-2">Channel</th>
                        <th className="p-2">New users</th>
                        <th className="p-2">Sessions</th>
                        <th className="p-2">Views</th>
                        <th className="p-2 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {week.ga.channels.map((row, idx) => (
                        <tr key={idx} className="border-t border-white/5">
                          <td className="p-2">
                            <input
                              value={row.channel}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateWeek(week.id, (w) => {
                                  const ch = [...w.ga.channels];
                                  ch[idx] = { ...ch[idx], channel: v };
                                  return {
                                    ...w,
                                    ga: { ...w.ga, channels: ch },
                                  };
                                });
                              }}
                              placeholder="e.g. X / Twitter"
                              className="w-full min-w-[140px] px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <IntField
                              value={row.newUsers}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const ch = [...w.ga.channels];
                                  ch[idx] = { ...ch[idx], newUsers: v };
                                  return { ...w, ga: { ...w.ga, channels: ch } };
                                })
                              }
                              className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <IntField
                              value={row.sessions}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const ch = [...w.ga.channels];
                                  ch[idx] = { ...ch[idx], sessions: v };
                                  return { ...w, ga: { ...w.ga, channels: ch } };
                                })
                              }
                              className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <IntField
                              value={row.views}
                              onCommit={(v) =>
                                updateWeek(week.id, (w) => {
                                  const ch = [...w.ga.channels];
                                  ch[idx] = { ...ch[idx], views: v };
                                  return { ...w, ga: { ...w.ga, channels: ch } };
                                })
                              }
                              className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10"
                            />
                          </td>
                          <td className="p-2">
                            <button
                              type="button"
                              className="text-red-400 text-xs"
                              onClick={() =>
                                updateWeek(week.id, (w) => ({
                                  ...w,
                                  ga: {
                                    ...w.ga,
                                    channels: w.ga.channels.filter(
                                      (_, i) => i !== idx,
                                    ),
                                  },
                                }))
                              }
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="mt-2 text-sm text-cyan hover:underline"
                  onClick={() =>
                    updateWeek(week.id, (w) => ({
                      ...w,
                      ga: {
                        ...w.ga,
                        channels: [
                          ...w.ga.channels,
                          {
                            channel: "",
                            newUsers: 0,
                            sessions: 0,
                            views: 0,
                          },
                        ],
                      },
                    }))
                  }
                >
                  + Add channel row
                </button>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-2 text-white/80">
                  Notes
                </h3>
                <textarea
                  value={week.notes}
                  onChange={(e) =>
                    updateWeek(week.id, (w) => ({
                      ...w,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Campaign names, anomalies, etc."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                />
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02] text-sm text-white/60 space-y-1">
                <p>
                  <strong className="text-white">ROAS (rough):</strong>{" "}
                  {week.twitter.spend > 0
                    ? (totalWhopRevenue(week) / week.twitter.spend).toFixed(2)
                    : "—"}{" "}
                  (Whop revenue ÷ X spend for this week)
                </p>
                <p>
                  CPC: {formatMoney(effectiveTwitterCpc(week))} · Revenue:{" "}
                  {formatMoney(totalWhopRevenue(week))} · Spend:{" "}
                  {formatMoney(week.twitter.spend)}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
