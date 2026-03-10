import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubSubCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /* ================= STATE ================= */

  const [formData, setFormData] = useState({
    name: "",
    activeOnHome: false,
    image: null,
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name || !formData.image
    ) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData?.name);
      fd.append("ActiveonHome", formData?.activeOnHome);
      fd.append("image", formData?.image);

      const res = await axios.post(
        "https://api.cakenpetals.com/api/recommended-category/create-recommended-category",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data?.message || "Sub-Subcategory added");
      navigate("/all-recommended-category");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create sub-subcategory"
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
          <h4>Add Recommended category</h4>
        </div>
        <div className="links">
          <Link to="/all-recommended-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Recommended category Name */}
          <div className="col-md-6">
            <label className="form-label">Recommended category Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Recommended Category Image (48 x 48) PX</label>
            <input
              type="file"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          {/* ACTIVE */}
          {/* <div className="col-md-6">
            <label className="form-label">Display on Homepage</label>
            <div className="form-check">
              <input
                type="checkbox"
                name="activeOnHome"
                className="form-check-input"
                checked={formData?.activeOnHome}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Homepage
              </label>
            </div>
          </div> */}



          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Recommended Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubSubCategory;
