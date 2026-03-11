import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://api.cakenpetals.com";
const LIMIT    = 10;

const AllEvents = () => {
  const [events,      setEvents]      = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination,  setPagination]  = useState({
    total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false,
  });

  const AdminData = JSON.parse(sessionStorage.getItem("AdminData") || "{}");
  const hasAccess = (type) => {
    if (AdminData?.role === "Admin") return true;
    return AdminData?.permissions?.events?.[type] === true;
  };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchEvents = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/event/all`, {
        params: { page, limit: LIMIT },
      });
      if (res.data.success) {
        setEvents(res.data.data || []);
        setPagination(res.data.pagination || {});
      }
    } catch (err) {
      console.error("fetchEvents error:", err);
      toast.error("Failed to fetch events!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEvents(currentPage); }, [currentPage]);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This event will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/api/event/delete/${id}`);
        toast.success("Event deleted successfully!");
        const newPage = events.length === 1 && currentPage > 1
          ? currentPage - 1 : currentPage;
        setCurrentPage(newPage);
        fetchEvents(newPage);
      } catch (err) {
        toast.error("Failed to delete event!");
      }
    }
  };

  // ── Toggle ActiveonHome ─────────────────────────────────────────────────────
  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/event/toggle-status/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchEvents(currentPage);
      }
    } catch (err) {
      toast.error("Failed to update status!");
    }
  };

  // ── Search filter (client-side on current page) ─────────────────────────────
  const filteredEvents = events.filter((e) =>
    e?.EventTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    const left  = Math.max(1, currentPage - delta);
    const right = Math.min(total, currentPage + delta);
    if (left > 1)     { pages.push(1); if (left > 2)        pages.push("..."); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total){ if (right < total - 1) pages.push("..."); pages.push(total); }
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

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <ToastContainer />

      {/* Header */}
      <div className="bread">
        <div className="head"><h4>All Events</h4></div>
        {hasAccess("write") && (
          <div className="links">
            <Link to="/add-events" className="add-new">
              Add New <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
        )}
      </div>

      {/* Search + Count */}
      <div className="filteration d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div className="search">
          <label htmlFor="search">Search &nbsp;</label>
          <input
            type="text" id="search"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span style={{ fontSize: "13px", color: "#666" }}>
          Total: <strong>{pagination.total || 0}</strong> events
        </span>
      </div>

      {/* Table */}
      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Event Title</th>
              <th>Active on Home</th>
              {(hasAccess("update") || hasAccess("delete")) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <span className="spinner-border spinner-border-sm me-2" />
                  Loading...
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4" style={{ color: "#999" }}>
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <tr key={event._id}>
                  <td>{(currentPage - 1) * LIMIT + index + 1}</td>

                  {/* Image */}
                  <td>
                    <img
                      src={`${BASE_URL}/${event.image}`}
                      alt={event.EventTitle}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </td>

                  {/* Title */}
                  <td style={{ fontWeight: "500" }}>{event.EventTitle}</td>

                  {/* Active on Home Toggle */}
                  <td>
                    <div
                      onClick={() => hasAccess("update") && handleToggleStatus(event._id)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: hasAccess("update") ? "pointer" : "default" }}
                    >
                      <div style={{
                        width: "38px", height: "21px", borderRadius: "11px",
                        backgroundColor: event.ActiveonHome ? "#4caf50" : "#ccc",
                        position: "relative", transition: "background 0.2s",
                      }}>
                        <div style={{
                          position: "absolute", top: "3px",
                          left: event.ActiveonHome ? "19px" : "3px",
                          width: "15px", height: "15px", borderRadius: "50%",
                          backgroundColor: "#fff", transition: "left 0.2s",
                        }} />
                      </div>
                      <span style={{ fontSize: "12px", color: event.ActiveonHome ? "#388e3c" : "#999" }}>
                        {event.ActiveonHome ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  {(hasAccess("update") || hasAccess("delete")) && (
                    <td style={{ whiteSpace: "nowrap" }}>
                      {hasAccess("update") && (
                        <Link to={`/edit-event/${event._id}`} className="bt edit">
                          Edit <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                      )}
                      &nbsp;
                      {hasAccess("delete") && (
                        <button onClick={() => handleDelete(event._id)} className="bt delete">
                          Delete <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </td>
                  )}
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
            Showing <strong>{(currentPage - 1) * LIMIT + 1}</strong>–
            <strong>{Math.min(currentPage * LIMIT, pagination.total)}</strong> of{" "}
            <strong>{pagination.total}</strong>
          </span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPrevPage} style={pageBtnStyle(!pagination.hasPrevPage)}>‹ Prev</button>
            {renderPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`d${i}`} style={{ padding: "6px 4px", color: "#999" }}>…</span>
              ) : (
                <button key={page} onClick={() => handlePageChange(page)} style={pageBtnStyle(false, page === currentPage)}>{page}</button>
              )
            )}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNextPage} style={pageBtnStyle(!pagination.hasNextPage)}>Next ›</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AllEvents;