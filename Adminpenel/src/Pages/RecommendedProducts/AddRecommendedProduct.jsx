import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import Select from "react-select";

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    recommendedCategoryName: "",
    productName: "",
    ActiveonHome: 0,
    price: "",
    productImage: [],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          "https://api.cakenpetals.com/api/recommended-category/get-recommended-category"
        );

        setCategories(categoryResponse.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Error loading data!");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      productImage: e.target.files,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData();
    form.append("recommendedCategoryName", formData.recommendedCategoryName);
    form.append("productName", formData.productName);
    form.append("price", formData.price);
    form.append("ActiveonHome", formData.ActiveonHome);
    // Append images to FormData
    for (let i = 0; i < formData.productImage.length; i++) {
      form.append("productImage", formData.productImage[i]);
    }

    try {
      await axios.post("https://api.cakenpetals.com/api/recommended-product/create-product", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      navigate("/all-recommended-products");
    } catch (err) {
      console.log(err);
      // toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categoriesList = categories.map((sub) => ({
    value: sub._id,
    label: sub.name,
  }));
  console.log("SSS::=>", formData);
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Recommended Product</h4>
        </div>
        <div className="links">
          <Link to="/all-recommended-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* <div className="col-md-4">
            <label htmlFor="recommendedCategoryName" className="form-label">
              Recommended Category Name<sup className="text-danger">*</sup>
            </label>
            <select
              name="recommendedCategoryName"
              className="form-select"
              id="recommendedCategoryName"
              value={formData.recommendedCategoryName}
              onChange={handleChange}
              required
            >
              <option value="">Select recommended Category Name</option>
              {categories.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="col-md-4">
            <label className="form-label">Select recommended Category Name</label>

            <Select
              options={categoriesList}
              value={categoriesList.find(
                (opt) => opt.value === formData.recommendedCategoryName
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  recommendedCategoryName: selected?.value || "",
                }))
              }
              placeholder="Select recommended Category Name"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="productName" className="form-label">
              Recommended Product Name<sup className="text-danger">*</sup>
            </label>
            <input
              type="text"
              name="productName"
              className="form-control"
              id="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Product Name"
            />
          </div>

          <div className="col-md-4">
            <label
              htmlFor={`price`}
              className="form-label"
            >
              Price<sup className="text-danger">*</sup>
            </label>
            <input
              type="number"
              name="price"
              className="form-control"
              id={`price`}
              placeholder="Price"
              value={formData?.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="productImage" className="form-label">
              Recommended Product Image (140 X 140 ) PX<sup className="text-danger">*</sup>
            </label>
            <input
              type="file"
              name="productImage"
              className="form-control"
              id="productImage"
              multiple
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
