import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const EditSubCategory = () => {
  const { id } = useParams(); // Get the subcategory ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: "", // This will store the selected main category ID
    subcategoryName: "",
    ActiveonHome: false, // Added ActiveonHome field
    image: null, // Added image field
    banner: null,
    ActiveonHeader: false,
    privewImage: null,
    privewBanner: null
  });
  const [mainCategories, setMainCategories] = useState([]); // For storing fetched categories
  const [isLoading, setIsLoading] = useState(false);

  // Fetch main categories and subcategory data
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakenpetals.com/api/get-main-category"
        ); // Adjust the URL to your API endpoint
        setMainCategories(response.data.data); // Assuming the response structure
      } catch (error) {
        toast.error("Error fetching main categories");
        console.error("Error fetching main categories:", error);
      }
    };

    const fetchSubCategory = async () => {
      try {
        const response = await axios.get(
          `https://api.cakenpetals.com/api/get-single-subcategory/${id}`
        );
        const { categoryName, subcategoryName, ActiveonHome, image, banner, ActiveonHeader } = response.data.data;
        console.log("XXXXXXXXXXX:=>", response.data.data)
        setFormData({
          categoryName: categoryName?._id || categoryName, // Use `_id` if `categoryName` is an object
          subcategoryName,
          ActiveonHome: ActiveonHome || false, // Set ActiveonHome from fetched data
          ActiveonHeader: ActiveonHeader || false,
          image: null, // Do not pre-fill the image field (user must re-upload if they want to change it)
          banner: null,
          privewImage: image,
          privewBanner: banner
        });
      } catch (error) {
        toast.error("Error fetching subcategory data");
        console.error("Error fetching subcategory:", error);
      }
    };
    fetchMainCategories();
    fetchSubCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle file input separately
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] })); // Store the selected file
    }
    // Handle checkbox (ActiveonHome) separately
    else if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    }
    // Handle other inputs
    else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.categoryName || !formData.subcategoryName) {
      toast.error("Category Name and Subcategory Name are required");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append("subcategoryName", formData.subcategoryName);
      formDataToSend.append("ActiveonHome", formData.ActiveonHome);
      formDataToSend.append("ActiveonHeader", formData.ActiveonHeader);
      if (formData.image) {
        formDataToSend.append("image", formData.image); // Append the image file if it exists
      }
      if (formData.banner) {
        formDataToSend.append("banner", formData.banner); // Append the image file if it exists
      }

      // Send the request
      const response = await axios.put(
        `https://api.cakenpetals.com/api/update-subcategory/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      toast.success(response.data.message);
      navigate("/all-subcategory");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating subcategory"
      );
      console.error("Error updating subcategory:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("XXXXXXXXXXX:=>", formData)
  const mainCategoryOptions = mainCategories.map((sub) => ({
    value: sub._id,
    label: sub.mainCategoryName,
  }));
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Subcategory</h4>
        </div>
        <div className="links">
          <Link to="/all-subcategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* <div className="col-md-6">
            <label htmlFor="categoryName" className="form-label">
              Select Main Category
            </label>
            <select
              name="categoryName"
              className="form-control select-arrow"
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {mainCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.mainCategoryName}
                </option>
              ))}
            </select>
          </div> */}
          <div className="col-md-4">
            <label className="form-label">Select Main Category</label>

            <Select
              options={mainCategoryOptions}
              value={mainCategoryOptions.find(
                (opt) => opt.value === formData?.categoryName
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryName: selected?.value || "",
                }))
              }
              placeholder="Select Main category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="subcategoryName" className="form-label">
              Sub Category Name
            </label>
            <input
              type="text"
              name="subcategoryName"
              className="form-control"
              id="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="col-md-6">
            <label htmlFor="banner" className="form-label">
              Sub Category Banner (1150x310)PX
            </label>
            <input
              type="file"
              name="banner"
              className="form-control"
              id="banner"
              onChange={handleChange}
            />

            {formData?.privewBanner && (
              <img
                src={`https://api.cakenpetals.com/${formData?.privewBanner}`}
                alt="banner"
                className="mt-2 rounded shadow"
                style={{ width: "200px" }}
              />
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="image" className="form-label">
              Sub Category Image (140x140)PX
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              id="image"
              onChange={handleChange}
            />
            {formData?.privewImage && (
              <img
                src={`https://api.cakenpetals.com/${formData?.privewImage}`}
                alt="image"
                className="mt-2 rounded shadow"
                style={{ width: "120px" }}
              />
            )}
          </div> */}

          <div className="col-md-6">
            <label htmlFor="ActiveonHome" className="form-label">
              Display on Homepage
            </label>
            {/* <div className="form-check">
              <input
                type="checkbox"
                name="ActiveonHome"
                className="form-check-input"
                id="ActiveonHome"
                checked={formData.ActiveonHome}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="ActiveonHome">
                Active on Homepage
              </label>
            </div> */}

            <div className="col-md-6">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="ActiveonHeader"
                  className="form-check-input"
                  checked={formData?.ActiveonHeader}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ActiveonHeader: e.target.checked ? true : false,
                    })
                  }
                />
                <label className="form-label">Active on Header</label>
              </div>
            </div>
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Update Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSubCategory;