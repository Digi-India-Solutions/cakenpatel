import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditParentProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    parentProductName: "",
    activeOnHome: false,
  });

  // ✅ fetch single category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsFetching(true);

        const response = await axios.get(
          `http://localhost:7000/api/parent-product/get-single-parent-product/${id}`
        );

        const data = response?.data?.data;

        setFormData({
          parentProductName: data?.parentProductName || "",
          activeOnHome: data?.ActiveonHome || false,
        });

      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Error fetching category:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  // ✅ unified change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.parentProductName.trim()) {
      toast.error("Parent Product Name is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:7000/api/parent-product/update-parent-product/${id}`,
        {
          parentProductName: formData.parentProductName,
          ActiveonHome: formData.activeOnHome,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response==>", response);
      toast.success(response?.data?.message || "Category updated");

      setTimeout(() => {
        navigate("/all-perant-product");
      }, 1200);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating category"
      );
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ loading state while fetching
  if (isFetching) {
    return (
      <div className="text-center mt-5">
        <h5>Loading...</h5>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bread">
        <div className="head">
          <h4>Edit Parent Product</h4>
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
              {isLoading ? "Please wait..." : "Update Parent Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditParentProduct;