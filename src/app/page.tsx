"use client";

import { useState, useEffect } from "react";
import { Users, Shield, User, Plus, Search, ChevronDown, MoreVertical, Pencil, Trash2, Check } from "lucide-react";

// Types
type Role = "Admin" | "User";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

// Avatar color map
const avatarColors: Record<string, string> = {
  SC: "bg-red-300",
  MR: "bg-blue-300",
  AP: "bg-purple-300",
  JO: "bg-violet-300",
  LW: "bg-indigo-300",
};

const ITEMS_PER_PAGE = 5;

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(initials: string) {
  return avatarColors[initials] || "bg-gray-300";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// Toast
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 text-sm font-medium">
      <span className="bg-gray-700 rounded-full p-1"><Check size={14} /></span>
      {message}
    </div>
  );
}

// Add Member Modal
function AddMemberModal({ onClose, onAdd }: { onClose: () => void; onAdd: (u: Omit<UserType, "id" | "createdAt">) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function validate() {
    const e: { name?: string; email?: string } = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onAdd({ name, email, role });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-xl">
              <Users size={22} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">New Member</h2>
              <p className="text-gray-500 text-sm">Add a new member to your team</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5"><User size={14} /> Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 ${errors.name ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5">✉ Email</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 ${errors.email ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5"><Shield size={14} /> Role</label>
            <div className="relative">
              <select
                value={role} onChange={(e) => setRole(e.target.value as Role)}
                style={{ color: role === "User" ? "#6b7280" : "#111827" }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Add Member</button>
        </div>
      </div>
    </div>
  );
}

// Edit Member Modal
function EditMemberModal({ user, onClose, onSave }: { user: UserType; onClose: () => void; onSave: (u: UserType) => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<Role>(user.role);
  const initials = getInitials(user.name);

  function handleSave() {
    onSave({ ...user, name, email, role });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-xl">
              <Pencil size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">Edit Member</h2>
              <p className="text-gray-500 text-sm">Update team member details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">✕</button>
        </div>

        {/* User preview */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 ${getAvatarColor(initials)}`}>
            {initials}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5"><User size={14} /> Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-blue-400 rounded-xl px-4 py-2.5 text-sm outline-none ring-2 ring-blue-200"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5">✉ Email</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5"><Shield size={14} /> Role</label>
            <div className="relative">
              <select
                value={role} onChange={(e) => setRole(e.target.value as Role)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirm Modal
function DeleteModal({ user, onClose, onConfirm }: { user: UserType; onClose: () => void; onConfirm: () => void }) {
  const initials = getInitials(user.name);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-2xl">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#ef4444" strokeWidth="2" strokeLinecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          </div>
        </div>
        <h2 className="font-semibold text-gray-900 text-lg text-center mb-2">Remove team member</h2>
        <p className="text-gray-500 text-sm text-center mb-5">This will permanently remove this member and all their associated data. This action cannot be undone.</p>

        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-6">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700 ${getAvatarColor(initials)}`}>
            {initials}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition">Remove Member</button>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function DashboardPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All Roles" | Role>("All Roles");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserType | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "Admin").length;
  const totalMembers = users.filter((u) => u.role === "User").length;

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  async function handleAdd(data: Omit<UserType, "id" | "createdAt">) {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      await fetchUsers();
      setToast(`${data.name} has been added.`);
    } catch (error) {
      console.error("Failed to add user", error);
    }
  }

  async function handleEdit(updated: UserType) {
    try {
      const res = await fetch(`/api/users/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) return;
      await fetchUsers();
      setToast(`${updated.name}'s profile has been updated.`);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  }

  async function handleDelete(id: number) {
    const user = users.find((u) => u.id === id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      await fetchUsers();
      setDeleteUser(null);
      setToast(`${user?.name} has been removed.`);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-xl">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-500 text-sm">Manage your team and their account permissions.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-4xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-gray-500 text-sm mt-1">Total Users</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl"><Users size={22} className="text-blue-500" /></div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-4xl font-bold text-gray-900">{totalAdmins}</p>
            <p className="text-gray-500 text-sm mt-1">Admins</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-xl"><Shield size={22} className="text-yellow-500" /></div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-4xl font-bold text-gray-900">{totalMembers}</p>
            <p className="text-gray-500 text-sm mt-1">Members</p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl"><User size={22} className="text-green-500" /></div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white font-medium text-gray-700 min-w-[140px] justify-between"
          >
            <span className="flex items-center gap-1.5">⇅ {roleFilter}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {roleDropdownOpen && (
            <div className="absolute top-12 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 w-40 py-1">
              {(["All Roles", "Admin", "User"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRoleFilter(r); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  {roleFilter === r && <Check size={14} className="text-blue-600" />}
                  {roleFilter !== r && <span className="w-3.5" />}
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-visible">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Joined</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-sm">No members found</td></tr>
                ) : (
                  paginated.map((user) => {
                    const initials = getInitials(user.name);
                    return (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 ${getAvatarColor(initials)}`}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                              <p className="text-gray-500 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.role === "Admin" ? (
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                              <Shield size={12} /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                              <User size={12} /> User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="relative flex justify-end">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                              <MoreVertical size={16} className="text-gray-500" />
                            </button>
                            {openMenuId === user.id && (
                              <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 w-40">
                                <button
                                  onClick={() => { setEditUser(user); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Pencil size={14} /> Edit member
                                </button>
                                <button
                                  onClick={() => { setDeleteUser(user); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 size={14} /> Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} members
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm rounded-lg transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white font-semibold"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {editUser && <EditMemberModal user={editUser} onClose={() => setEditUser(null)} onSave={handleEdit} />}
      {deleteUser && <DeleteModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={() => handleDelete(deleteUser.id)} />}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}