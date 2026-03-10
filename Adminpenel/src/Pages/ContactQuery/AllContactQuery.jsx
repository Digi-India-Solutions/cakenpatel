import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllContactQuery = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))

  const hasAccessDelete = (module) => {
    return (
      AdminData?.role === "Admin" ||
      AdminData?.permissions?.[module]?.delete === true
    );
  };

  /* ================= FORMAT MESSAGE ================= */
  const formatMessage = (text = "", wordsPerLine = 80) => {
    const words = text.split(" ");
    const lines = [];

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(" "));
    }

    return lines.join("\n");
  };

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.cakenpetals.com/api/contacts"
      );

      if (response?.data?.success) {
        setUsers(response.data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Swal.fire("Error", "Failed to load contacts", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This contact will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `https://api.cakenpetals.com/api/contact/${id}`
      );

      if (response?.data?.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));

        Swal.fire("Deleted!", "Contact deleted successfully.", "success");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", "Failed to delete contact.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return <p style={{ padding: 20 }}>Loading contacts...</p>;
  }

  /* ================= UI ================= */
  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Contact Query</h4>
        </div>
      </div>

      <section className="main-table">
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th style={{ minWidth: 300 }}>Message</th>
                <th>Created At</th>
                {hasAccessDelete('contactQuery') && <th>Delete</th>}
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <th>{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.subject}</td>

                    {/* ✅ MESSAGE WRAPPED */}
                    <td style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 5, // ✅ show only 5 lines
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      lineHeight: "1.4",
                      maxWidth: "570px",
                      whiteSpace: "pre-line",
                      overflowY: 'scroll',
                    }}>
                      {formatMessage(user.message, 80)}
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleString()}
                    </td>

                    {hasAccessDelete('contactQuery') && <td>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bt delete"
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No contact queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AllContactQuery;
