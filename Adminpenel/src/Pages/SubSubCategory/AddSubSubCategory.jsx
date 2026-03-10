import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddSubSubCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /* ================= STATE ================= */
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productList, setProductList] = useState([])
  const [formData, setFormData] = useState({
    mainCategoryId: "",
    subCategoryId: "",
    secondSubCategoryName: "",
    activeOnHome: false,
    image: null,
    productId: [],
  });
  // console.log('formData.productId==>', productList);

  const productListOptions = productList.map((sub) => ({
    value: sub._id,
    label: `${sub?.productName} (${sub?.parentProductId?.parentProductName})` || sub?.productName,
  }));

  /* ================= FETCH PRODUCT LIST ================= */
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get(
          "https://api.cakenpetals.com/api/all-product"
        );
        //console.log(response);
        setProductList(response.data.data || []);
      } catch {
        toast.error("Failed to fetch main categories");
      }
    };

    fetchProductList();
  }, []);

  /* ================= FETCH MAIN CATEGORIES ================= */
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const res = await axios.get(
          "https://api.cakenpetals.com/api/get-main-category"
        );
        setMainCategories(res.data?.data || []);
      } catch {
        toast.error("Failed to fetch main categories");
      }
    };

    fetchMainCategories();
  }, []);

  /* ================= FETCH SUBCATEGORIES ================= */
  useEffect(() => {
    if (!formData.mainCategoryId) return;

    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/get-subcategory-by-maincategory/${formData.mainCategoryId}`
        );
        setSubCategories(res.data?.data || []);
      } catch {
        toast.error("Failed to fetch subcategories");
      }
    };

    fetchSubCategories();
  }, [formData.mainCategoryId]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.mainCategoryId ||
      !formData.secondSubCategoryName
      // !formData.image
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData?.activeOnHome) {
      if (!formData.productId.length) {
        toast.error("Please select again product");
        return;
      }
      if (!formData.image) {
        toast.error("Please select again image");
        return;
      }
    }

    if (!formData.subCategoryId) {
      toast.error("Please select again subcategory");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("mainCategoryId", formData.mainCategoryId);
      fd.append("subCategoryId", formData.subCategoryId);
      fd.append("secondSubcategoryName", formData.secondSubCategoryName);
      fd.append('secondName', formData?.secondName)
      fd.append("ActiveonHeader", formData?.activeOnHeader);
      fd.append("ActiveonHome", formData?.activeOnHome);
      fd.append("productId", JSON.stringify(formData?.productId));

      fd.append("image", formData?.activeOnHome ? formData.image : null);

      const res = await axios.post(
        "https://api.cakenpetals.com/api/second-sub-category/create-second-sub-category",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data?.message || "Child category added");
      // navigate("/all-sub-subcategory");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create Child category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const mainCategoryOptions = mainCategories.map((sub) => ({
    value: sub._id,
    label: sub.mainCategoryName,
  }));

  const subCategoryOptions = subCategories.map((sub) => ({
    value: sub._id,
    label: sub.subcategoryName,
  }));

  const handleChangeProduct = (value) => {
    if (!formData?.productId?.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        productId: [...prev.productId, value],
      }));
    }
  }
  const handleRemoveProduct = (id) => {
    setFormData((prev) => ({
      ...prev,
      productId: prev.productId.filter(
        (item) => item !== id
      ),
    }));
  };
  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Add Child category</h4>
        </div>
        <div className="links">
          <Link to="/all-sub-subcategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* MAIN CATEGORY */}
          <div className="col-md-4">
            <label className="form-label">Select Main Category</label>

            <Select
              options={mainCategoryOptions}
              value={mainCategoryOptions.find(
                (opt) => opt.value === formData?.mainCategoryId
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  mainCategoryId: selected?.value || "",
                  subCategoryId: "", // reset subcategory
                }))
              }
              placeholder="Select Main category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          {/* SUB CATEGORY */}
          <div className="col-md-4">
            <label className="form-label">Select Sub Category</label>

            <Select
              options={subCategoryOptions}
              value={subCategoryOptions.find(
                (opt) => opt.value === formData?.subCategoryId
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  subCategoryId: selected?.value || "",
                }))
              }
              placeholder="Select Sub Category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          {/* SUB-SUBCATEGORY NAME */}
          <div className="col-md-4">
            <label className="form-label">Child Category Name</label>
            <input
              type="text"
              name="secondSubCategoryName"
              className="form-control"
              value={formData.secondSubCategoryName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Select Product List</label>

            <Select
              options={productListOptions}
              // value={productListOptions.find(
              //   (opt) => opt.value === formData?.productId
              // )}
              value={productListOptions.filter((opt) =>
                formData?.productId?.includes(opt?.value)
              )}
              onChange={(selected) => handleChangeProduct(selected?.value)}
              placeholder="Select Product"
              isSearchable
              classNamePrefix="react-select"
            />

            <div className="mt-2 row g-2">
              {formData?.productId?.map((id) => {
                const product = productList?.find(p => p?._id === id);
                if (!product) return null;

                return (
                  <div key={id} className="col-md-4">
                    <div className="d-flex justify-content-between align-items-center bg-light px-2 py-1 rounded">
                      <span className="text-truncate">
                        {product?.name || product?.productName}
                      </span>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => handleRemoveProduct(id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ACTIVE */}
          <div className="col-md-4">
            <label className="form-label">Display on Homepage</label>
            <div className="form-check">
              <input
                type="checkbox"
                name="activeOnHome"
                className="form-check-input"
                checked={formData?.activeOnHome}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Homepage
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                name="activeOnHeader"
                className="form-check-input"
                checked={formData?.activeOnHeader}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Header
              </label>
            </div>

          </div>

          {formData?.activeOnHome === true && <div className="col-md-4">
            <label className="form-label">Show on Home Page Name</label>
            <input type="text" name="secondName" className="form-control" value={formData?.secondName} onChange={handleChange} required />
          </div>}

          {/* IMAGE */}
          {formData?.activeOnHome === true && <div className="col-md-4">
            <label className="form-label">Child Category Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>}

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Child Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubSubCategory;
