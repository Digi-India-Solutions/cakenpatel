import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from 'jodit-react';
import Select from "react-select";

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate()
    const editor = useRef(null);
    console.log(id);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: "",
        subcategoryName: "",
        secondsubcategoryName: "",
        productName: "",
        productDescription: "",
        Variant: [
            {
                weight: "",
                price: "",
                discountPrice: "",
                finalPrice: "",
                stock: "",
            },
        ],
        productImage: [],
    });

    // State to store dynamic data
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [secondSubcategories, setSecondSubcategories] = useState([]);
    const [weights, setWeights] = useState([]);
    // State to store filtered subcategories
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);



    // Fetch product details and dynamic data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch dynamic data
                const categoryResponse = await axios.get(
                    "https://api.cakenpetals.com/api/recommended-category/get-recommended-category"
                );

                setCategories(categoryResponse.data.data);

                // Fetch product details
                const productResponse = await axios.get(
                    `https://api.cakenpetals.com/api/recommended-product/get-product/${id}`
                );
                const productData = productResponse.data.data;
                console.log("XXXXX::=>", productData);
                setFormData({
                    ...productData,
                    ActiveonHome: productData?.ActiveonHome === true ? 1 : 0,
                    recommendedCategoryName: productData.recommendedCategoryName ? productData.recommendedCategoryName?._id : "",
                    productImage: [], // Reset images for new uploads
                });

            } catch (error) {
                console.error("Error fetching data", error);
                toast.error("Error loading data!");
            }
        };

        fetchData();
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value, });

    };


    // Handle file change for images
    const handleFileChange = (e) => {
        setFormData({ ...formData, productImage: e.target.files, });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const form = new FormData();
        form.append("recommendedCategoryName", formData.recommendedCategoryName);
        form.append("productName", formData.productName);
        form.append("price", formData.price);
        form.append("ActiveonHome", formData.ActiveonHome);
        // Append new images
        for (let i = 0; i < formData.productImage.length; i++) {
            form.append("productImage", formData.productImage[i]);
        }

        try {
            await axios.put(`https://api.cakenpetals.com/api/recommended-product/update-product/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Product updated successfully!");
            navigate("/all-recommended-products")
        } catch (err) {
            console.log(err)
            // toast.error(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const categoriesList = categories.map((sub) => ({
        value: sub._id,
        label: sub.name,
    }));

    // console.log("formData::=>", formData)
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Recommended Product</h4>
                </div>
                <div className="links">
                    <Link to="/all-recommended-products" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
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
                        <label htmlFor="productName" className="form-label">Product Name<sup className="text-danger">*</sup></label>
                        <input type="text" name='productName' className="form-control" id="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor={`price`} className="form-label">Price<sup className="text-danger">*</sup></label>
                        <input type="number" name="price" className="form-control" id={`price`} placeholder="Price" value={formData?.price} onChange={handleChange} required />
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="productImage" className="form-label">Product Images<sup className="text-danger">*</sup></label>
                        <input type="file" className="form-control" id="productImage" name="productImage" multiple onChange={handleFileChange} />
                    </div>

                    {/* <div className="col-md-3">
                        <label className="form-label">Active on Home</label>
                        <input
                            type="checkbox"
                            name="ActiveonHome"
                            className="form-check-input"
                            checked={formData.ActiveonHome === 1}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    ActiveonHome: e.target.checked ? 1 : 0,
                                })
                            }
                        />
                    </div> */}
                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
