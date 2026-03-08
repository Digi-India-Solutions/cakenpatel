import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const AllCountdown = () => {
    const [countdowns, setCountdowns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))

    const hasAccessAdd = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.write === true
        );
    };

    const hasAccessDelete = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.delete === true
        );
    };

    const hasAccessEdit = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.update === true
        );
    };

    /* ================= FETCH ================= */

    const fetchCountdown = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(
                "https://api.cakenpetals.com/api/countdown/get-all-countdown"
            );

            if (res.data?.success) {
                setCountdowns(res.data.data || []);
            }
            setIsLoading(false);
        } catch (error) {
             setIsLoading(false);
            toast.error("Failed to load countdown");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCountdown();
    }, []);

    /* ================= DELETE ================= */

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Delete countdown?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const res = await axios.delete(
                `https://api.cakenpetals.com/api/countdown/delete-countdown/${id}`
            );

            if (res.data?.success) {
                setCountdowns((prev) => prev.filter((item) => item._id !== id));

                Swal.fire("Deleted!", "Countdown removed.", "success");
            }
        } catch (error) {
            Swal.fire("Error!", "Failed to delete countdown.", "error");
            console.error(error);
        }
    };

    /* ================= TOGGLE ================= */

    const handleCheckboxChange = async (e, id) => {
        const updatedStatus = e.target.checked;

        try {
            const res = await axios.post(
                `https://api.cakenpetals.com/api/countdown/update-status/${id}`,
                { isActive: updatedStatus }
            );

            if (res.data?.success) {
                setCountdowns((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, isActive: updatedStatus } : item
                    )
                );

                toast.success("Status updated");
            }
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    /* ================= DATE FORMAT ================= */

    const formatTime = (time) => {
        if (!time) return "-";

        try {
            const [hour, minute] = time.split(":");
            const date = new Date();
            date.setHours(hour, minute);

            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return time;
        }
    };

    /* ================= LOADING ================= */

    if (isLoading) {
        return <p style={{ padding: 20 }}>Loading Countdown...</p>;
    }

    /* ================= UI ================= */

    console.log("XXXXXXXX::=>", countdowns)
    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>All Count Down</h4>
                </div>

                {hasAccessAdd('countdown') && <div className="links">
                    <Link to="/add-countdown" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>}
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            {/* <th>Count Down Title</th> */}
                            <th>Category Name</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Active</th>
                            {hasAccessEdit('countdown') && <th>Edit</th>}
                            {hasAccessDelete('countdown') && <th>Delete</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {countdowns.length > 0 ? (
                            countdowns.map((item, index) => (
                                <tr key={item._id}>
                                    <th>{index + 1}</th>

                                    {/* <td>{item?.title || "-"}</td> */}
                                    <td>{item?.categoryId?.mainCategoryName || "-"}</td>
                                    <td>{formatTime(item?.startTime)}</td>
                                    <td>{formatTime(item?.endTime)}</td>

                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(item?.isActive)}
                                            onChange={(e) => handleCheckboxChange(e, item._id)}
                                            style={{ width: 18, height: 18, cursor: "pointer" }}
                                        />
                                    </td>

                                    {hasAccessEdit('countdown') && <td>
                                        <Link
                                            to={`/edit-countdown/${item?._id}`}
                                            className="bt edit"
                                        >
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>}

                                    {hasAccessDelete('countdown') && <td>
                                        <button
                                            className="bt cursor-pointer delete"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No Countdown Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllCountdown;
