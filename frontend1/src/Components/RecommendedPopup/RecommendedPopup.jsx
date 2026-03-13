import React, { useState, useEffect } from "react";
import "./recommendedPopup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const RecommendedPopup = ({
  open,
  onClose,
  productId,
  productData,
  activeWeight,
  price,
  massage,
  deliveryDate,
  eggOption,
  source
}) => {
  const loginvalue = sessionStorage.getItem("login");
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://api.cakenpetals.com/api/recommended-category/get-recommended-category"
        );
        if (res.status === 200 && res.data.data.length) {
          setCategory(res.data.data.filter((item) => item.ActiveonHome === true));
          setActiveCategory(res.data.data[0]._id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/recommended-product/get-product-by-category/${activeCategory}`
        );
        if (res.status === 200) setProduct(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  useEffect(() => {
    if (!open) return;

    const mainCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const mainProduct = mainCart.find(item => item.productId === productId);

    if (mainProduct?.addonProducts?.length) {
      const existingAddons = {};

      mainProduct.addonProducts.forEach(addon => {
        existingAddons[addon.productId] = addon.quantity;
      });

      setCart(existingAddons);
    } else {
      setCart({});
    }
  }, [open, productId]);

  if (!open) return null;

  const getMainProductIndex = (cart) => {
    return cart.findIndex(item => item.productId === productId);
  };

  const addItem = (id) => setCart((p) => ({ ...p, [id]: 1 }));

  const increment = (id) => setCart((p) => ({ ...p, [id]: p[id] + 1 }));

  const decrement = (id) => {
    setCart((p) => {
      if (p[id] === 1) {
        const copy = { ...p };
        delete copy[id];
        return copy;
      }
      return { ...p, [id]: p[id] - 1 };
    });
  };

  const handleContinue = () => {
    let mainCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    let mainIndex = getMainProductIndex(mainCart);

    // The product should already be in cart, but just in case
    if (mainIndex === -1) {
      // This shouldn't happen, but handle it just in case
      const newItem = {
        productId: productId,
        name: productData?.productName || "Main Product",
        weight: activeWeight,
        categoryId: productData?.categoryName?._id,
        price: price,
        massage: massage || "",
        quantity: 1,
        image: productData?.productImage?.[0],
        deliveryDate: deliveryDate || "",
        eggOption: eggOption || "",
        addonProducts: [],
      };
      mainCart.push(newItem);
      mainIndex = mainCart.length - 1;
    }

    const addonList = mainCart[mainIndex].addonProducts || [];

    // Add all selected recommended products to cart
    Object.entries(cart).forEach(([id, qty]) => {
      const prod = product.find(p => p._id === id);
      if (!prod) return;

      const existingAddonIndex = addonList.findIndex(a => a.productId === id);

      if (existingAddonIndex > -1) {
        addonList[existingAddonIndex].quantity += qty;
      } else {
        addonList.push({
          productId: id,
          name: prod.productName,
          price: prod.price,
          image: prod.productImage[0],
          quantity: qty,
        });
      }
    });

  mainCart[mainIndex].addonProducts = addonList;

  sessionStorage.setItem("cart", JSON.stringify(mainCart));

  // Dispatch event to notify other components
  window.dispatchEvent(new Event('storage'));

  onClose();

  // Show success message on CONTINUE
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Products added to cart successfully!",
    showConfirmButton: false,
    timer: 1500
  });

  if (source === "cart") {
    // Stay on the same page
    window.location.reload();
  } else {
    // Navigate to cart after a short delay to show the success message
    setTimeout(() => {
      navigate("/cart");
    }, 1500);
  }
};

// Add this function for the Skip button
const handleSkip = () => {
  onClose();

  // Show success message on SKIP
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Product added to cart successfully!",
    showConfirmButton: false,
    timer: 1500
  });

  if (source === "cart") {
    window.location.reload();
  } else {
    setTimeout(() => {
      navigate("/cart");
    }, 1500);
  }
};
return (
  <div className="rp-overlay">
    <div className="rp-container">

      <div className="rp-header">
        <h3>Add More Fun To Celebration</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="rp-categories">
        {category.map((cat) => {
          return (
            <div key={cat._id} style={{ gap: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="cat_image_">
                <img src={`https://api.cakenpetals.com/${cat?.image}`} alt={cat?.name} />
              </div>
              <button
                className={`rp-category ${activeCategory === cat._id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat._id)}
              >
                {cat.name}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rp-grid">
        {product.map((p) => (
          <div className="rp-card " key={p._id}>
            <img src={`https://api.cakenpetals.com/${p?.productImage[0]}`} alt={p?.productName} />
            <h6>{p.productName}</h6>
            <p>₹ {p.price}</p>

            {!cart[p._id] ? (
              <button className="rp-add-btn" onClick={() => addItem(p._id)}>
                Add
              </button>
            ) : (
              <div className="rp-qty">
                <button onClick={() => decrement(p._id)}>−</button>
                <span>{cart[p._id]}</span>
                <button onClick={() => increment(p._id)}>+</button>
              </div>
            )}
          </div>
        ))}

        {product.length === 0 && <p className="rp-empty">No items available</p>}
      </div>

      <div className="rp-footer">
        <button className="rp-skip" onClick={handleSkip}>Skip</button>
        <button className="rp-continue" onClick={handleContinue}>
          CONTINUE
        </button>
      </div>

    </div>
  </div>
);
};

export default RecommendedPopup;