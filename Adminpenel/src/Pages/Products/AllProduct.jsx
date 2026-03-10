import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))

  const hasAccessAdd = (module) => {
    return (
      AdminData?.role === "Admin" ||
      AdminData?.permissions?.[module]?.write === true
    );
  };

  const hasAccessDelete = (module) => {
    return (
      AdminData?.role === "Admin" ||
      AdminData?.permissions?.[module]?.delete === true
    );
  };

  const hasAccessEdit = (module) => {
    return (
      AdminData?.role === "Admin" ||
      AdminData?.permissions?.[module]?.update === true
    );
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://api.cakenpetals.com/api/all-product"
      );
      setIsLoading(false);
      console.log("XXXXXXXXXXXXXXXX==>", response.data.data);
      setProducts(response.data.data || []);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products!");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all products
  useEffect(() => {

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `https://api.cakenpetals.com/api/delete-product/${productId}`
        );
        setProducts(products.filter((product) => product._id !== productId));
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product!");
      }
    }
  };


  const handleCheckboxChange = async (type, e, productId) => {
    try {
      const response = await axios.post(`https://api.cakenpetals.com/api/change-status`, {
        isActive: e,
        type,
        productId: productId
      });

      if (response.status === 200) {
        fetchProducts();
        toast.success('Product status updated successfully');
      }
    } catch (error) {
      toast.error("Error updating product status");
      console.error("Error updating product status:", error);
    }
  }
  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("filteredProducts==>", filteredProducts)
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Product List</h4>
        </div>
        {hasAccessAdd('products') && <div className="links">
          <Link to="/add-product" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>}
      </div>

      <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search</label> &nbsp;
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>S no</th>
              {/* <th>Main Category</th> */}
              {/* <th>Sub Category</th> */}
              {/* <th>Child Category</th> */}
              <th>Images</th>
              <th>Product Name</th>
              <th>Active On Home</th>
              <th>Best Selling Product</th>
              <th>Featured Products</th>
              <th>30 - 60 mins delivery</th>
              {(hasAccessDelete('products') || hasAccessEdit('products')) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  {/* <td>{product.categoryName?.mainCategoryName || "N/A"}</td> */}
                  {/* <td>{product.subcategoryName?.subcategoryName || "N/A"}</td> */}
                  {/* <td>{product.secondsubcategoryName?.secondsubcategoryName || "N/A"}</td> */}
                  <td>
                    {product?.productImage?.map((image, imgIndex) => (
                      <img key={imgIndex} src={`https://api.cakenpetals.com/${image}`} alt="Product" style={{ width: "50px", marginRight: "5px" }} />
                    ))}
                  </td>
                  <td>{product.productName}</td>
                  <td>
                    <input type="checkbox" name="ActiveonHome" className="form-check-input me-2" checked={product?.ActiveonHome} onChange={(e) => handleCheckboxChange('ActiveonHome', e.target.checked, product._id)} />
                  </td>
                  <td>
                    <input type="checkbox" name="BestSellingProduct" className="form-check-input me-2" checked={product?.BestSellingProduct} onChange={(e) => handleCheckboxChange('BestSellingProduct', e.target.checked, product._id)} />
                  </td>
                  <td>
                    <input type="checkbox" name="FeaturedProducts" className="form-check-input me-2" checked={product?.FeaturedProducts} onChange={(e) => handleCheckboxChange('FeaturedProducts', e.target.checked, product._id)} />
                  </td>
                  <td>
                    <input type="checkbox" name="deliveryTo60Min" className="form-check-input me-2" checked={product?.deliveryTo60Min} onChange={(e) => handleCheckboxChange('deliveryTo60Min', e.target.checked, product._id)} />
                  </td>

                  <td>
                    {hasAccessEdit('products') && <Link
                      to={`/edit-product/${product._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>}
                    &nbsp;
                    {hasAccessDelete('products') && <button
                      onClick={() => handleDelete(product._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllProduct;
