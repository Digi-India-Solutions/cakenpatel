import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddParentProduct = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentProductName: "",
    activeOnHome: false,
  });

  // ✅ handle input + checkbox in one function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value, }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.parentProductName.trim()) {
      toast.error("Parent Product Name is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.cakenpetals.com/api/parent-product/create-parent-product",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response?.data?.message || "Category added");

      // ✅ reset form
      setFormData({
        parentProductName: "",
        activeOnHome: false,
      });

      // ✅ small delay for better UX
      setTimeout(() => {
        navigate("/all-perant-product");
      }, 1200);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error adding category"
      );
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bread">
        <div className="head">
          <h4>Add Parent Product</h4>
        </div>

        <div className="links">
          <Link to="/all-perant-product" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Parent Product Name */}
          <div className="col-md-6">
            <label htmlFor="parentProductName" className="form-label">
              Parent Product Name
            </label>
            <input
              type="text"
              name="parentProductName"
              id="parentProductName"
              className="form-control"
              value={formData.parentProductName}
              onChange={handleChange}
              placeholder="Enter parent product name"
              required
            />
          </div>

          {/* Submit */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "btn-secondary" : "btn-primary"
                }`}
            >
              {isLoading ? "Please wait..." : "Add Parent Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddParentProduct;