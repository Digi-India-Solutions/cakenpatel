import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:7000";

const AllProductReviews = () => {
    // ── State ──────────────────────────────────────────────────────────────────
    const [reviews, setReviews] = useState([]);   // ✅ was "products" (didn't exist)
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // ── Pagination State ───────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false,
    });
    const LIMIT = 10;

    const AdminData = JSON.parse(sessionStorage.getItem("AdminData") || "{}");

    const hasAccess = (module, type) => {
        if (AdminData?.role === "Admin") return true;
        return AdminData?.permissions?.[module]?.[type] === true;
    };

    // ── Fetch Reviews ──────────────────────────────────────────────────────────
    const fetchProductReviews = async (page = 1) => {
        setIsLoading(true);
        try {
            // ✅ Correct API URL + pagination params
            const res = await axios.get(
                `${BASE_URL}/api/product-preview/all-product-preview`,
                { params: { page, limit: LIMIT } }
            );

            if (res.data.success) {
                setReviews(res.data.data || []);          // ✅ was setProducts (undefined)
                setPagination(res.data.pagination || {});
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to fetch reviews!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProductReviews(currentPage);
    }, [currentPage]);

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (reviewId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This review will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(
                    `${BASE_URL}/api/product-preview/delete-preview/${reviewId}`
                );
                toast.success("Review deleted successfully!");
                // ✅ Re-fetch current page (if last item on page, go back one page)
                const newPage = reviews.length === 1 && currentPage > 1
                    ? currentPage - 1
                    : currentPage;
                setCurrentPage(newPage);
                fetchProductReviews(newPage);
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review!");
            }
        }
    };

    // ── Toggle Active Status ───────────────────────────────────────────────────
    const handleToggleStatus = async (reviewId, currentStatus) => {
        try {
            const res = await axios.patch(
                `${BASE_URL}/api/product-preview/change-preview-status/`,
                {
                    isActive: !currentStatus,
                    id: reviewId
                }
            );
            if (res.data.success) {
                toast.success("Status updated!");
                fetchProductReviews(currentPage);
            }
        } catch (error) {
            toast.error("Failed to update status!");
            console.error(error);
        }
    };

    // ── Client-side search filter ──────────────────────────────────────────────
    // Searches on currently loaded page. For server-side search, pass query as param.
    const filteredReviews = reviews.filter((r) => {
        const query = searchQuery.toLowerCase();
        return (
            r?.productId?.productName?.toLowerCase().includes(query) ||
            r?.userId?.name?.toLowerCase().includes(query) ||
            r?.userId?.email?.toLowerCase().includes(query) ||
            r?.massege?.toLowerCase().includes(query)
        );
    });

    // ── Pagination Controls ────────────────────────────────────────────────────
    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderPageNumbers = () => {
        const pages = [];
        const total = pagination.totalPages || 1;
        const delta = 2; // pages around current
        const left = Math.max(1, currentPage - delta);
        const right = Math.min(total, currentPage + delta);

        if (left > 1) {
            pages.push(1);
            if (left > 2) pages.push("...");
        }
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < total) {
            if (right < total - 1) pages.push("...");
            pages.push(total);
        }
        return pages;
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            <ToastContainer />

            {/* Header */}
            <div className="bread">
                <div className="head">
                    <h4>All Product Reviews</h4>
                </div>
            </div>

            {/* Search + Stats */}
            <div className="filteration d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="search">
                    <label htmlFor="search">Search &nbsp;</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by product, user, review..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <span style={{ fontSize: "13px", color: "#666" }}>
                    Total: <strong>{pagination.total || 0}</strong> reviews
                </span>
            </div>

            {/* Table */}
            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Product Image</th>
                            <th>Reviewer</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Review</th>
                            <th>Status</th>
                            {hasAccess("reviews", "delete") && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Loading reviews...
                                </td>
                            </tr>
                        ) : filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4" style={{ color: "#999" }}>
                                    No reviews found.
                                </td>
                            </tr>
                        ) : (
                            filteredReviews.map((review, index) => (
                                <tr key={review._id}>
                                    {/* Serial number accounts for pagination */}
                                    <td>{(currentPage - 1) * LIMIT + index + 1}</td>

                                    {/* Product Name */}
                                    <td style={{ fontSize: "13px", fontWeight: "500" }}>
                                        {review?.productId?.productName || "N/A"}
                                    </td>

                                    {/* Product Image */}
                                    <td>
                                        {review?.productId?.productImage?.[0] ? (
                                            <img
                                                src={`${BASE_URL}/${review.productId.productImage[0]}`}
                                                alt="product"
                                                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                                            />
                                        ) : (
                                            <span style={{ color: "#aaa", fontSize: "12px" }}>No image</span>
                                        )}
                                    </td>

                                    {/* Reviewer Name */}
                                    <td style={{ fontSize: "13px" }}>
                                        {review?.userId?.name || review?.name || "Anonymous"}
                                    </td>

                                    {/* Email */}
                                    <td style={{ fontSize: "12px", color: "#666" }}>
                                        {review?.userId?.email || "—"}
                                    </td>

                                    {/* Star Rating */}
                                    <td>
                                        <span style={{
                                            backgroundColor: review?.rating >= 4 ? "#e8f5e9" : review?.rating >= 3 ? "#fff8e1" : "#ffebee",
                                            color: review?.rating >= 4 ? "#2e7d32" : review?.rating >= 3 ? "#f57f17" : "#c62828",
                                            padding: "3px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "700"
                                        }}>
                                            ★ {review?.rating ?? "—"}
                                        </span>
                                    </td>

                                    {/* Review Text */}
                                    <td style={{ fontSize: "12px", color: "#444", maxWidth: "220px" }}>
                                        <span title={review?.massege || review?.reviewText}>
                                            {(review?.massege || review?.reviewText || "—").slice(0, 80)}
                                            {(review?.massege || review?.reviewText || "").length > 80 ? "..." : ""}
                                        </span>
                                    </td>

                                    {/* Active Status Toggle */}
                                    <td>
                                        <div
                                            onClick={() => handleToggleStatus(review._id, review?.isActive)}
                                            style={{
                                                display: "inline-flex", alignItems: "center", gap: "6px",
                                                cursor: "pointer", userSelect: "none"
                                            }}
                                        >
                                            <div style={{
                                                width: "36px", height: "20px", borderRadius: "10px",
                                                backgroundColor: review?.isActive ? "#4caf50" : "#ccc",
                                                position: "relative", transition: "background 0.2s"
                                            }}>
                                                <div style={{
                                                    position: "absolute", top: "3px",
                                                    left: review?.isActive ? "18px" : "3px",
                                                    width: "14px", height: "14px", borderRadius: "50%",
                                                    backgroundColor: "#fff", transition: "left 0.2s"
                                                }} />
                                            </div>
                                            <span style={{ fontSize: "11px", color: review?.isActive ? "#388e3c" : "#999" }}>
                                                {review?.isActive ? "Active" : "Hidden"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    {hasAccess("reviews", "delete") && (
                                        <td>
                                            <button onClick={() => handleDelete(review._id)} className="bt delete">
                                                Delete <i className="fa-solid fa-trash" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            {/* ── Pagination ─────────────────────────────────────────────────────── */}
            {pagination.totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 px-1">
                    {/* Info */}
                    <span style={{ fontSize: "13px", color: "#666" }}>
                        Showing{" "}
                        <strong>{(currentPage - 1) * LIMIT + 1}</strong>
                        {" – "}
                        <strong>{Math.min(currentPage * LIMIT, pagination.total)}</strong>
                        {" of "}
                        <strong>{pagination.total}</strong> reviews
                    </span>

                    {/* Page Buttons */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {/* Prev */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            style={pageBtnStyle(!pagination.hasPrevPage)}
                        >
                            ‹ Prev
                        </button>

                        {/* Page Numbers */}
                        {renderPageNumbers().map((page, i) =>
                            page === "..." ? (
                                <span key={`dots-${i}`} style={{ padding: "6px 4px", color: "#999" }}>…</span>
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

                        {/* Next */}
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

// ── Pagination button style helper ────────────────────────────────────────────
const pageBtnStyle = (disabled = false, active = false) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: active ? "none" : "1px solid #ddd",
    backgroundColor: active ? "#2e6a7c" : disabled ? "#f5f5f5" : "#fff",
    color: active ? "#fff" : disabled ? "#bbb" : "#333",
    fontWeight: active ? "600" : "400",
    fontSize: "13px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.15s",
});

export default AllProductReviews;