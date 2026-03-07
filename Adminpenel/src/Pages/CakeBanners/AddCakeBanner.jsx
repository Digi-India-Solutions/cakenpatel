import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

// import Select from "react-select";

/* ===== options ===== */
// const subCategoryOptions = secondSubcategories.map((sub) => ({
//   value: sub._id,
//   label: sub.secondsubcategoryName,
// }));

// /* ===== JSX ===== */
// <div className="col-md-4">
//   <label className="form-label">Sub Category</label>

//   <Select
//     options={subCategoryOptions}
//     value={subCategoryOptions.find(
//       (opt) => opt.value === formData?.secondsubcategoryName
//     )}
//     onChange={(selected) =>
//       setFormData((prev) => ({
//         ...prev,
//         secondsubcategoryName: selected?.value || "",
//       }))
//     }
//     placeholder="Select sub category"
//     isSearchable
//     classNamePrefix="react-select"
//   />
// </div>
const AddCakeBanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [secondSubcategories, setSecondSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    bannerKey: "",
    secondsubcategoryName: "",
    image: null,
    bannerStatus: false,
  });

  /* ================= HANDLE CHANGE ================= */
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bannerKey) {
      toast.error("Please select a cake banner slot");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a banner image");
      return;
    }
    if (!formData.categoryName) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.subcategoryName) {
      toast.error("Please select a subcategory");
      return;
    }
    if (!formData.secondsubcategoryName) {
      toast.error("Please select a sub-subcategory");
      return;
    }
    if (!formData?.titel) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("bannerKey", formData.bannerKey);
      fd.append("cakeBanner", formData.image);
      fd.append("bannerStatus", formData.bannerStatus || false);
      fd.append("categoryName", formData.categoryName);
      fd.append("subcategoryName", formData.subcategoryName);
      fd.append("secondsubcategoryName", formData.secondsubcategoryName);
      fd.append("titel", formData.titel);

      await axios.post(
        "https://api.cakenpetals.com/api/cake-banner/upload-cake-banner",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Cake banner uploaded successfully");
      navigate("/all-cake-banner");
    } catch (error) {
      toast.error("Failed to upload cake banner");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubSubcategories = async () => {
      try {
        const res = await axios.get(
          "https://api.cakenpetals.com/api/second-sub-category/get-second-sub-category"
        );
        const categoryResponse = await axios.get(
          "https://api.cakenpetals.com/api/get-main-category"
        );
        const subcategoryResponse = await axios.get(
          "https://api.cakenpetals.com/api/get-subcategory"
        );
        setSecondSubcategories(res.data?.data || []);
        setCategories(categoryResponse.data.data);
        setSubcategories(subcategoryResponse.data.data || []);
      } catch (error) {
        toast.error("Error fetching sub-subcategories");
        console.error(error);
      }
    };

    fetchSubSubcategories();
  }, []);

  useEffect(() => {
    const fetchSecondSubcategories = async () => {
      try {
        const response = await axios.get(
          `https://api.cakenpetals.com/api/second-sub-category/get-second-subcategory-by-subcategory/${formData.subcategoryName}`
        );
        setSecondSubcategories(response?.data?.data);
      } catch (error) {
        console.error("Error fetching second subcategories:", error);
      }
    }
    if (formData?.subcategoryName) {
      fetchSecondSubcategories();
    }

  }, [formData?.subcategoryName])

  useEffect(() => {
    if (formData?.categoryName) {
      const filteredSubcategories = subcategories.filter(
        (subcategory) => subcategory.categoryName?._id === formData.categoryName
      );
      setFilteredSubcategories(filteredSubcategories);
    }
  }, [formData?.categoryName])



  const categoriesList = categories.map((sub) => ({
    value: sub._id,
    label: sub.mainCategoryName,
  }));

  const subCategoryOptions = filteredSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.subcategoryName,
  }));

  const secondSubcategoriesList = secondSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.secondsubcategoryName,
  }));

  console.log("FORMDATA=>", formData);
  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Add level Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-cake-banner" className="add-new">
            Back
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* SUB CATEGORY */}

          <div className="col-md-4">
            <label className="form-label">Main Category Name</label>

            <Select
              options={categoriesList}
              value={categoriesList.find(
                (opt) => opt.value === formData.categoryName
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryName: selected?.value || "",
                  secondsubcategoryName: "",
                  subcategoryName: "",
                }))
              }
              placeholder="Select Main category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub Category</label>

            <Select
              options={subCategoryOptions}
              value={subCategoryOptions.find(
                (opt) => opt.value === formData?.subcategoryName
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  subcategoryName: selected?.value || "",
                  secondsubcategoryName: "",
                }))
              }
              placeholder="Select sub category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Child Category Name</label>
            <Select
              options={secondSubcategoriesList}
              value={secondSubcategoriesList.find(
                (opt) => opt.value === formData.secondsubcategoryName
              )}
              disabled={!formData?.subcategoryName}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  secondsubcategoryName: selected?.value || "",
                }))
              }
              placeholder="Select Child Category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          {/* BANNER SLOT */}
          <div className="col-md-4">
            <label className="form-label">Select level Banner Slot</label>
            <select
              name="bannerKey"
              className="form-control select-arrow"
              value={formData.bannerKey}
              onChange={handleChange}
              required
            >
              <option value="">-- Select level Banner --</option>
              <option value="cakeBanner1">Level 1</option>
              <option value="cakeBanner2">Level 2</option>
              <option value="cakeBanner3">Level 3</option>
              <option value="cakeBanner4">Level 4</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Titel</label>
            <input type="text" name="titel" className="form-control" value={formData.titel} onChange={handleChange} required />
          </div>

          {/* IMAGE */}
          <div className="col-md-4">
            <label className="form-label">
              Banner Image {
                formData?.bannerKey === "cakeBanner1" ? `(550 x 270) PX` :
                  formData?.bannerKey === "cakeBanner2" ? `(550 x 270) PX` :
                    formData?.bannerKey === "cakeBanner3" ? `(270 x 310) PX` :
                      formData?.bannerKey === "cakeBanner4" ? `(1280 x 250) PX` : ''
              }
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              disabled={!formData.bannerKey}
              required
            />
          </div>

          {/* SMALL PREVIEW */}
          {preview && (
            <div className="col-md-12">
              <label className="form-label">Preview</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={preview}
                  alt="Cake Banner Preview"
                  style={{
                    width: "220px",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    background: "#f8f9fa",
                  }}
                />
                <small className="text-muted">Scaled preview</small>
              </div>
            </div>
          )}

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? "not-allowed" : "allowed"}`}
            >
              {loading ? "Uploading..." : "Save level Banner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCakeBanner;
