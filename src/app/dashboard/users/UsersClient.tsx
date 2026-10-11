"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "CUSTOMER";
  createdAt: string;
}

export default function UsersClient({
  initialUsers,
  currentUserId,
  isSuperAdmin,
}: {
  initialUsers: UserItem[];
  currentUserId?: string;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states for creating new user
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"SUPER_ADMIN" | "CUSTOMER">("CUSTOMER");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setFormLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setUsers((prev) => [data.user, ...prev]);
      setShowAddModal(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("CUSTOMER");
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!isSuperAdmin) return;
    if (id === currentUserId) {
      alert("You cannot delete your own active account.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setDeleteId(id);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            User Access Management
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0 0",
              color: "#64748B",
              fontSize: "0.875rem",
            }}
          >
            Manage portal operators, Super Admins, and Customer/Viewer role permissions.
          </p>
        </div>

        {isSuperAdmin ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="eezzy-btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span>+</span> Add New User
          </button>
        ) : (
          <span
            style={{
              padding: "0.4rem 0.875rem",
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              color: "#475569",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            👁️ Read-Only Viewer Access
          </span>
        )}
      </div>

      {/* Search and Filters */}
      <div
        className="eezzy-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "360px" }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 0.875rem 0.5rem 2.25rem",
              fontSize: "0.875rem",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              outline: "none",
              backgroundColor: "#F8FAFC",
            }}
          />
          <svg
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "#94A3B8",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div style={{ fontSize: "0.875rem", color: "#64748B", fontWeight: 600 }}>
          {filteredUsers.length} total user{filteredUsers.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Users Table */}
      <div className="eezzy-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="eezzy-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Created</th>
                {isSuperAdmin && <th style={{ textAlign: "right" }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUserId;
                  const isSuper = u.role === "SUPER_ADMIN";

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: isSuper ? "#0F766E" : "#475569",
                              color: "#FFFFFF",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.9375rem" }}>
                              {u.name} {isCurrent && <span style={{ color: "#0F766E", fontSize: "0.75rem" }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "0.3rem 0.65rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            background: isSuper ? "#F0FDF4" : "#F1F5F9",
                            color: isSuper ? "#15803D" : "#475569",
                            border: isSuper ? "1px solid #BBF7D0" : "1px solid #CBD5E1",
                            display: "inline-block",
                          }}
                        >
                          {isSuper ? "👑 SUPER ADMIN" : "👤 CUSTOMER / VIEWER"}
                        </span>
                      </td>

                      <td style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                        {isSuper
                          ? "Full CRUD (Manage services, RFQs, users)"
                          : "Read-only access (View services & RFQs)"}
                      </td>

                      <td style={{ fontSize: "0.8125rem", color: "#64748B", whiteSpace: "nowrap" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {isSuperAdmin && (
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          {!isCurrent ? (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={deleteId === u.id}
                              style={{
                                padding: "0.35rem 0.65rem",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                background: "#FEF2F2",
                                color: "#DC2626",
                                border: "1px solid #FECACA",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                              title="Delete User"
                            >
                              Delete
                            </button>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Active Session</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="eezzy-card"
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              padding: "1.75rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Create New Portal User
                </h2>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748B" }}>
                  Grant Super Admin or Viewer role access.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#991B1B",
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jdoe@britishmerchants.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                  Role & Permissions
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    outline: "none",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="CUSTOMER">CUSTOMER / VIEWER (Read-Only access)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Administrative Control)</option>
                </select>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>
                  Both roles log into the portal via the same /login endpoint.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                  borderTop: "1px solid #E2E8F0",
                  paddingTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "0.6rem 1rem",
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="eezzy-btn-primary"
                  style={{
                    padding: "0.6rem 1.25rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {formLoading ? "Creating..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
