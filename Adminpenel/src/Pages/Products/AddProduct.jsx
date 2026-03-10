import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from 'jodit-react';
import Select from "react-select";



const AddProduct = () => {
  const navigate = useNavigate()
  const editor = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    recommendedProductId: [],
    categoryName: "",
    subcategoryName: "",
    secondsubcategoryName: "",
    parentProductId: "",
    productName: "",
    productDescription: "",
    BestSellingProduct: 0,
    FeaturedProducts: 0,
    ActiveonFlavours: 0,
    NameOnCake: 0,
    deliveryTo60Min: 0,
    ActiveonDeliveryDate: 0,
    eggless: 0,
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
  const [parentProduct, setParentProduct] = useState([])
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [secondSubcategories, setSecondSubcategories] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [weights, setWeights] = useState([]);
  // State to store filtered subcategories
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const categoriesList = categories.map((sub) => ({
    value: sub._id,
    label: sub.mainCategoryName,
  }));

  const subcategoriesList = filteredSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.subcategoryName,
  }));
  const secondSubcategoriesList = secondSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.secondsubcategoryName,
  }));
  const recommendedProductsList = recommendedProducts.map((sub) => ({
    value: sub._id,
    label: sub?.name || sub?.productName,
  }));

  const parentProductList = parentProduct.map((sub) => ({
    value: sub._id,
    label: sub?.parentProductName,
  }));

  // Fetch product details and dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dynamic data
        const categoryResponse = await axios.get(
          "https://api.cakenpetals.com/api/get-main-category"
        );
        const subcategoryResponse = await axios.get(
          "https://api.cakenpetals.com/api/get-subcategory"
        );

        const weightResponse = await axios.get(
          "https://api.cakenpetals.com/api/get-size"
        );
        const RecommendedProductResponse = await axios.get(
          "https://api.cakenpetals.com/api/recommended-product/all-product"
        );
        const response = await axios.get(
          "https://api.cakenpetals.com/api/parent-product/get-parent-product"
        );
        setCategories(categoryResponse.data.data);
        setSubcategories(subcategoryResponse.data.data);
        setWeights(weightResponse.data.data);
        setRecommendedProducts(RecommendedProductResponse.data.data);
        setParentProduct(response.data.data)
        // Fetch product details
        // const productResponse = await axios.get(
        //     `https://api.cakenpetals.com/api/get-single-product/${id}`
        // );
        // const productData = productResponse.data.data;
        // // console.log("XXXXX::=>", productData);
        // setFormData({
        //     ...productData,
        //     ActiveonHome: productData?.ActiveonHome === true ? 1 : 0,
        //     FeaturedProducts: productData?.FeaturedProducts === true ? 1 : 0 || 0,
        //     BestSellingProduct: productData?.BestSellingProduct === true ? 1 : 0 || 0,
        //     eggless: productData?.eggless === true ? 1 : 0 || 0,
        //     categoryName: productData.categoryName ? productData.categoryName?._id : "",
        //     subcategoryName: productData.subcategoryName ? productData?.subcategoryName?._id : "",
        //     secondsubcategoryName: productData?.secondsubcategoryName ? productData?.secondsubcategoryName?._id : "",
        //     Variant: productData.Variant || [],
        //     recommendedProductId: productData.recommendedProductId.map((item) => item._id) || [],

        //     productImage: [], // Reset images for new uploads
        // });

      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Error loading data!");
      }
    };

    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "recommendedproduct") {
      // prevent duplicates
      if (!formData?.recommendedProductId?.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          recommendedProductId: [...prev.recommendedProductId, value],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // If categoryName changes, filter subcategories
    if (name === 'categoryName') {
      const filteredSubcategories = subcategories.filter(
        (subcategory) => subcategory.categoryName?._id === value
      );
      setFilteredSubcategories(filteredSubcategories);
    }
  };

  const handleChangeRecommendedProduct = (value) => {
    if (!formData?.recommendedProductId?.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        recommendedProductId: [...prev.recommendedProductId, value],
      }));
    }
  }


  // Handle file change for images
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      productImage: e.target.files,
    });
  };

  // Update formData when editor content changes
  const handleEditorChange = (newContent) => {
    setFormData({ ...formData, productDescription: newContent });
  };

  const handleEditorChange2 = (newContent) => {
    setFormData({ ...formData, productDetails: newContent });
  };


  // Handle variant change
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target; // Get the field name and value
    const updatedVariants = [...formData.Variant]; // Clone the variants array

    // Update the specific field of the variant
    updatedVariants[index][name] = value;

    // Automatically calculate finalPrice when price or discountPrice changes
    if (name === 'price' || name === 'discountPrice') {
      const price = parseFloat(updatedVariants[index].price) || 0;
      const discount = parseFloat(updatedVariants[index].discountPrice) || 0;

      updatedVariants[index].finalPrice = price - (price * (discount / 100));
    }

    setFormData({
      ...formData,
      Variant: updatedVariants, // Update the state
    });
  };

  // Add new variant
  const handleAddVariant = () => {
    setFormData({
      ...formData,
      Variant: [
        ...formData.Variant,
        {
          weight: "",
          flover: "",
          price: "",
          discountPrice: "",
          finalPrice: "",
          stock: "",
          eggLess: false,
        },
      ],
    });
  };

  // Remove variant
  const handleRemoveVariant = (index) => {
    const updatedVariants = formData.Variant.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      Variant: updatedVariants,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!formData.categoryName) {
    //   toast.error("Please select a category");
    //   return;
    // }
    // if (!formData.subcategoryName) {
    //   toast.error("Please select a subcategory");
    //   return;
    // }
    // if (!formData.secondsubcategoryName) {
    //   toast.error("Please select a second subcategory");
    //   return;
    // }
    if (!formData.productName) {
      toast.error("Please enter a product name");
      return;
    }
    setIsLoading(true);

    const form = new FormData();
    form.append("categoryName", formData.categoryName);
    form.append("subcategoryName", formData.subcategoryName);
    form.append("secondsubcategoryName", formData.secondsubcategoryName);
    form.append("parentProductId", formData.parentProductId);
    form.append("productName", formData.productName);
    form.append("productDescription", formData.productDescription);
    form.append("productDetails", formData.productDetails);
    form.append("ActiveonHome", formData.ActiveonHome || 0);
    form.append("ActiveonFlavours", formData?.ActiveonFlavours || 0);
    form.append("NameOnCake", formData?.NameOnCake || 0);
    form.append("FeaturedProducts", formData.FeaturedProducts || 0);
    form.append("ActiveonDeliveryDate", formData?.ActiveonDeliveryDate || 0);
    form.append("BestSellingProduct", formData?.BestSellingProduct || 0);
    form.append("deliveryTo60Min", formData?.deliveryTo60Min || 0);
    form.append("eggless", formData?.eggless);
    form.append("recommendedProductId", JSON.stringify(formData.recommendedProductId));
    // Append variants
    form.append("Variant", JSON.stringify(formData.Variant));

    // if (formData.productImage[0]) {
    //   form.append("productImage", formData.productImage[0])
    // }

    // Append new images
    for (let i = 0; i < formData.productImage.length; i++) {
      form.append("productImage", formData.productImage[i]);
    }

    try {
      await axios.post(`https://api.cakenpetals.com/api/create-product`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product Added successfully!");
      navigate("/all-products")
    } catch (err) {
      console.log(err)
      // toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchSecondSubcategories();
  }, [formData?.subcategoryName])

  useEffect(() => {
    if (formData?.categoryName) {
      const filteredSubcategories = subcategories.filter(
        (subcategory) => subcategory.categoryName?._id === formData.categoryName
      );
      setFilteredSubcategories(filteredSubcategories);
    }
  }, [formData?.categoryName])

  const handleRemoveProduct = (id) => {
    setFormData((prev) => ({
      ...prev,
      recommendedProductId: prev.recommendedProductId.filter(
        (item) => item !== id
      ),
    }));
  };

  console.log("formData::=>", formData)
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* <div className="col-md-4">
            <label className="form-label">Mani Category Name</label>

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
          </div> */}

          {/* <div className="col-md-4">
            <label className="form-label">Sub Category Name</label>

            <Select
              options={subcategoriesList}
              value={subcategoriesList.find(
                (opt) => opt.value === formData?.subcategoryName
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  subcategoryName: selected?.value || "",
                  secondsubcategoryName: "",
                }))
              }
              placeholder="Select Sub Category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div> */}

          {/* <div className="col-md-4">
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
          </div> */}

          <div className="col-md-4">
            <label htmlFor="productName" className="form-label">Product Name<sup className="text-danger">*</sup></label>
            <input type="text" name='productName' className="form-control" id="productName" value={formData?.productName} onChange={handleChange} required />
          </div>

          {/* <div className="col-md-6">
            <label className="form-label">
              Recommended Product Name <sup className="text-danger">*</sup>
            </label>

            <select
              name="recommendedproduct"
              className="form-select"
              onChange={handleChange}
            >
              <option value="">Select Recommended Product</option>
              {recommendedProducts?.map((item) => (
                <option key={item?._id} value={item?._id}>
                  {item?.name || item?.productName}
                </option>
              ))}
            </select>

            <div className="mt-2 row g-2">
              {formData?.recommendedProductId?.map((id) => {
                const product = recommendedProducts?.find(p => p?._id === id);
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
          </div> */}

          <div className="col-md-4">
            <label className="form-label">Parent Product Name</label>

            <Select
              options={parentProductList}
              value={parentProductList.find((opt) => opt.value === formData.parentProductId)}

              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, parentProductId: selected?.value || "", }))
              }
              placeholder="Select Parent Product"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Recommended Product</label>

            <Select
              options={recommendedProductsList}
              value={recommendedProductsList.find(
                (opt) => opt.value === formData?.recommendedProductId
              )}
              onChange={(selected) => handleChangeRecommendedProduct(selected?.value)}
              placeholder="Select Recommended Product"
              isSearchable
              classNamePrefix="react-select"
            />

            <div className="mt-2 row g-2">
              {formData?.recommendedProductId?.map((id) => {
                const product = recommendedProducts?.find(p => p?._id === id);
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

          <div className="col-md-12">
            <label htmlFor="productDescription" className="form-label">Product Description<sup className="text-danger">*</sup></label>
            {/* <textarea name='productDescription' rows={6} className="form-control" id="productDescription" value={formData.productDescription} onChange={handleChange} required /> */}
            <JoditEditor
              ref={editor}
              value={formData.productDescription}
              onChange={handleEditorChange}
              placeholder="Enter Product Description here..."
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="productDetails" className="form-label">Product Details<sup className="text-danger">*</sup></label>
            {/* <textarea name='productDescription' rows={6} className="form-control" id="productDescription" value={formData.productDescription} onChange={handleChange} required /> */}
            <JoditEditor
              ref={editor}
              value={formData.productDetails}
              onChange={handleEditorChange2}
              placeholder="Enter Product Details here..."
            />
          </div>

          <div className="col-md-8">
            <label htmlFor="productImage" className="form-label">Product Images<sup className="text-danger">*</sup></label>
            <input type="file" className="form-control" id="productImage" name="productImage" multiple onChange={handleFileChange} />
          </div>

          {/* Variant Fields */}
          <div className="col-md-12">
            {/* <label className="form-label">Product Variants<sup className="text-danger">*</sup></label> */}
            {formData.Variant.map((variant, index) => (
              <div key={index} className="variant-container">
                <div className="row">
                  {/* flavour */}
                  {/* <div className="col-md-3 mb-1">
                    <label htmlFor={`weight-${index}`} className="form-label">Weight/Sizes<sup className="text-danger">*</sup></label>
                    <select
                      name="weight"
                      className="form-select"
                      id={`weight-${index}`}
                      value={variant.weight} // Link to the specific variant's weight
                      onChange={(e) => handleVariantChange(index, e)}
                    >
                      <option value="" disabled>Select Weight</option>
                      {weights.map((item) => (
                        <option key={item?._id} value={item?._id}>
                          {item.sizeweight}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="col-md-3 mb-1">
                    <label htmlFor={`weight-${index}`} className="form-label">Weight/Size<sup className="text-danger">*</sup></label>
                    <input
                      type="text"
                      name="weight"
                      className="form-control"
                      value={variant.weight}
                      onChange={(e) => handleVariantChange(index, e)}
                    />
                  </div>

                  {/* <div className="col-md-3 mb-1">
                    <label htmlFor={`flavour-${index}`} className="form-label">Flavours<sup className="text-danger">*</sup></label>
                    <input type="text" name="flavour" className="form-control" value={variant.flavour} onChange={(e) => handleVariantChange(index, e)} />
                  </div> */}

                  <div className="col-md-3">
                    <label htmlFor={`price-${index}`} className="form-label">Price<sup className="text-danger">*</sup></label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, e)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor={`discountPrice-${index}`} className="form-label">Discount<sup className="text-danger">*</sup></label>
                    <input
                      type="number"
                      name="discountPrice"
                      className="form-control"
                      value={variant.discountPrice}
                      onChange={(e) => handleVariantChange(index, e)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor={`finalPrice-${index}`} className="form-label">Final Price<sup className='text-danger'>*</sup></label>
                    <input
                      type="number"
                      name="finalPrice"
                      className="form-control"
                      value={variant.finalPrice}
                      readOnly // Make the field read-only
                    />
                  </div>
                </div>

                <button type="button" className="btn btn-danger mt-2" onClick={() => handleRemoveVariant(index)}>Remove Variant</button>
              </div>
            ))}
            <button type="button" className="btn btn-primary mt-2" onClick={handleAddVariant}>Add Variant</button>
          </div>

          <div className="col-md-12" style={{ marginLeft: '10px' }}>
            <div className="row align-items-center">
              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="ActiveonHome"
                  className="form-check-input me-2"
                  checked={formData.ActiveonHome === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ActiveonHome: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Active on Home</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="BestSellingProduct"
                  className="form-check-input me-2"
                  checked={formData.BestSellingProduct === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, BestSellingProduct: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Best Selling Product</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="FeaturedProducts"
                  className="form-check-input me-2"
                  checked={formData.FeaturedProducts === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, FeaturedProducts: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Featured Products</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="deliveryTo60Min"
                  className="form-check-input me-2"
                  checked={formData.deliveryTo60Min === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryTo60Min: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label"> 30 - 60 mins delivery</label>
              </div>

            </div>
          </div>

          <div className="col-md-12" style={{ marginLeft: '10px' }}>
            <div className="row align-items-center">
              <label htmlFor={`For cakes`} className="form-label" style={{ fontWeight: 'bold' }}>For Cakes Only<sup className="text-danger">*</sup></label>


              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="ActiveonFlavours"
                  className="form-check-input me-2"
                  checked={formData.ActiveonFlavours === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ActiveonFlavours: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Active on Flavours</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="NameOnCake"
                  className="form-check-input me-2"
                  checked={formData.NameOnCake === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, NameOnCake: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Name On Cake</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="ActiveonDeliveryDate"
                  className="form-check-input me-2"
                  checked={formData.ActiveonDeliveryDate === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ActiveonDeliveryDate: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Active On Delivery Date</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="eggless"
                  className="form-check-input me-2"
                  checked={formData.eggless === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, eggless: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">100% Eggless</label>
              </div>
            </div>
          </div>

          <div className="col-md-12 text-center">
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
