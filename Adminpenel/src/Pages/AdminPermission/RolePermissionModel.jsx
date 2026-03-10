import axios from "axios";
import React, { useEffect } from "react";
import Swal from "sweetalert2";

const createDefaultPermissions = (modules) => {
    const perms = {};
    modules.forEach((m) => {
        perms[m.key] = {
            read: false,
            write: false,
            update: false,
            delete: false,
        };
    });
    return perms;
};

function RolePermissionModel({
    showRoleModal,
    setShowRoleModal,
    fetchRoles,
    editingRole,
    setEditingRole,
    roleForm,
    setRoleForm,
    modules = [],
}) {
    /* ================= BODY SCROLL LOCK ================= */
    useEffect(() => {
        if (showRoleModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showRoleModal]);

    /* ================= SAFE PERMISSION UPDATE ================= */
    const updatePermission = (module, permission, value) => {
        setRoleForm((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: {
                    ...(prev.permissions?.[module] || {}),
                    [permission]: value,
                },
            },
        }));
    };

    /* ================= SAVE ROLE ================= */
    const handleSaveRole = async () => {
        try {
            let response;

            if (editingRole) {
                response = await axios.put(
                    `https://api.cakenpetals.com/api/update-roles-by-admin/${editingRole?._id}`,
                    roleForm
                );
            } else {
                response = await axios.post(
                    "https://api.cakenpetals.com/api/create-roles-by-admin",
                    roleForm
                );
            }

            if (response?.status === 200 || response?.status === 201) {
                fetchRoles?.();

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response?.data?.message || "Role saved successfully",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setRoleForm({
                    name: "",
                    description: "",
                    permissions: createDefaultPermissions(modules),
                });

                setEditingRole(null);
                setShowRoleModal(false);
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to save role", "error");
        }
    };

    console.log("roleForm=>", roleForm)
    /* ================= HIDE ================= */
    if (!showRoleModal) return null;

    /* ================= UI ================= */
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
            onClick={() => setShowRoleModal(false)}
        >
            {/* ===== MODAL ===== */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ background: "#fff", width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", borderRadius: 12, padding: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.25)", }}
            >
                {/* ===== HEADER ===== */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    <h4 style={{ margin: 0, fontWeight: 600 }}>
                        {editingRole ? "Edit Permissions" : "Create New Permissions"}
                    </h4>

                    <button
                        onClick={() => setShowRoleModal(false)}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: 20,
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* ===== FORM ===== */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <input
                            type="text"
                            placeholder="Role Name"
                            value={roleForm?.role || ""}
                            onChange={(e) =>
                                setRoleForm((p) => ({ ...p, role: e.target.value }))
                            }
                            disabled
                            className="form-control"
                        />
                    </div>
                </div>

                {/* ===== PERMISSIONS ===== */}
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Module</th>
                                <th className="text-center">Read</th>
                                <th className="text-center">Write</th>
                                <th className="text-center">Update</th>
                                <th className="text-center">Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {modules.map((module) => (
                                <tr key={module.key}>
                                    <td style={{ fontWeight: 500 }}>{module.name}</td>

                                    {["read", "write", "update", "delete"].map((perm) => (
                                        <td key={perm} className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    roleForm?.permissions?.[module.key]?.[perm] || false
                                                }
                                                onChange={(e) =>
                                                    updatePermission(
                                                        module.key,
                                                        perm,
                                                        e.target.checked
                                                    )
                                                }
                                                style={{ width: 18, height: 18, cursor: "pointer" }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ===== ACTIONS ===== */}
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                    <button
                        className="btn btn-secondary w-50"
                        onClick={() => setShowRoleModal(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-primary w-50"
                        onClick={handleSaveRole}
                        disabled={!roleForm?.role}
                    >
                        {editingRole ? "Update Permissions" : "Create Permissions"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RolePermissionModel;
