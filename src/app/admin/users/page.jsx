"use client";

import React, { useMemo, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { adminApi } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { normalizePage } from "@/lib/pagination";
import { Users, ShieldCheck, User } from "lucide-react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
`;

/* ─── SKELETON ROW ───────────────────────────────────────────────────── */
function TableSkeleton() {
  return [1, 2, 3, 4, 5].map(i => (
    <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
      {[40, 140, 200, 90].map((w, j) => (
        <td key={j} style={td}>
          <div style={{
            width: w, height: 13, borderRadius: 3,
            background: "linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)",
            backgroundSize: "400px 100%",
            animation: "shimmer 1.4s ease-in-out infinite",
          }} />
        </td>
      ))}
    </tr>
  ));
}

/* ─── ROLE BADGE ─────────────────────────────────────────────────────── */
function RoleBadge({ role }) {
  const r = (role || "").toLowerCase();
  const isAdmin = r.includes("admin");
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: "2px",
      background: isAdmin ? "#111" : "#f5f5f5",
      color: isAdmin ? "#fff" : "#555",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.68rem", fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
    }}>
      {isAdmin ? <ShieldCheck size={10} /> : <User size={10} />}
      {role}
    </span>
  );
}

/* ─── USER ROW ───────────────────────────────────────────────────────── */
function UserRow({ u, isLast }) {
  const [hovered, setHovered] = useState(false);
  const initials = ((u.username || u.email || "?")[0]).toUpperCase();
  const roles = Array.isArray(u.roles)
    ? u.roles
    : typeof u.roles === "string"
    ? u.roles.split(",").map(r => r.trim())
    : typeof u.authorities === "string"
    ? u.authorities.split(",").map(r => r.trim())
    : ["User"];

  return (
    <tr
      style={{
        borderBottom: isLast ? "none" : "1px solid #f5f5f5",
        background: hovered ? "#fafafa" : "#fff",
        transition: "background 0.12s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ID */}
      <td style={td}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#bbb" }}>
          #{u.id}
        </span>
      </td>

      {/* Username */}
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#111", color: "#fff", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem",
          }}>
            {initials}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#111" }}>
            {u.username || "—"}
          </span>
        </div>
      </td>

      {/* Email */}
      <td style={td}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#666" }}>
          {u.email || "—"}
        </span>
      </td>

      {/* Roles */}
      <td style={td}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {roles.map((r, i) => <RoleBadge key={i} role={r} />)}
        </div>
      </td>
    </tr>
  );
}

const td = { padding: "13px 14px", verticalAlign: "middle" };

const paginationBtn = (disabled) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.75rem", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  padding: "10px 20px", borderRadius: "4px",
  border: "1.5px solid #111",
  background: disabled ? "#f5f5f5" : "#111",
  color: disabled ? "#bbb" : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  transition: "all 0.18s",
});

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [page, setPage] = useState(0);
  const size = 20;

  const usersQuery = useQuery({
    queryKey: ["adminUsers", { page, size }],
    enabled: Boolean(accessToken),
    queryFn: ({ signal }) => adminApi.getUsers({ token: accessToken, page, size }, signal),
  });

  const pageData = useMemo(
    () => normalizePage(usersQuery.data?.data ?? usersQuery.data),
    [usersQuery.data]
  );

  return (
    <RequireAdmin>
      <style>{globalStyles}</style>

      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>

          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
                letterSpacing: "0.18em", color: "#bbb",
                textTransform: "uppercase", margin: "0 0 6px",
              }}>
                Admin Panel
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                fontWeight: 800, color: "#111", margin: 0,
              }}>
                Users
              </h1>
            </div>

            {/* Total count chip */}
            {!usersQuery.isLoading && pageData.totalItems > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#fff", border: "1px solid #ebebeb",
                borderRadius: "4px", padding: "7px 14px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", fontWeight: 700, color: "#555",
              }}>
                <Users size={13} color="#aaa" />
                {pageData.totalItems} user{pageData.totalItems !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* ── ERROR ───────────────────────────────────────────────── */}
          {usersQuery.isError && (
            <div style={{
              marginBottom: 20, padding: "12px 16px",
              background: "#fff0f0", border: "1px solid #ffc9c9",
              borderRadius: "4px", borderLeft: "3px solid #e03131",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "#c92a2a",
            }}>
              Failed to load users.{" "}
              {usersQuery.error?.message && `(${usersQuery.error.message})`}
            </div>
          )}

          {/* ── TABLE CARD ──────────────────────────────────────────── */}
          <div style={{
            background: "#fff", border: "1px solid #e8e8e8",
            borderRadius: "6px", overflow: "hidden",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                    {["ID", "Username", "Email", "Roles"].map(h => (
                      <th key={h} style={{
                        padding: "11px 14px", textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.68rem", fontWeight: 700,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "#888", whiteSpace: "nowrap",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.isLoading ? (
                    <TableSkeleton />
                  ) : pageData.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{
                        padding: "60px 24px", textAlign: "center",
                        fontFamily: "'DM Sans', sans-serif", color: "#bbb", fontSize: "0.88rem",
                      }}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    pageData.items.map((u, i) => (
                      <UserRow
                        key={u.id}
                        u={u}
                        isLast={i === pageData.items.length - 1}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── PAGINATION ───────────────────────────────────────────── */}
          {pageData.totalPages > 1 && (
            <div style={{
              display: "flex", justifyContent: "center",
              alignItems: "center", gap: 12, marginTop: 20,
            }}>
              <button
                disabled={page <= 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                style={paginationBtn(page <= 0)}
              >
                ← Previous
              </button>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem", color: "#666",
              }}>
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                disabled={page + 1 >= pageData.totalPages}
                onClick={() => setPage(p => p + 1)}
                style={paginationBtn(page + 1 >= pageData.totalPages)}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </RequireAdmin>
  );
}