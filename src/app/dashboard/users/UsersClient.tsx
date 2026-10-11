"use client";

import { useState, useMemo } from "react";
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  // Form states for creating new user
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"SUPER_ADMIN" | "CUSTOMER">("CUSTOMER");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
          name: newName.trim(),
          email: newEmail.trim().toLowerCase(),
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
      showToast("User account successfully created.");
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!isSuperAdmin) return;
    if (id === currentUserId) {
      alert("You cannot delete your own active account.");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete user "${name}"? This action cannot be undone.`)) {
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
      showToast(`User "${name}" has been deleted.`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return list;
  }, [users, searchQuery, sortAsc]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="users-management-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="inquiry-toast-popup">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row matching attached image */}
      <div className="users-page-header">
        <div>
          <h1 className="users-main-title">User Access Management</h1>
          <p className="users-sub-title">
            Manage portal operators, Super Admins, and Customer/Viewer role permissions.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => {
              setFormError("");
              setShowAddModal(true);
            }}
            className="btn-add-new-user"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New User</span>
          </button>
        )}
      </div>

      {/* Search Input and Count Card */}
      <div className="users-search-card">
        <div className="users-search-input-wrapper">
          <svg
            className="search-mag-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="users-search-field"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="users-total-count">
          {filteredUsers.length} total user{filteredUsers.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Main Users Table Card */}
      <div className="users-table-card">
        <div className="users-table-scroller">
          <table className="users-custom-table">
            <thead>
              <tr>
                <th className="th-user">User</th>
                <th className="th-role">Role</th>
                <th className="th-permissions">Permissions</th>
                <th
                  className="th-created sortable"
                  onClick={() => setSortAsc(!sortAsc)}
                  title="Click to sort by date"
                >
                  <div className="th-sort-flex">
                    <span>Created</span>
                    <span className="sort-arrows">⇅</span>
                  </div>
                </th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="users-empty-cell">
                    <div className="users-empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <h3>No users found</h3>
                      <p>No user accounts matched your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUserId;
                  const isSuper = u.role === "SUPER_ADMIN";
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : "U";

                  return (
                    <tr key={u.id} className="user-table-row">
                      {/* 1. User Column with Circle Avatar */}
                      <td className="td-user">
                        <div className="user-avatar-flex">
                          <div
                            className={`user-avatar-circle ${
                              isSuper ? "avatar-super" : "avatar-viewer"
                            }`}
                          >
                            {initial}
                          </div>
                          <div className="user-text-info">
                            <div className="user-name-line">
                              <span className="user-display-name">{u.name}</span>
                              {isCurrent && <span className="user-you-tag">(You)</span>}
                            </div>
                            <div className="user-email-text">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Role Column */}
                      <td className="td-role">
                        {isSuper ? (
                          <div className="role-pill role-super-admin">
                            <span className="role-icon-crown">👑</span>
                            <span>SUPER ADMIN</span>
                          </div>
                        ) : (
                          <div className="role-pill role-customer-viewer">
                            <svg className="role-icon-user" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <span>CUSTOMER / VIEWER</span>
                          </div>
                        )}
                      </td>

                      {/* 3. Permissions Column */}
                      <td className="td-permissions">
                        <span className="permission-text">
                          {isSuper
                            ? "Full CRUD (Manage services, RFQs, users)"
                            : "Read-only access (View services & RFQs)"}
                        </span>
                      </td>

                      {/* 4. Created Date Column */}
                      <td className="td-created">
                        <span className="created-date-text">{formatDate(u.createdAt)}</span>
                      </td>

                      {/* 5. Action Column */}
                      <td className="td-action">
                        {isCurrent ? (
                          <div className="active-session-pill">
                            <span className="active-dot" />
                            <span>Active Session</span>
                          </div>
                        ) : isSuperAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={deleteId === u.id}
                            className="btn-delete-user"
                            title="Delete this user"
                          >
                            <svg
                              className="trash-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        ) : (
                          <span className="read-only-badge">Protected</span>
                        )}
                      </td>
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
        <div className="inquiry-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-user-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="inquiry-modal-header">
              <div>
                <div className="modal-kicker">PORTAL OPERATOR ACCESS</div>
                <h2 className="modal-title">Create New User Account</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="add-user-form">
              {formError && (
                <div className="modal-form-error">
                  {formError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@britishmerchants.com"
                  className="form-input"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role & Permissions *</label>
                <div className="role-selection-grid">
                  <label
                    className={`role-choice-card ${
                      newRole === "CUSTOMER" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="CUSTOMER"
                      checked={newRole === "CUSTOMER"}
                      onChange={() => setNewRole("CUSTOMER")}
                      className="sr-only"
                    />
                    <div className="role-choice-header">
                      <span className="role-choice-icon">👤</span>
                      <span className="role-choice-title">Customer / Viewer</span>
                    </div>
                    <p className="role-choice-desc">
                      Read-only access to view catalog commodities and submitted trade RFQs.
                    </p>
                  </label>

                  <label
                    className={`role-choice-card ${
                      newRole === "SUPER_ADMIN" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="SUPER_ADMIN"
                      checked={newRole === "SUPER_ADMIN"}
                      onChange={() => setNewRole("SUPER_ADMIN")}
                      className="sr-only"
                    />
                    <div className="role-choice-header">
                      <span className="role-choice-icon">👑</span>
                      <span className="role-choice-title">Super Admin</span>
                    </div>
                    <p className="role-choice-desc">
                      Full administrative access to manage services, publish updates, handle RFQs, and manage users.
                    </p>
                  </label>
                </div>
              </div>

              <div className="inquiry-modal-footer">
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setShowAddModal(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-primary"
                  disabled={formLoading}
                >
                  {formLoading ? "Creating..." : "Create User Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
