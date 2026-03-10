import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPromoBanners = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    bannerKey: "",
    image: null,
    isActive: true,
  });

  /* 🔄 CLEANUP PREVIEW URL */
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be under 2MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bannerKey) return toast.error("Select banner slot");
    if (!formData.image) return toast.error("Upload banner image");

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("bannerKey", formData.bannerKey);
      fd.append("image", formData.image);
      fd.append("isActive", formData.isActive);

      await axios.post(
        "http://localhost:7000/api/promo-banner/upload-promo-banner",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Promo banner uploaded");
      setFormData({ bannerKey: "", image: null, isActive: true });
      setPreview(null);
      navigate("/all-promo-banners");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Promo Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-promo-banners" className="add-new">Back</Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-4" onSubmit={handleSubmit}>

          {/* SELECT SLOT */}
          <div className="col-md-6">
            <label className="form-label">Banner Slot</label>
            <select
              name="bannerKey"
              className="form-control"
              value={formData.bannerKey}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Slot --</option>
              <option value="banner1">Banner 1</option>
              <option value="banner2">Banner 2</option>
              <option value="banner3">Banner 3</option>
            </select>
          </div>

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Banner Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="col-md-12">
              <label className="form-label">Preview</label>
              <div className="preview-box">
                <img src={preview} alt="Preview" className="img-preview" />
                <small className="text-muted">Preview (scaled)</small>
              </div>
            </div>
          )}

          {/* ACTIVE */}
          <div className="col-md-6">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label">Active</label>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-dark px-5 ${loading && "opacity-75"}`}
            >
              {loading ? "Uploading..." : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPromoBanners;
