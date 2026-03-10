// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Select from "react-select";

// const EditBanner = () => {
//   const { id } = useParams();
//   const [formData, setFormData] = useState({ bannerName: "", bannerImage: null, bannerType: "Both", bannerStatus: false, });
//   const [previewImage, setPreviewImage] = useState("");
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [secondSubcategories, setSecondSubcategories] = useState([]);
//   const [filteredSubcategories, setFilteredSubcategories] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBannerData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:7000/api/get-single-banner/${id}`
//         );
//         const banner = response.data.data;
//         console.log("banner==>banner==>banner==>", banner);
//         setFormData({

//           bannerName: banner.bannerName,
//           bannerImage: null,
//           bannerType: banner.bannerType,
//           bannerStatus: banner.bannerStatus === "True",
//           categoryName: banner?.categoryName || "",
//           subcategoryName: banner?.subcategoryName || "",
//           secondsubcategoryName: banner?.secondsubcategoryName || "",
//         });
//         setPreviewImage(`http://localhost:7000/${banner.bannerImage}`);
//       } catch (error) {
//         console.error("Failed to fetch banner data:", error);
//         toast.error("Failed to load banner data");
//       }
//     };

//     fetchBannerData();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({
//       ...formData,
//       bannerImage: file,
//     });
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.bannerName || !formData.bannerType) {
//       toast.error("All fields except image are required");
//       return;
//     }
//     if (!formData.categoryName) {
//       toast.error("Please select a category");
//       return;
//     }
//     if (!formData.subcategoryName) {
//       toast.error("Please select a subcategory");
//       return;
//     }
//     if (!formData.secondsubcategoryName) {
//       toast.error("Please select a sub-subcategory");
//       return;
//     }

//     const submitData = new FormData();
//     submitData.append("bannerName", formData.bannerName);
//     if (formData.bannerImage)
//       submitData.append("bannerImage", formData.bannerImage);
//     submitData.append("bannerType", formData.bannerType);
//     submitData.append("bannerStatus", formData.bannerStatus ? "True" : "False");
//     submitData.append("categoryName", formData.categoryName);
//     submitData.append("subcategoryName", formData.subcategoryName);
//     submitData.append("secondsubcategoryName", formData.secondsubcategoryName);

//     try {
//       setBtnLoading(true);
//       const response = await axios.put(
//         `http://localhost:7000/api/update-banner/${id}`,
//         submitData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       if (response.status === 200) {
//         toast.success("Banner updated successfully");
//         navigate("/all-banners");
//       }
//     } catch (error) {
//       console.error("Failed to update banner:", error);
//       toast.error("Failed to update banner");
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchSubSubcategories = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:7000/api/second-sub-category/get-second-sub-category"
//         );
//         const categoryResponse = await axios.get(
//           "http://localhost:7000/api/get-main-category"
//         );
//         const subcategoryResponse = await axios.get(
//           "http://localhost:7000/api/get-subcategory"
//         );
//         setSecondSubcategories(res.data?.data || []);
//         setCategories(categoryResponse.data.data);
//         setSubcategories(subcategoryResponse.data.data || []);
//       } catch (error) {
//         toast.error("Error fetching sub-subcategories");
//         console.error(error);
//       }
//     };

//     fetchSubSubcategories();
//   }, []);

//   useEffect(() => {
//     const fetchSecondSubcategories = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:7000/api/second-sub-category/get-second-subcategory-by-subcategory/${formData.subcategoryName}`
//         );
//         setSecondSubcategories(response?.data?.data);
//       } catch (error) {
//         console.error("Error fetching second subcategories:", error);
//       }
//     }
//     if (formData?.subcategoryName) {
//       fetchSecondSubcategories();
//     }

//   }, [formData?.subcategoryName])

//   useEffect(() => {
//     if (formData?.categoryName) {
//       const filteredSubcategories = subcategories.filter(
//         (subcategory) => subcategory?.categoryName?._id === formData.categoryName
//       );
//       setFilteredSubcategories(filteredSubcategories);
//     }

//   }, [formData?.categoryName])



//   const categoriesList = categories.map((sub) => ({
//     value: sub._id,
//     label: sub.mainCategoryName,
//   }));

//   const subCategoryOptions = filteredSubcategories.map((sub) => ({
//     value: sub._id,
//     label: sub.subcategoryName,
//   }));

//   const secondSubcategoriesList = secondSubcategories.map((sub) => ({
//     value: sub._id,
//     label: sub.secondsubcategoryName,
//   }));

//   return (
//     <>
//       <ToastContainer />
//       <div className="bread">
//         <div className="head">
//           <h4>Edit Shop Banner</h4>
//         </div>
//         <div className="links">
//           <Link to="/all-banners" className="add-new">
//             Back <i className="fa-regular fa-circle-left"></i>
//           </Link>
//         </div>
//       </div>

//       <div className="d-form">
//         <form className="row g-3" onSubmit={handleSubmit}>
//           <div className="col-md-4">
//             <label className="form-label">Main Category Name</label>

//             <Select
//               options={categoriesList}
//               value={categoriesList.find(
//                 (opt) => opt.value === formData.categoryName
//               )}
//               onChange={(selected) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   categoryName: selected?.value || "",
//                   secondsubcategoryName: "",
//                   subcategoryName: "",
//                 }))
//               }
//               placeholder="Select Main category"
//               isSearchable
//               classNamePrefix="react-select"
//             />
//           </div>

//           <div className="col-md-4">
//             <label className="form-label">Sub Category</label>

//             <Select
//               options={subCategoryOptions}
//               value={subCategoryOptions.find(
//                 (opt) => opt.value === formData?.subcategoryName
//               )}
//               onChange={(selected) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   subcategoryName: selected?.value || "",
//                   secondsubcategoryName: "",
//                 }))
//               }
//               placeholder="Select sub category"
//               isSearchable
//               classNamePrefix="react-select"
//             />
//           </div>

//           <div className="col-md-4">
//             <label className="form-label">Child Category Name</label>
//             <Select
//               options={secondSubcategoriesList}
//               value={secondSubcategoriesList.find(
//                 (opt) => opt.value === formData.secondsubcategoryName
//               )}
//               disabled={!formData?.subcategoryName}
//               onChange={(selected) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   secondsubcategoryName: selected?.value || "",
//                 }))
//               }
//               placeholder="Select Child Category"
//               isSearchable
//               classNamePrefix="react-select"
//             />
//           </div>

//           <div className="col-md-6">
//             <label htmlFor="bannerName" className="form-label">
//               Banner Name
//             </label>
//             <input
//               type="text"
//               name="bannerName"
//               value={formData.bannerName}
//               onChange={handleChange}
//               className="form-control"
//               id="bannerName"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <label htmlFor="bannerImage" className="form-label">
//               Shop Banner Image {formData?.bannerType === "Desktop" ? `(1270 x 342) PX` : formData?.bannerType === "Both" ? `(1270 x 342) OR (1270 x 342) PX` : `(390 x 104) PX`}
//             </label>
//             <input type="file" name="bannerImage" className="form-control" id="bannerImage" onChange={handleImageChange} />
//           </div>
//           <div className="col-md-6">
//             {previewImage && (
//               <img
//                 src={previewImage}
//                 alt="Banner Preview"
//                 style={{ width: "100px", height: "100px" }}
//               />
//             )}
//           </div>
//           <div className="col-md-6">
//             <label htmlFor="bannerType" className="form-label">
//               Banner Type
//             </label>
//             <select
//               name="bannerType"
//               className="form-select"
//               id="bannerType"
//               value={formData.bannerType}
//               onChange={handleChange}
//               required
//             >
//               <option value="" selected disabled>
//                 Select Banner Type
//               </option>
//               <option value="Desktop">Desktop</option>
//               <option value="Mobile">Mobile</option>
//               <option value="Both">Both</option>
//             </select>
//           </div>
//           <div className="col-12">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 name="bannerStatus"
//                 id="bannerStatus"
//                 checked={formData.bannerStatus}
//                 onChange={handleChange}
//               />
//               <label className="form-check-label" htmlFor="bannerStatus">
//                 Active
//               </label>
//             </div>
//           </div>
//           <div className="col-12 text-center">
//             <button
//               type="submit"
//               disabled={btnLoading}
//               className={`btn ${btnLoading ? "not-allowed" : "allowed"}`}
//             >
//               {btnLoading ? "Please Wait..." : "Update Banner"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default EditBanner;

import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

// const BASE_URL = 'http://localhost:7000';
const BASE_URL = "http://localhost:7000";

const BANNER_TYPE_HINTS = {
  Desktop: "(1270 x 342) PX",
  Mobile: "(390 x 104) PX",
  Both: "(1270 x 342) PX Desktop / (390 x 104) PX Mobile",
};

const INITIAL_FORM = {
  bannerName: "",
  bannerImage: null,
  bannerType: "Both",
  bannerStatus: false,
  categoryName: "",
  subcategoryName: "",
  secondsubcategoryName: "",
};

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [previewImage, setPreviewImage] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [secondSubcategories, setSecondSubcategories] = useState([]);

  // ── 1. Fetch dropdown master data ──────────────────────────────────────────
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, subRes, secondSubRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/get-main-category`),
          axios.get(`${BASE_URL}/api/get-subcategory`),
          axios.get(`${BASE_URL}/api/second-sub-category/get-second-sub-category`),
        ]);
        setCategories(catRes.data?.data || []);
        setSubcategories(subRes.data?.data || []);
        setSecondSubcategories(secondSubRes.data?.data || []);
      } catch {
        toast.error("Error fetching dropdown data");
      }
    };
    fetchMasterData();
  }, []);

  // ── 2. Fetch banner data ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setPageLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/get-single-banner/${id}`);
        const banner = data.data;
        console.log("banner==>banner==>banner==>", banner);
        setFormData({
          bannerName: banner.bannerName || "",
          bannerImage: null,
          bannerType: banner.bannerType || "Both",
          bannerStatus: banner.bannerStatus === "True",
          categoryName: banner?.categoryName || "",
          subcategoryName: banner?.subcategoryName || "",
          secondsubcategoryName: banner?.secondsubcategoryName || "",
        });
        setPreviewImage(`${BASE_URL}/${banner.bannerImage}`);
      } catch {
        toast.error("Failed to load banner data");
      } finally {
        setPageLoading(false);
      }
    };
    fetchBannerData();
  }, [id]);

  // ── 3. Filter subcategories when category changes ─────────────────────────
  useEffect(() => {
    if (formData.categoryName) {
      const filtered = subcategories.filter(
        (sub) => sub?.categoryName?._id === formData.categoryName
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryName, subcategories]);

  // ── 4. Fetch second subcategories when subcategory changes ────────────────
  useEffect(() => {
    if (!formData.subcategoryName) return;

    const fetchSecondSub = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/second-sub-category/get-second-subcategory-by-subcategory/${formData.subcategoryName}`
        );
        setSecondSubcategories(data?.data || []);
      } catch {
        toast.error("Error fetching child categories");
      }
    };
    fetchSecondSub();
  }, [formData.subcategoryName]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, bannerImage: file }));
    setPreviewImage(URL.createObjectURL(file));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.bannerName.trim()) return toast.error("Banner name is required");
    if (!formData.bannerType) return toast.error("Banner type is required");
    if (!formData.categoryName) return toast.error("Please select a category");
    if (!formData.subcategoryName) return toast.error("Please select a subcategory");
    if (!formData.secondsubcategoryName) return toast.error("Please select a child category");

    const submitData = new FormData();
    submitData.append("bannerName", formData.bannerName);
    submitData.append("bannerType", formData.bannerType);
    submitData.append("bannerStatus", formData.bannerStatus ? "True" : "False");
    submitData.append("categoryName", formData.categoryName);
    submitData.append("subcategoryName", formData.subcategoryName);
    submitData.append("secondsubcategoryName", formData.secondsubcategoryName);
    if (formData.bannerImage) submitData.append("bannerImage", formData.bannerImage);

    try {
      setBtnLoading(true);
      const response = await axios.put(
        `${BASE_URL}/api/update-banner/${id}`,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        toast.success("Banner updated successfully");
        setTimeout(() => navigate("/all-banners"), 1500);
      }
    } catch {
      toast.error("Failed to update banner");
    } finally {
      setBtnLoading(false);
    }
  };

  // ── Select options ─────────────────────────────────────────────────────────
  const categoriesList = categories.map((cat) => ({
    value: cat._id,
    label: cat.mainCategoryName,
  }));

  const subCategoryOptions = filteredSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.subcategoryName,
  }));

  const secondSubcategoriesList = secondSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.secondsubcategoryName,
  }));

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Shop Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-banners" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* Main Category */}
          <div className="col-md-4">
            <label className="form-label">Main Category <span className="text-danger">*</span></label>
            <Select
              options={categoriesList}
              value={categoriesList.find((opt) => opt.value === formData.categoryName) || null}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryName: selected?.value || "",
                  subcategoryName: "",
                  secondsubcategoryName: "",
                }))
              }
              placeholder="Select Main Category"
              isSearchable
              isClearable
              classNamePrefix="react-select"
            />
          </div>

          {/* Sub Category */}
          <div className="col-md-4">
            <label className="form-label">Sub Category <span className="text-danger">*</span></label>
            <Select
              options={subCategoryOptions}
              value={subCategoryOptions.find((opt) => opt.value === formData.subcategoryName) || null}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  subcategoryName: selected?.value || "",
                  secondsubcategoryName: "",
                }))
              }
              placeholder="Select Sub Category"
              isSearchable
              isClearable
              isDisabled={!formData.categoryName}
              classNamePrefix="react-select"
            />
          </div>

          {/* Child Category */}
          <div className="col-md-4">
            <label className="form-label">Child Category <span className="text-danger">*</span></label>
            <Select
              options={secondSubcategoriesList}
              value={secondSubcategoriesList.find((opt) => opt.value === formData.secondsubcategoryName) || null}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  secondsubcategoryName: selected?.value || "",
                }))
              }
              placeholder="Select Child Category"
              isSearchable
              isClearable
              isDisabled={!formData.subcategoryName}
              classNamePrefix="react-select"
            />
          </div>

          {/* Banner Name */}
          <div className="col-md-4">
            <label htmlFor="bannerName" className="form-label">
              Banner Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="bannerName"
              value={formData.bannerName}
              onChange={handleChange}
              className="form-control"
              id="bannerName"
              placeholder="Enter banner name"
              required
            />
          </div>

          {/* Banner Type */}
          <div className="col-md-4">
            <label htmlFor="bannerType" className="form-label">
              Banner Type <span className="text-danger">*</span>
            </label>
            <select
              name="bannerType"
              className="form-select"
              id="bannerType"
              value={formData.bannerType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Banner Type</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Banner Image */}
          <div className="col-md-4">
            <label htmlFor="bannerImage" className="form-label">
              Banner Image{" "}
              <small className="text-muted">
                {BANNER_TYPE_HINTS[formData.bannerType] || ""}
              </small>
            </label>
            <input
              type="file"
              name="bannerImage"
              className="form-control"
              id="bannerImage"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Image Preview */}
          <div className="col-md-6 d-flex align-items-end">
            {previewImage && (
              <img
                src={previewImage}
                alt="Banner Preview"
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                }}
              />
            )}
          </div>

          {/* Active Status */}
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="bannerStatus"
                id="bannerStatus"
                checked={formData.bannerStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="bannerStatus">
                Active
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={btnLoading}
              className={`btn ${btnLoading ? "not-allowed" : "allowed"}`}
            >
              {btnLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Please Wait...
                </>
              ) : (
                "Update Banner"
              )}
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default EditBanner;