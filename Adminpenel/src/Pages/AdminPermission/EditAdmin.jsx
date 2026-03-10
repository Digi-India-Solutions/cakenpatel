import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // optional on edit
    role: "Admin",
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FETCH ADMIN ================= */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/user/${id}`
        );

        const data = res?.data?.data;

        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "", // never prefill password
            role: data.role || "Admin",
          });
        }
      } catch (error) {
        toast.error("Failed to load admin");
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };

      // ✅ only send password if entered
      if (formData.password) {
        body.password = formData.password;
      }

      const res = await axios.put(
        `https://api.cakenpetals.com/api/user/update-admin/${id}`,
        body
      );

      toast.success(res.data?.message || "Admin updated");
      navigate("/all-admin");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update admin"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (pageLoading) {
    return <p style={{ padding: 20 }}>Loading admin...</p>;
  }

  /* ================= UI ================= */
  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Edit Admin</h4>
        </div>

        <div className="links">
          <Link to="/all-admin" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* NAME */}
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

          {/* EMAIL */}
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

          {/* PASSWORD (OPTIONAL) */}
          <div className="col-md-4">
            <label className="form-label">
              Password (leave blank to keep same)
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* ROLE */}
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

          {/* BUTTON */}
          <div className="col-md-12 mt-3">
            <button
              type="submit"
              className="bt cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Admin"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAdmin;