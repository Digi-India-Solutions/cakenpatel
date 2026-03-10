import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const EditCakeBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [secondSubcategories, setSecondSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    titel: "",
    bannerKey: "",
    categoryName: "",
    subcategoryName: "",
    secondsubcategoryName: "",
    image: null,
    bannerStatus: false,
  });

  // ✅ STEP 1: Load all master data first
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get("https://api.cakenpetals.com/api/get-main-category"),
          axios.get("https://api.cakenpetals.com/api/get-subcategory"),
        ]);
        setCategories(catRes.data?.data || []);
        setSubcategories(subRes.data?.data || []);
      } catch (err) {
        toast.error("Failed to load master data");
        console.error(err);
      }
    };
    fetchMasterData();
  }, []);

  // ✅ STEP 2: Load banner AFTER master data is ready
  useEffect(() => {
    if (!categories.length || !subcategories.length) return; // wait for master data

    const fetchBanner = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/cake-banner/get-single-cake-banner/${id}`
        );
        const banner = res.data?.data;

        setFormData({
          titel: banner?.titel || "",
          bannerKey: banner?.bannerKey || "",
          categoryName: banner?.categoryName || "",
          subcategoryName: banner?.subcategoryName || "",
          secondsubcategoryName: banner?.secondsubcategoryName || "",
          image: null,
          bannerStatus: banner?.bannerStatus || false,
        });

        setPreview(`https://api.cakenpetals.com/${banner?.cakeBanner}`);

        // ✅ Pre-filter subcategories for saved categoryName
        if (banner?.categoryName) {
          const filtered = subcategories.filter(
            (s) => s.categoryName?._id === banner.categoryName
          );
          setFilteredSubcategories(filtered);
        }

        // ✅ Pre-load second subcategories for saved subcategoryName
        if (banner?.subcategoryName) {
          const secRes = await axios.get(
            `https://api.cakenpetals.com/api/second-sub-category/get-second-subcategory-by-subcategory/${banner.subcategoryName}`
          );
          setSecondSubcategories(secRes?.data?.data || []);
        }
      } catch (err) {
        toast.error("Failed to load banner");
        console.error(err);
      }
    };

    fetchBanner();
  }, [id, categories, subcategories]); // ✅ Depends on master data being loaded

  // ✅ When category changes (user interaction), filter subcategories
  const handleCategoryChange = (selected) => {
    const catId = selected?.value || "";
    setFormData((prev) => ({
      ...prev,
      categoryName: catId,
      subcategoryName: "",
      secondsubcategoryName: "",
    }));

    const filtered = subcategories.filter(
      (s) => s.categoryName?._id === catId
    );
    setFilteredSubcategories(filtered);
    setSecondSubcategories([]); // reset child
  };

  // ✅ When subcategory changes (user interaction), fetch second subcategories
  const handleSubcategoryChange = async (selected) => {
    const subId = selected?.value || "";
    setFormData((prev) => ({
      ...prev,
      subcategoryName: subId,
      secondsubcategoryName: "",
    }));

    if (!subId) { setSecondSubcategories([]); return; }

    try {
      const res = await axios.get(
        `https://api.cakenpetals.com/api/second-sub-category/get-second-subcategory-by-subcategory/${subId}`
      );
      setSecondSubcategories(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching second subcategories:", err);
      toast.error("Failed to load child categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (!file) return;
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    const validations = [
      [!formData.bannerKey, "Please select a banner slot"],
      [!formData.categoryName, "Please select a category"],
      [!formData.subcategoryName, "Please select a subcategory"],
      [!formData.secondsubcategoryName, "Please select a child category"],
      [!formData.titel?.trim(), "Please enter a title"],
    ];

    for (const [condition, message] of validations) {
      if (condition) { toast.error(message); return; }
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("bannerKey", formData.bannerKey);
      fd.append("categoryName", formData.categoryName);
      fd.append("subcategoryName", formData.subcategoryName);
      fd.append("secondsubcategoryName", formData.secondsubcategoryName);
      fd.append("titel", formData.titel);
      fd.append("bannerStatus", formData.bannerStatus);
      if (formData.image) fd.append("cakeBanner", formData.image);

      await axios.put(
        `https://api.cakenpetals.com/api/cake-banner/update-cake-banner/${id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Banner updated successfully!");
      setTimeout(() => navigate("/all-cake-banner"), 1500);
    } catch (err) {
      toast.error("Failed to update banner");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Select options ──────────────────────────────────
  const categoriesList = categories.map((c) => ({
    value: c._id,
    label: c.mainCategoryName,
  }));

  const subCategoryOptions = filteredSubcategories.map((s) => ({
    value: s._id,
    label: s.subcategoryName,
  }));

  const secondSubcategoriesList = secondSubcategories.map((s) => ({
    value: s._id,
    label: s.secondsubcategoryName,
  }));

  const bannerSizeLabel = {
    cakeBanner1: "(550 x 270) PX",
    cakeBanner2: "(550 x 270) PX",
    cakeBanner3: "(270 x 310) PX",
    cakeBanner4: "(1280 x 250) PX",
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bread">
        <div className="head"><h4>Edit Level Banner</h4></div>
        <div className="links">
          <Link to="/all-cake-banner" className="add-new">Back</Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* MAIN CATEGORY */}
          <div className="col-md-4">
            <label className="form-label">Main Category <span className="text-danger">*</span></label>
            <Select
              options={categoriesList}
              value={categoriesList.find((o) => o.value === formData.categoryName) || null}
              onChange={handleCategoryChange}
              placeholder="Select Main Category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          {/* SUB CATEGORY */}
          <div className="col-md-4">
            <label className="form-label">Sub Category <span className="text-danger">*</span></label>
            <Select
              options={subCategoryOptions}
              value={subCategoryOptions.find((o) => o.value === formData.subcategoryName) || null}
              onChange={handleSubcategoryChange}
              placeholder="Select Sub Category"
              isSearchable
              isDisabled={!formData.categoryName}
              classNamePrefix="react-select"
            />
          </div>

          {/* CHILD CATEGORY */}
          <div className="col-md-4">
            <label className="form-label">Child Category <span className="text-danger">*</span></label>
            <Select
              options={secondSubcategoriesList}
              value={secondSubcategoriesList.find((o) => o.value === formData.secondsubcategoryName) || null}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, secondsubcategoryName: selected?.value || "" }))
              }
              placeholder="Select Child Category"
              isSearchable
              isDisabled={!formData.subcategoryName}
              classNamePrefix="react-select"
            />
          </div>

          {/* BANNER SLOT */}
          <div className="col-md-4">
            <label className="form-label">Banner Slot <span className="text-danger">*</span></label>
            <select
              name="bannerKey"
              className="form-control select-arrow"
              value={formData.bannerKey}
              onChange={handleChange}
            >
              <option value="">-- Select Banner --</option>
              <option value="cakeBanner1">Level 1</option>
              <option value="cakeBanner2">Level 2</option>
              <option value="cakeBanner3">Level 3</option>
              <option value="cakeBanner4">Level 4</option>
            </select>
          </div>

          {/* TITLE */}
          <div className="col-md-4">
            <label className="form-label">Title <span className="text-danger">*</span></label>
            <input
              type="text"
              name="titel"
              className="form-control"
              value={formData.titel}
              onChange={handleChange}
              placeholder="Enter banner title"
            />
          </div>

          {/* IMAGE */}
          <div className="col-md-4">
            <label className="form-label">
              Banner Image{" "}
              {formData.bannerKey && (
                <span className="text-muted">
                  {bannerSizeLabel[formData.bannerKey]}
                </span>
              )}
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              disabled={!formData.bannerKey}
              onChange={handleChange}
            />
            <small className="text-muted">Leave empty to keep existing image</small>
          </div>

          {/* BANNER STATUS */}
          {/* <div className="col-md-4 d-flex align-items-center gap-2 mt-2">
            <label className="form-label mb-0">Active Status</label>
            <div className="form-check form-switch ms-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData?.bannerStatus}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bannerStatus: e.target.checked }))
                }
              />
              <label className="form-check-label">
                {formData?.bannerStatus ? "Active" : "Inactive"}
              </label>
            </div>
          </div> */}

          {/* PREVIEW */}
          {preview && (
            <div className="col-md-12">
              <label className="form-label">Preview</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={preview}
                  alt="Banner Preview"
                  style={{
                    width: "220px", height: "80px",
                    objectFit: "cover", borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <small className="text-muted">Current / Selected Image</small>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={loading}
              className={loading ? "not-allowed" : "allowed"}
            >
              {loading ? "Updating..." : "Update Level Banner"}
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default EditCakeBanner;