import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://api.cakenpetals.com";
const LIMIT = 10;

const STATUS_STYLE = {
    pending: { backgroundColor: "#fff8e1", color: "#f57f17" },
    inProgress: { backgroundColor: "#e3f2fd", color: "#1565c0" },
    resolved: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    rejected: { backgroundColor: "#ffebee", color: "#c62828" },
};

const AllEventEnquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false,
    });

    // ── Fetch ───────────────────────────────────────────────────────────────────
    const fetchEnquiries = async (page = 1, search = "", status = "", type = "") => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/event/enquiry/all`, {
                params: { page, limit: LIMIT, search, status, enquiryType: type },
            });
            if (res.data.success) {
                setEnquiries(res.data.data || []);
                setPagination(res.data.pagination || {});
            }
        } catch (err) {
            toast.error("Failed to fetch enquiries!");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries(currentPage, searchQuery, statusFilter, typeFilter);
    }, [currentPage, statusFilter, typeFilter]);

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => {
            setCurrentPage(1);
            fetchEnquiries(1, searchQuery, statusFilter, typeFilter);
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // ── Update Status ───────────────────────────────────────────────────────────
    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await axios.put(
                `${BASE_URL}/api/event/enquiry/update-status/${id}`,
                { status: newStatus }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                fetchEnquiries(currentPage, searchQuery, statusFilter, typeFilter);
            }
        } catch (err) {
            toast.error("Failed to update status!");
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete this enquiry?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/event/enquiry/delete/${id}`);
                toast.success("Enquiry deleted successfully!");
                const newPage =
                    enquiries.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                setCurrentPage(newPage);
                fetchEnquiries(newPage, searchQuery, statusFilter, typeFilter);
            } catch (err) {
                toast.error("Failed to delete enquiry!");
            }
        }
    };

    // ── Pagination ──────────────────────────────────────────────────────────────
    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderPageNumbers = () => {
        const pages = [];
        const total = pagination.totalPages || 1;
        const delta = 2;
        const left = Math.max(1, currentPage - delta);
        const right = Math.min(total, currentPage + delta);
        if (left > 1) { pages.push(1); if (left > 2) pages.push("..."); }
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < total) { if (right < total - 1) pages.push("..."); pages.push(total); }
        return pages;
    };

    const pageBtnStyle = (disabled = false, active = false) => ({
        padding: "6px 12px", borderRadius: "6px",
        border: active ? "none" : "1px solid #ddd",
        backgroundColor: active ? "#2e6a7c" : disabled ? "#f5f5f5" : "#fff",
        color: active ? "#fff" : disabled ? "#bbb" : "#333",
        fontWeight: active ? "600" : "400", fontSize: "13px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
    });

    // ── Unique enquiry types for filter dropdown ────────────────────────────────
    const uniqueTypes = [...new Set(enquiries.map((e) => e.enquiryType).filter(Boolean))];

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <>
            <ToastContainer />

            {/* Header */}
            <div className="bread">
                <div className="head">
                    <h4>All Event Enquiries</h4>
                </div>
            </div>

            {/* Filters Row */}
            <div className="filteration d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex gap-2 flex-wrap align-items-center">

                    {/* Search */}
                    <div className="search">
                        <label>Search &nbsp;</label>
                        <input
                            type="text"
                            placeholder="Name, phone, email, title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="inProgress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    {/* Enquiry Type filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <span style={{ fontSize: "13px", color: "#666" }}>
                    Total: <strong>{pagination.total || 0}</strong> enquiries
                </span>
            </div>

            {/* Table */}
            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Enquiry Type</th>
                            <th>Enquiry Title</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Loading...
                                </td>
                            </tr>
                        ) : enquiries.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4" style={{ color: "#999" }}>
                                    No enquiries found.
                                </td>
                            </tr>
                        ) : (
                            enquiries.map((enq, index) => (
                                <tr key={enq._id}>

                                    {/* Serial — accounts for pagination */}
                                    <td>{(currentPage - 1) * LIMIT + index + 1}</td>

                                    {/* Name */}
                                    <td style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                                        {enq.name}
                                        {enq.userId?.name && (
                                            <span style={{ fontSize: "11px", color: "#999", display: "block" }}>
                                                ({enq.userId.name})
                                            </span>
                                        )}
                                    </td>

                                    {/* Phone */}
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <a href={`tel:${enq.phone}`} style={{ color: "#2e6a7c", textDecoration: "none", fontWeight: "500" }}>
                                            {enq.phone}
                                        </a>
                                    </td>

                                    {/* Email */}
                                    <td style={{ fontSize: "12px" }}>
                                        {enq.email
                                            ? <a href={`mailto:${enq.email}`} style={{ color: "#555", textDecoration: "none" }}>{enq.email}</a>
                                            : "—"
                                        }
                                    </td>

                                    {/* Enquiry Type */}
                                    <td>
                                        {enq.enquiryType ? (
                                            <span style={{
                                                backgroundColor: "#f0f4ff", color: "#3a5bd0",
                                                padding: "3px 10px", borderRadius: "10px",
                                                fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap",
                                            }}>
                                                {enq.enquiryType}
                                            </span>
                                        ) : "—"}
                                    </td>

                                    {/* Enquiry Title */}
                                    <td style={{ fontSize: "13px", maxWidth: "150px" }}>
                                        <span title={enq.enquiryTitle}>
                                            {enq.enquiryTitle?.slice(0, 40)}
                                            {enq.enquiryTitle?.length > 40 ? "..." : ""}
                                        </span>
                                    </td>

                                    {/* Message */}
                                    <td style={{ fontSize: "12px", color: "#555", maxWidth: "180px" }}>
                                        <span title={enq.message}>
                                            {(enq.message || "—").slice(0, 60)}
                                            {enq.message?.length > 60 ? "..." : ""}
                                        </span>
                                    </td>

                                    {/* Status Dropdown */}
                                    <td>
                                        <select
                                            value={enq.status}
                                            onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                                            style={{
                                                padding: "3px 8px", borderRadius: "10px",
                                                fontSize: "12px", fontWeight: "600",
                                                border: "none", cursor: "pointer",
                                                outline: "none",
                                                ...STATUS_STYLE[enq.status],
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inProgress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>

                                    {/* Date */}
                                    <td style={{ fontSize: "12px", whiteSpace: "nowrap", color: "#777" }}>
                                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </td>

                                    {/* Delete */}
                                    <td>
                                        <button onClick={() => handleDelete(enq._id)} className="bt delete">
                                            Delete <i className="fa-solid fa-trash" />
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 px-1">
                    <span style={{ fontSize: "13px", color: "#666" }}>
                        Showing{" "}
                        <strong>{(currentPage - 1) * LIMIT + 1}</strong>–
                        <strong>{Math.min(currentPage * LIMIT, pagination.total)}</strong>
                        {" "}of <strong>{pagination.total}</strong>
                    </span>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            style={pageBtnStyle(!pagination.hasPrevPage)}
                        >
                            ‹ Prev
                        </button>

                        {renderPageNumbers().map((page, i) =>
                            page === "..." ? (
                                <span key={`d${i}`} style={{ padding: "6px 4px", color: "#999" }}>…</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={pageBtnStyle(false, page === currentPage)}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            style={pageBtnStyle(!pagination.hasNextPage)}
                        >
                            Next ›
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllEventEnquiry;