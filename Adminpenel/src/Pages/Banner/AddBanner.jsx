import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

const AddBanner = () => {
    const [formData, setFormData] = useState({ bannerName: '', bannerImage: null, bannerType: 'Both', bannerStatus: false, });
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [secondSubcategories, setSecondSubcategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            bannerImage: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.bannerName || !formData.bannerImage || !formData.bannerType) {
            toast.error("All fields are required");
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
        const submitData = new FormData();
        submitData.append('bannerName', formData.bannerName);
        submitData.append('bannerImage', formData.bannerImage);
        submitData.append('bannerType', formData.bannerType);
        submitData.append('bannerStatus', formData.bannerStatus ? "True" : "False");
        submitData.append("categoryName", formData.categoryName);
        submitData.append("subcategoryName", formData.subcategoryName);
        submitData.append("secondsubcategoryName", formData.secondsubcategoryName);

        try {
            setIsLoading(true);
            const response = await axios.post('https://api.cakenpetals.com/api/create-banner', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // //console.log(response)
            if (response.status === 201) {
                toast.success("Banner added successfully");
                navigate('/all-banners');
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            toast.error("Failed to add banner");
        } finally {
            setIsLoading(false);
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


    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Shop Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
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
                    <div className="col-md-6">
                        <label htmlFor="bannerName" className="form-label">Shop Banner Name</label>
                        <input type="text" name="bannerName" value={formData.bannerName} onChange={handleChange} className="form-control" id="bannerName" required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bannerImage" className="form-label">
                            Shop Banner Image {formData?.bannerType === "Desktop" ? `(1270 x 342) PX` : formData?.bannerType === "Both" ? `(1270 x 342) OR (1270 x 342) PX` : `(390 x 104) PX`}
                        </label>
                        <input type="file" name="bannerImage" className="form-control" id="bannerImage" onChange={handleImageChange} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bannerType" className="form-label">Banner Type</label>
                        <select name="bannerType" className="form-select" id="bannerType" value={formData.bannerType} onChange={handleChange} required>
                            <option value="" selected disabled>Select Banner Type</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="bannerStatus" id="bannerStatus" checked={formData.bannerStatus} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="bannerStatus">
                                Active
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? "Please Wait..." : "Add Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBanner;
