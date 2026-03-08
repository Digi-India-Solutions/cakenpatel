import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";

const Cart = () => {
  const [mainItems, setMainItems] = useState([]);
  const navigate = useNavigate();
  const loginvalue = sessionStorage.getItem("login");

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    
    // Process cart to separate main items and their addons
    const processedItems = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      addonProducts: item.addonProducts || []
    }));
    
    setMainItems(processedItems);
  }, []);

  /* ================= UPDATE CART IN STORAGE ================= */
  const updateCartInStorage = (updatedItems) => {
    sessionStorage.setItem("cart", JSON.stringify(updatedItems));
    setMainItems(updatedItems);
  };

  /* ================= MAIN PRODUCT QUANTITY ================= */
  const handleIncrement = (productId, weight) => {
    const updated = mainItems.map(item => {
      if (item.productId === productId && item.weight === weight) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateCartInStorage(updated);
  };

  const handleDecrement = (productId, weight) => {
    const updated = mainItems.map(item => {
      if (item.productId === productId && item.weight === weight && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    updateCartInStorage(updated);
  };

  /* ================= ADDON QUANTITY ================= */
  const handleAddonIncrement = (mainProductId, mainWeight, addonId) => {
    const updated = mainItems.map(item => {
      if (item.productId === mainProductId && item.weight === mainWeight) {
        const updatedAddons = item.addonProducts.map(addon => {
          if (addon.productId === addonId) {
            return { ...addon, quantity: addon.quantity + 1 };
          }
          return addon;
        });
        return { ...item, addonProducts: updatedAddons };
      }
      return item;
    });
    updateCartInStorage(updated);
  };

  const handleAddonDecrement = (mainProductId, mainWeight, addonId) => {
    const updated = mainItems.map(item => {
      if (item.productId === mainProductId && item.weight === mainWeight) {
        let updatedAddons = item.addonProducts.map(addon => {
          if (addon.productId === addonId) {
            return { ...addon, quantity: addon.quantity - 1 };
          }
          return addon;
        });
        
        // Remove addon if quantity becomes 0
        updatedAddons = updatedAddons.filter(addon => addon.quantity > 0);
        
        return { ...item, addonProducts: updatedAddons };
      }
      return item;
    });
    updateCartInStorage(updated);
  };

  /* ================= REMOVE ITEMS ================= */
  const handleRemoveMain = (productId, weight) => {
    const updated = mainItems.filter(
      item => !(item.productId === productId && item.weight === weight)
    );
    updateCartInStorage(updated);
  };

  const handleRemoveAddon = (mainProductId, mainWeight, addonId) => {
    const updated = mainItems.map(item => {
      if (item.productId === mainProductId && item.weight === mainWeight) {
        const updatedAddons = item.addonProducts.filter(
          addon => addon.productId !== addonId
        );
        return { ...item, addonProducts: updatedAddons };
      }
      return item;
    });
    updateCartInStorage(updated);
  };

  /* ================= CALCULATIONS ================= */
  const calculateSubtotal = () => {
    let total = 0;
    
    mainItems.forEach(mainItem => {
      // Add main product price
      total += mainItem.price * mainItem.quantity;
      
      // Add addon products price
      mainItem.addonProducts?.forEach(addon => {
        total += addon.price * addon.quantity;
      });
    });
    
    return total;
  };

  const subtotal = calculateSubtotal();
  const deliveryCharge = subtotal > 0 ? 0 : 0;
  const grandTotal = subtotal + deliveryCharge;

  /* ================= NAVIGATION ================= */
  const handleCheckout = () => {
    if (!loginvalue) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container-fluid shopping-bag-wrapper">
      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-lg-8">
          <h4 className="bag-title">MY SHOPPING BAG</h4>

          {mainItems.length === 0 && (
            <div className="empty-cart">
              <p>Your cart is empty 🛒</p>
            </div>
          )}

          {mainItems.map(mainItem => (
            <div key={`${mainItem.productId}-${mainItem.weight}`}>
              {/* MAIN PRODUCT */}
              <div className="bag-item main-product">
                <img 
                  src={`https://api.cakenpetals.com/${mainItem?.image}`} 
                  alt={mainItem?.name} 
                  className="bag-img" 
                />

                <div className="bag-info">
                  <h6>{mainItem?.name?.charAt(0).toUpperCase() + mainItem?.name?.slice(1)}</h6>

                  {mainItem.weight && (
                    <p className="text-muted">Weight: {mainItem.weight}</p>
                  )}

                  {mainItem.deliveryDate && (
                    <p className="text-muted">
                      Delivery: {mainItem.deliveryDate}
                    </p>
                  )}

                  {mainItem.massage && (
                    <p className="text-muted">
                      Message: "{mainItem.massage}"
                    </p>
                  )}

                  <div className="qty-box">
                    <button 
                      onClick={() => handleDecrement(mainItem.productId, mainItem.weight)} 
                      className="cartDecBtn"
                    >−</button>
                    <span>{mainItem.quantity}</span>
                    <button 
                      onClick={() => handleIncrement(mainItem.productId, mainItem.weight)} 
                      className="cartIncBtn"
                    >+</button>
                  </div>
                  &nbsp;
                  &nbsp;
                  <span
                    className="remove-btn"
                    onClick={() => handleRemoveMain(mainItem.productId, mainItem.weight)}
                  >
                    REMOVE
                  </span>
                </div>

                <div className="bag-price">
                  ₹ {mainItem.price * mainItem.quantity}
                </div>
              </div>

              {/* ADDON PRODUCTS (RECOMMENDED ITEMS) */}
              {mainItem.addonProducts?.length > 0 && (
                <div className="addons-section">
                  <p className="addons-title">Recommended Add-ons:</p>
                  
                  {mainItem.addonProducts.map(addon => (
                    <div key={`${mainItem.productId}-${addon.productId}`} className="bag-item addon-item">
                      <img 
                        src={`https://api.cakenpetals.com/${addon?.image}`} 
                        alt={addon?.name} 
                        className="bag-img addon-img" 
                      />

                      <div className="bag-info">
                        <h6>
                          {addon?.name} 
                          <span className="addon-badge">🎁 Addon</span>
                        </h6>

                        <div className="qty-box small">
                          <button 
                            onClick={() => handleAddonDecrement(
                              mainItem.productId, 
                              mainItem.weight, 
                              addon.productId
                            )} 
                            className="cartDecBtn"
                          >−</button>
                          <span>{addon.quantity}</span>
                          <button 
                            onClick={() => handleAddonIncrement(
                              mainItem.productId, 
                              mainItem.weight, 
                              addon.productId
                            )} 
                            className="cartIncBtn"
                          >+</button>
                        </div>

                        <span
                          className="remove-btn small"
                          onClick={() => handleRemoveAddon(
                            mainItem.productId, 
                            mainItem.weight, 
                            addon.productId
                          )}
                        >
                          REMOVE
                        </span>
                      </div>

                      <div className="bag-price">
                        ₹ {addon.price * addon.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">
          <div className="summary-box">
            <h6>ORDER SUMMARY</h6>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹ ${deliveryCharge}`}</span>
            </div>

            <hr  className="d-none d-sm-block"/>

            <div className="summary-row total">
              <span>Grand Total</span>
              <span>₹ {grandTotal}</span>
            </div>

            <button
              className="checkout-btn"
              disabled={mainItems.length === 0}
              onClick={handleCheckout}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;