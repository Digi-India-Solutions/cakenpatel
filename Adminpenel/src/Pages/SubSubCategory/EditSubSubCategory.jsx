import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const EditSubSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productList, setProductList] = useState([])
  const [formData, setFormData] = useState({
    mainCategoryId: "",
    subCategoryId: "",
    secondsubcategoryName: "",
    ActiveonHome: false,
    ActiveonHeader: false,
    image: null,
    productId: [],
  });

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
        toast.error("Failed to load main categories");
      }
    };
    fetchMainCategories();
  }, []);
  /* ================= FETCH SUB-SUBCATEGORY ================= */
  useEffect(() => {
    const fetchSecondSubcategory = async () => {
      try {
        // alert("XXXXXXXX:=>")
        const res = await axios.get(`https://api.cakenpetals.com/api/second-sub-category/get-single-second-sub-category/${id}`);

        console.log("XXXXXX:=>XXXXXX:=>", res.data.data)
        const data = res.data.data;

        setFormData({
          mainCategoryId: data.mainCategoryId?._id || "",
          subCategoryId: data.subCategoryId?._id || "",
          secondsubcategoryName: data.secondsubcategoryName || "",
          secondName: data.secondName || "",
          ActiveonHome: data.ActiveonHome || false,
          ActiveonHeader: data.ActiveonHeader || false,
          productId: data?.productId.map((item) => item?._id) || [],
          image: null,
        });
      } catch {
        toast.error("Failed to load Child category");
      }
    };

    fetchSecondSubcategory();
  }, [id]);
  // console.log("XXXXXX:=>XXXXXX:=>", formData)
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
        toast.error("Failed to load subcategories");
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
      !formData.subCategoryId ||
      !formData.secondsubcategoryName
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("mainCategoryId", formData.mainCategoryId);
      fd.append("subCategoryId", formData.subCategoryId);
      fd.append("secondsubcategoryName", formData.secondsubcategoryName);
      fd.append("ActiveonHome", formData.ActiveonHome);
      fd.append('secondName', formData?.secondName);
      fd.append("ActiveonHeader", formData.ActiveonHeader);
      fd.append("productId", JSON.stringify(formData.productId));

      if (formData.image) {
        fd.append("image", formData.image);
      }

      const res = await axios.put(
        `https://api.cakenpetals.com/api/second-sub-category/update-second-sub-category/${id}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data?.message || "Sub-Subcategory updated");
      navigate("/all-sub-subcategory");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update sub-subcategory"
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
          <h4>Edit Child category</h4>
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
                  subCategoryId: "",
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
            <label className="form-label">Child category Name</label>
            <input
              type="text"
              name="secondsubcategoryName"
              className="form-control"
              value={formData.secondsubcategoryName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Select Product List</label>

            <Select
              options={productListOptions}
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
                name="ActiveonHome"
                className="form-check-input"
                checked={formData.ActiveonHome}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Homepage
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                name="ActiveonHeader"
                className="form-check-input"
                checked={formData?.ActiveonHeader}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Header
              </label>
            </div>

          </div>

          {formData?.ActiveonHome === true && <div className="col-md-4">
            <label className="form-label">Show on Home Page Name</label>
            <input type="text" name="secondName" className="form-control" value={formData?.secondName} onChange={handleChange} required />
          </div>}

          {/* IMAGE */}
          {formData?.ActiveonHome === true && <div className="col-md-4">
            <label className="form-label">Child category Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleChange}
            />
          </div>}

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Update Child category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSubSubCategory;
