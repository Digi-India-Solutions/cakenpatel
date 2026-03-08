import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const AddAdmin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "SuperAdmin",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill all fields");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(
                "https://api.cakenpetals.com/api/user",
                formData
            );

            toast.success(res.data?.message || "Admin created");
            navigate("/all-admin");

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to create admin"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>Add Admin</h4>
                </div>

                <div className="links">
                    <Link to="/all-admin" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">Super Admin</option>
                        </select>
                    </div>

                    <div className="col-md-12 mt-3">
                        <button
                            type="submit"
                            className="bt cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Create Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddAdmin;