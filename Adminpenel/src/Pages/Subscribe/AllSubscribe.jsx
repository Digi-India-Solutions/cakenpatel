import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllSubscribe = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FORMAT MESSAGE ================= */

    /* ================= FETCH ================= */
    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                "https://api.cakenpetals.com/api/subscribe-email/get-subscribe"
            );

            if (response?.data?.success) {
                setUsers(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching Subscribe Email:", error);
            Swal.fire("Error", "Failed to load Subscribe Email", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This Subscribe Email will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axios.delete(
                `https://api.cakenpetals.com/api/subscribe-email/delete-subscribe/${id}`
            );

            if (response?.data?.success) {
                setUsers((prev) => prev.filter((u) => u._id !== id));

                Swal.fire("Deleted!", "Subscribe Email deleted successfully.", "success");
            }
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire("Error!", "Failed to delete Subscribe Email.", "error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    /* ================= LOADING ================= */
    if (loading) {
        return <p style={{ padding: 20 }}>Loading Subscribe Email...</p>;
    }

    /* ================= UI ================= */
    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Subscribe Email</h4>
                </div>
            </div>

            <section className="main-table">
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Sr.No.</th>
                                <th>Email</th>
                                <th>Created At</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user._id}>
                                        <th>{index + 1}</th>
                                        <td>{user.email}</td>
                                        <td>
                                            {new Date(user.createdAt).toLocaleString()}
                                        </td>

                                        <td>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="bt delete"
                                            >
                                                Delete <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No Subscribe Email found.
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

export default AllSubscribe;
