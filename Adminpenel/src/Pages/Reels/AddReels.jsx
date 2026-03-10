import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddReels = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  /* ================= STATE ================= */

  const [formData, setFormData] = useState({
    productId: "",
    video: null,
    activeOnHome: false,
    title: "",
    price: "",
    productImage: "",
  });

  /* ================= VIDEO PREVIEW ================= */

  const videoPreview = useMemo(() => {
    if (!formData.video) return null;
    return URL.createObjectURL(formData.video);
  }, [formData.video]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    // ✅ product select
    if (name === "productId") {
      const product = productList.find((p) => p._id === value);

      if (product) {
        setFormData((prev) => ({
          ...prev,
          productId: product._id,
          title: product.productName || "",
          price: product?.Variant?.[0]?.finalPrice || "",
          productImage: product?.productImage?.[0] || "",
        }));
      }
      return;
    }

    // ✅ video upload with size check
    if (type === "file") {
      const file = files[0];

      if (!file) return;

      const maxSize = 80 * 1024 * 1024; // 80MB

      if (file.size > maxSize) {
        toast.error("Video must be less than 80MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        video: file,
      }));
      return;
    }

    // ✅ checkbox
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // ✅ normal input
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error("Please select product");
      return;
    }

    if (!formData.video) {
      toast.error("Please upload reel video");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("productId", formData.productId);
      fd.append("video", formData.video);
      fd.append("activeOnHome", formData.activeOnHome);

      const res = await axios.post(
        "http://localhost:7000/api/reel/create-reel",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data?.message || "Reel added successfully");

      // ✅ reset form
      setFormData({
        productId: "",
        video: null,
        activeOnHome: false,
        title: "",
        price: "",
        productImage: "",
      });

      navigate("/all-reels");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create reel"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7000/api/all-product"
        );
        setProductList(res.data?.data || []);
      } catch (error) {
        toast.error("Error fetching products");
        console.error(error);
      }
    };

    fetchAllProduct();
  }, []);

  /* ================= UI ================= */

  const productLists = productList.map((sub) => ({
    value: sub._id,
    label: `${sub?.productName} ₹(${sub?.Variant?.[0]?.price || 0})`,
  }));

  return (
    <>
      <ToastContainer />

      {/* ===== BREAD ===== */}
      <div className="bread">
        <div className="head">
          <h4>Add Reel</h4>
        </div>
        <div className="links">
          <Link to="/all-reels" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* PRODUCT */}


          <div className="col-md-6">
            <label className="form-label"> Select Product </label>

            <Select
              options={productLists}
              value={productLists.find(
                (opt) => opt.value === formData.productId
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  productId: selected?.value || "",
                }))
              }
              placeholder="Select Product"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          {/* VIDEO */}
          <div className="col-md-6">
            <label className="form-label">
              Reel Video (Max 80MB)
            </label>
            <input
              type="file"
              name="video"
              className="form-control"
              accept="video/*"
              onChange={handleChange}
              required
            />

            {/* ✅ VIDEO PREVIEW */}
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                style={{
                  width: "200px",
                  marginTop: 10,
                  borderRadius: 8,
                }}
              />
            )}
          </div>

          {/* ACTIVE */}
          <div className="col-md-6">
            <label className="form-label">
              Display on Homepage
            </label>
            <div className="form-check">
              <input
                type="checkbox"
                name="activeOnHome"
                className="form-check-input"
                checked={formData.activeOnHome}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Homepage
              </label>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "Please Wait..." : "Add Reel"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReels;