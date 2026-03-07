import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const EditReels = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [existingVideo, setExistingVideo] = useState("");
  const [existingImage, setExistingImage] = useState("");

  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    price: "",
    activeOnHome: false,
    video: null,
    productImage: null,
  });

  /* ================= PREVIEWS ================= */

  const videoPreview = useMemo(() => {
    if (formData.video) return URL.createObjectURL(formData.video);
    return existingVideo;
  }, [formData.video, existingVideo]);

  const imagePreview = useMemo(() => {
    if (formData.productImage)
      return URL.createObjectURL(formData.productImage);
    return existingImage;
  }, [formData.productImage, existingImage]);

  /* ================= FETCH SINGLE REEL ================= */

  useEffect(() => {
    const fetchReel = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/reel/get-single-reel/${id}`
        );

        const data = res.data?.data;

        setFormData({
          productId: data?.productId?._id || "",
          title: data?.title || "",
          price: data?.price || "",
          activeOnHome: Boolean(data?.activeOnHome),
          video: null,
          productImage: null,
        });

        setExistingVideo(data?.videoUrl || data?.video || "");
        setExistingImage(data?.productImage || "");
      } catch {
        toast.error("Failed to load reel");
      }
    };

    fetchReel();
  }, [id]);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const res = await axios.get(
          "https://api.cakenpetals.com/api/all-product"
        );
        setProductList(res.data?.data || []);
      } catch (error) {
        toast.error("Error fetching products");
      }
    };

    fetchAllProduct();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    // ✅ product select auto fill
    if (name === "productId") {
      const product = productList.find((p) => p._id === value);

      if (product) {
        setFormData((prev) => ({
          ...prev,
          productId: product._id,
          title: product.productName || "",
          price: product?.Variant?.[0]?.finalPrice || "",
        }));
      }
      return;
    }

    // ✅ file upload with validation
    if (type === "file") {
      const file = files[0];
      if (!file) return;

      // video size check
      if (name === "video") {
        const maxSize = 80 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error("Video must be less than 80MB");
          return;
        }
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }

    // ✅ checkbox
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // ✅ normal input
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error("Please select product");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("productId", formData.productId);
      fd.append("title", formData.title);
      fd.append("price", formData.price);
      fd.append("activeOnHome", formData.activeOnHome);

      if (formData.video) fd.append("video", formData.video);
      if (formData.productImage)
        fd.append("productImage", formData.productImage);

      const res = await axios.put(
        `https://api.cakenpetals.com/api/reel/update-reel/${id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data?.message || "Reel updated successfully");
      navigate("/all-reels");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update reel"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
  const productLists = productList.map((sub) => ({
    value: sub._id,
    label: `${sub?.productName} ₹(${sub?.Variant?.[0]?.price || 0})`,
  }));

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Edit Reel</h4>
        </div>
        <div className="links">
          <Link to="/all-reels" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

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
            <label className="form-label">Replace Reel Video</label>
            <input
              type="file"
              name="video"
              className="form-control"
              accept="video/*"
              onChange={handleChange}
            />

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                style={{ width: 200, marginTop: 10, borderRadius: 8 }}
              />
            )}
          </div>

          {/* IMAGE */}
          {/* <div className="col-md-6">
            <label className="form-label">Replace Product Image</label>
            <input
              type="file"
              name="productImage"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: 120, marginTop: 10, borderRadius: 8 }}
              />
            )}
          </div> */}

          {/* ACTIVE */}
          <div className="col-md-6">
            <label className="form-label">Display on Homepage</label>
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
              {isLoading ? "Please Wait..." : "Update Reel"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditReels;