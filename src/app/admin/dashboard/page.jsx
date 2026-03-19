"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ContactUsMsgs from "@/components/ContactUsMsgs";
import { useAuth } from "@/context/AuthContext";
import { adminApi } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import RequireAdmin from "@/components/RequireAdmin";
import {
  LineChart, Line, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
} from "recharts";
import {
  ShoppingCart, Users, DollarSign, Activity,
  Package, MessageSquare, RefreshCw,
  ArrowUpRight, LayoutDashboard, ChevronRight,
} from "lucide-react";

/* ─── GLOBAL STYLES ────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .stat-card {
    animation: fadeUp 0.4s ease both;
  }
  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.12s; }
  .stat-card:nth-child(3) { animation-delay: 0.19s; }

  .nav-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; border: 1.5px solid #ddd;
    color: #333; background: #fff;
    transition: border-color 0.18s, background 0.18s, color 0.18s;
    white-space: nowrap;
  }
  .nav-pill:hover {
    border-color: #111; background: #111; color: #fff;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 4px;
  }
`;

/* ─── MINI SPARKLINE TOOLTIP ───────────────────────────────────────── */
const SparkTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#111", color: "#fff", padding: "5px 10px",
      borderRadius: 4, fontSize: "0.72rem",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    }}>
      {payload[0].value}
    </div>
  );
};

/* ─── STAT CARD ────────────────────────────────────────────────────── */
function StatCard({ title, value, sub, icon: Icon, chartData, accent }) {
  const [hovered, setHovered] = useState(false);
  const color = accent || "#111";

  return (
    <div
      className="stat-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fafafa" : "#fff",
        border: `1.5px solid ${hovered ? "#111" : "#ebebeb"}`,
        borderRadius: 6, padding: "22px 22px 18px",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.08)" : "none",
        cursor: "default",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} color={color} />
        </div>
        <ArrowUpRight size={14} color="#ccc" />
      </div>

      {/* Value */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: 800, color: "#111", margin: "0 0 4px", lineHeight: 1,
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.72rem", fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#aaa", margin: "0 0 16px",
      }}>
        {title}
      </p>

      {/* Sparkline */}
      {Array.isArray(chartData) && chartData.length > 1 && (
        <div style={{ height: 44, marginLeft: -4, marginRight: -4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Tooltip content={<SparkTooltip />} cursor={false} />
              <Line
                type="monotone" dataKey="uv"
                stroke={color} strokeWidth={2}
                dot={false} activeDot={{ r: 3, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {sub && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#888", marginTop: 8 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── SKELETON STAT CARD ───────────────────────────────────────────── */
function StatCardSkeleton() {
  return (
    <div style={{ border: "1.5px solid #ebebeb", borderRadius: 6, padding: "22px 22px 18px", background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "50%" }} />
        <div className="skeleton" style={{ width: 14, height: 14 }} />
      </div>
      <div className="skeleton" style={{ width: "55%", height: 32, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: "40%", height: 11, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: "100%", height: 44 }} />
    </div>
  );
}

/* ─── SALES STATS HOOK ─────────────────────────────────────────────── */
function useSalesStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("murgan_access_token");
    import("@/lib/apiClient").then(({ adminApi }) => {
      adminApi.getSales(token)
        .then((res) => {
          setData([
            {
              title: "Total Revenue",
              value: `₹${(res.totalRevenue ?? 0).toLocaleString("en-IN")}`,
              icon: DollarSign,
              chartData: res.totalRevenueHistory || [],
              accent: "#2da44e",
            },
            {
              title: "Active Users",
              value: (res.activeUsers ?? 0).toLocaleString("en-IN"),
              icon: Users,
              chartData: res.activeUsersHistory || [],
              accent: "#4361ee",
            },
            {
              title: "Products Ordered",
              value: (res.productsOrdered ?? 0).toLocaleString("en-IN"),
              icon: ShoppingCart,
              chartData: res.productsOrderedHistory || [],
              accent: "#f0a500",
            },
          ]);
          setLoading(false);
        })
        .catch((err) => { setError(err); setLoading(false); });
    });
  }, []);

  return { data, loading, error };
}

/* ─── CONTACT MESSAGE ROW ──────────────────────────────────────────── */
function ContactRow({ msg, isLast }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "14px 0",
      borderBottom: isLast ? "none" : "1px solid #f5f5f5",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: "#111", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
        fontSize: "0.8rem", flexShrink: 0,
      }}>
        {(msg.name || msg.email || "?")[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.84rem", color: "#111", margin: 0 }}>
            {msg.name || "Anonymous"}
          </p>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#bbb" }}>
            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#888", margin: "0 0 5px" }}>
          {msg.email}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
          color: "#555", margin: 0, lineHeight: 1.5,
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {msg.message}
        </p>
      </div>
    </div>
  );
}

/* ─── DASHBOARD RAW JSON SECTION ───────────────────────────────────── */
function BackendCard({ dashboardQuery }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #ebebeb",
      borderRadius: 6, overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid #f0f0f0",
        background: "#fafafa",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#333" }}>
          Backend Response (live)
        </span>
        <button
          onClick={() => dashboardQuery.refetch()}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
            fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: 4,
            border: "1.5px solid #ddd", background: "#fff",
            color: "#555", cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </div>
      <div style={{ padding: "16px 20px" }}>
        {dashboardQuery.isLoading ? (
          <div className="skeleton" style={{ width: "100%", height: 80 }} />
        ) : dashboardQuery.isError ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#e03131" }}>
            Failed: {dashboardQuery.error?.message || "Error"}
          </p>
        ) : (
          <pre style={{
            fontFamily: "'DM Mono', 'Fira Code', monospace",
            fontSize: "0.72rem", color: "#555",
            background: "#fafafa", padding: "14px 16px",
            borderRadius: 4, overflowX: "auto",
            margin: 0, border: "1px solid #f0f0f0",
            lineHeight: 1.7,
          }}>
            {JSON.stringify(dashboardQuery.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ───────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const { data: stats, loading: statsLoading, error: statsError } = useSalesStats();

  const dashboardQuery = useQuery({
    queryKey: ["adminDashboard"],
    enabled: Boolean(accessToken),
    queryFn: ({ signal }) => adminApi.getDashboard(accessToken, signal),
  });

  const contactusQuery = useQuery({
    queryKey: ["adminContactUs"],
    enabled: Boolean(accessToken),
    queryFn: ({ signal }) => adminApi.getContactUs(accessToken, signal),
  });

  // Extract contact messages
  const contactMsgs = (() => {
    const raw = contactusQuery.data?.data ?? contactusQuery.data;
    return Array.isArray(raw) ? raw : [];
  })();

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <RequireAdmin>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>

          {/* ── PAGE HEADER ──────────────────────────────────────── */}
          <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
                letterSpacing: "0.18em", color: "#bbb",
                textTransform: "uppercase", margin: "0 0 6px",
              }}>
                {greeting} · Admin Panel
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.15,
              }}>
                Dashboard
              </h1>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem", color: "#aaa",
            }}>
              <LayoutDashboard size={13} />
              {now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* ── STAT CARDS ───────────────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16, marginBottom: 28,
          }}>
            {statsLoading
              ? [1, 2, 3].map(i => <StatCardSkeleton key={i} />)
              : statsError
                ? <div style={{ gridColumn: "1/-1", fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "#e03131", padding: "20px 0" }}>Failed to load analytics.</div>
                : stats.map(s => <StatCard key={s.title} {...s} />)
            }
          </div>

          {/* ── TWO-COL: QUICK NAV + CONTACT MESSAGES ────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16, marginBottom: 24,
          }}>

            {/* Quick Nav */}
            <div style={{
              background: "#fff", border: "1px solid #ebebeb",
              borderRadius: 6, overflow: "hidden",
            }}>
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid #f0f0f0",
                background: "#fafafa",
              }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#333", margin: 0 }}>
                  Quick Navigation
                </p>
              </div>
              <div style={{ padding: "10px 0" }}>
                {[
                  { href: "/admin/products", label: "Manage Products", icon: Package },
                  { href: "/admin/categories", label: "Manage Categories", icon: Activity },
                  { href: "/admin/users", label: "View Users", icon: Users },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "13px 20px",
                      textDecoration: "none", color: "inherit",
                      borderBottom: "1px solid #f5f5f5",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.84rem", fontWeight: 600, color: "#111",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "#f5f5f5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={13} color="#555" />
                      </div>
                      {label}
                    </div>
                    <ChevronRight size={14} color="#ccc" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Messages Preview */}
            <div style={{
              background: "#fff", border: "1px solid #ebebeb",
              borderRadius: 6, overflow: "hidden",
            }}>
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid #f0f0f0",
                background: "#fafafa",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MessageSquare size={14} color="#555" />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#333", margin: 0 }}>
                    Contact Messages
                  </p>
                </div>
                {contactMsgs.length > 0 && (
                  <span style={{
                    background: "#111", color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.68rem", fontWeight: 700,
                    padding: "2px 8px", borderRadius: 999,
                  }}>
                    {contactMsgs.length}
                  </span>
                )}
              </div>
              <div style={{ padding: "0 20px", maxHeight: 320, overflowY: "auto" }}>
                {contactusQuery.isLoading ? (
                  [1, 2].map(i => (
                    <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #f5f5f5", display: "flex", gap: 12 }}>
                      <div className="skeleton" style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ width: "60%", height: 12, marginBottom: 8 }} />
                        <div className="skeleton" style={{ width: "100%", height: 10 }} />
                      </div>
                    </div>
                  ))
                ) : contactMsgs.length === 0 ? (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#bbb", padding: "24px 0", textAlign: "center" }}>
                    No messages yet.
                  </p>
                ) : contactMsgs.slice(0, 5).map((msg, i) => (
                  <ContactRow key={msg.id ?? i} msg={msg} isLast={i === Math.min(contactMsgs.length, 5) - 1} />
                ))}
              </div>
              {contactMsgs.length > 5 && (
                <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#aaa" }}>
                    +{contactMsgs.length - 5} more messages
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── BACKEND RAW CARD ─────────────────────────────────── */}
          <BackendCard dashboardQuery={dashboardQuery} />

        </div>
      </div>
    </RequireAdmin>
  );
}