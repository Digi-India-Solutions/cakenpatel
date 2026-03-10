import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPromoBanners = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    highlight: "",
    subtitle: "",
    bannerKey: "",
    image: null,
    isActive: true,
  });

  /* ================= FETCH BANNER ================= */
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7000/api/promo-banner/get-single-promo-banner/${id}`
        );

        const banner = res.data.data;

        setFormData({
          // title: banner.title || "",
          // highlight: banner.highlight || "",
          // subtitle: banner.subtitle || "",
          bannerKey: banner.bannerKey || "",
          image: null,
          isActive: banner.isActive || true,
        });

        setPreview(
          `http://localhost:7000/${banner.image}`
        );
      } catch (err) {
        toast.error("Failed to load promo banner");
        console.error(err);
      }
    };

    fetchBanner();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("bannerKey", formData.bannerKey);
      // fd.append("highlight", formData.highlight);
      // fd.append("subtitle", formData.subtitle);
      fd.append("isActive", formData.isActive);

      if (formData.image) {
        fd.append("image", formData.image);
      }

      await axios.put(
        `http://localhost:7000/api/promo-banner/update-promo-banner/${id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Promo banner updated successfully");
      navigate("/all-promo-banners");
    } catch (err) {
      toast.error("Failed to update promo banner");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Edit Promo Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-promo-banners" className="add-new">
            Back
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="col-md-6">
            <label className="form-label">Select Banner Slot</label>
            <select
              name="bannerKey"
              className="form-control"
              value={formData?.bannerKey}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Banner --</option>
              <option value="banner1">Banner 1</option>
              <option value="banner2">Banner 2</option>
              <option value="banner3">Banner 3</option>
            </select>
          </div>

          {/* HIGHLIGHT */}
          {/* <div className="col-md-6">
            <label className="form-label">Highlight Text</label>
            <input
              type="text"
              name="highlight"
              className="form-control"
              value={formData.highlight}
              onChange={handleChange}
            />
          </div> */}

          {/* SUBTITLE */}
          {/* <div className="col-md-6">
            <label className="form-label">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              className="form-control"
              value={formData.subtitle}
              onChange={handleChange}
            />
          </div> */}

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Banner Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleChange}
            />

            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </div>

          {/* ACTIVE */}
          <div className="col-md-6">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active
              </label>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? "not-allowed" : "allowed"}`}
            >
              {loading ? "Please Wait..." : "Update Banner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPromoBanners;
