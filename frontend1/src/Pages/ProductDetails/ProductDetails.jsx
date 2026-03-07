import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./productDetails.css";
import AllProducts from "../../Components/AllProducts/AllProducts";
import axios from "axios";
import Swal from "sweetalert2";
import Pic1 from "../../images/pic/redVelvet.jpg"
import { FaLocationCrosshairs } from "react-icons/fa6";
import RecommendedPopup from "../../Components/RecommendedPopup/RecommendedPopup";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { TbMapPinCode } from "react-icons/tb";
import LocationOption from "../../Components/LocationOption/LocationOption";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../../Components/Countdown/Countdown";

const ProductDetails = () => {
  const loginvalue = sessionStorage.getItem("login");
  const user = sessionStorage.getItem("userId");
  const navigate = useNavigate()
  const { name } = useParams();
  const [data, setData] = useState({});
  const [activeWeight, setActiveWeight] = useState(null);
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [eggOption, setEggOption] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupSource, setPopupSource] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [countDown, setCountDown] = useState({});
  const [imageIndex, setImageIndex] = useState(0);
  const [massage, setMassage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);
  const [orderActive, setOrderActive] = useState(true);

  // NEW: State for main product quantity
  const [quantity, setQuantity] = useState(1);

  const updateServiceStatus = (status) => {
    setIsServiceAvailable(status);
    console.log("Service status updated:", status);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
    const fetchOrderStatus = async () => {
      try {
        const res = await axios.get(`https://api.cakenpetals.com/api/active-order/get-active-order`);
        console.log("res.data.data==>", res.data.data.isActive)
        setOrderActive(res.data.data.isActive);
      } catch (e) {
        console.log(e);
      }
    }
    fetchOrderStatus()
  }, []);

  const toggleWishlist = async (productId) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to use wishlist",
      });
      navigate("/login");
      return;
    }

    setWishlist((prev) => {
      const isExist = prev.includes(productId);

      const updated = isExist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      sessionStorage.setItem("wishlist", JSON.stringify(updated));
      handleWishlistApi(productId, isExist);

      return updated;
    });
  };


  const handleWishlistApi = async (productId, isRemoving) => {
    console.log("isRemoving==>", isRemoving);
    try {
      if (isRemoving) {
        await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
          data: {
            user: user,
            productId: productId,
          },
        });
      } else {
        await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
          user: user,
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  const getApiData = async () => {
    try {
      const res = await axios.get(
        `https://api.cakenpetals.com/api/get-product-by-name/${name?.replace(/-/g, " ")}`
      );
      const productData = res.data.data;
      console.log(productData.Variant)

      setData(productData);

      if (productData?.Variant?.length > 0) {
        const firstVariant = productData.Variant[0];
        setActiveWeight(firstVariant?.weight);
        setPrice(firstVariant?.finalPrice);
        setOriginalPrice(firstVariant?.price);
        setDiscountPercentage(firstVariant?.discountPrice);
      }

    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
  }, [name]);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);


  // Listen for cart updates
  useEffect(() => {
    const checkIfAdded = () => {
      if (activeWeight && data._id) {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const productInCart = cart.some(
          item => item.productId === data._id && item.weight === activeWeight
        );
        console.log("Checking if product in cart:", productInCart);
        setIsAdded(productInCart);
      }
    };

    checkIfAdded();

    window.addEventListener('storage', checkIfAdded);

    return () => {
      window.removeEventListener('storage', checkIfAdded);
    };
  }, [activeWeight, data._id]);

  useEffect(() => {
    if (activeWeight && data._id) {
      const productInCart = cartItems.some(
        item => item.productId === data._id && item.weight === activeWeight
      );
      setIsAdded(productInCart);
    } else {
      setIsAdded(false);
    }
  }, [activeWeight, cartItems, data?._id]);

  useEffect(() => {

    const fetchCountdown = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/countdown/get-countdown-by-category/${data?.subcategoryName?._id}`
        );
        console.log("SSSXXXX:=>", res)
        setCountDown(res?.data?.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (data?.subcategoryName?._id) {
      fetchCountdown();
    }
  }, [data?.subcategoryName?._id])

  const handleWeightSelection = (weight) => {
    setActiveWeight(weight);
    const selectedVariant = data.Variant?.find(
      (variant) => variant?.weight === weight
    );
    if (selectedVariant) {
      setPrice(selectedVariant.finalPrice);
      setOriginalPrice(selectedVariant.price);
      setDiscountPercentage(selectedVariant.discountPrice);
    }
  };

  const getOrCreateMainCartItem = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    let index = cart.findIndex(
      item => item.productId === data._id && item.weight === activeWeight
    );

    if (index === -1) {
      const newItem = {
        productId: data?._id,
        name: data.productName,
        weight: activeWeight,
        categoryId: data?.categoryName?._id,
        price: price,
        massage: massage,
        quantity: quantity, // Uses the state quantity
        image: data?.productImage?.[0],
        deliveryDate,
        eggOption,
        addonProducts: [],
      };
      cart.push(newItem);
      index = cart.length - 1;
    }

    return { cart, index };
  };

  const addToCart = () => {
    if (!isServiceAvailable) {
      Swal.fire({
        icon: "warning",
        title: "Service Area Required",
        text: "Please check delivery availability for your location first.",
        timer: 2000
      });
      return;
    }

    if (orderActive === false) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Orders are currently disabled by admin",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);
    if (hasWeight && !activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(
      item => item.productId === data._id && item.weight === activeWeight
    );

    if (existingProductIndex !== -1) {
      navigate("/cart");
      return;
    }

    const newItem = {
      productId: data._id,
      name: data.productName,
      categoryId: data?.categoryName?._id,
      weight: activeWeight,
      price: price,
      massage: massage,
      quantity: quantity, // Uses the state quantity
      image: data?.productImage?.[0],
      deliveryDate,
      eggOption,
      addonProducts: [],
    };

    cart.push(newItem);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);

    setPopupSource("cart");
    setOpenPopup(true);
  };

  const addAddon = (addon) => {
    if (!isServiceAvailable && !isAdded) {
      Swal.fire({
        icon: "warning",
        title: "Service Area Required",
        text: "Please check if we deliver to your location first",
        timer: 2000
      });
      return;
    }
    if (orderActive === false) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Orders are currently disabled by admin",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    const { cart, index } = getOrCreateMainCartItem();

    const addons = cart[index].addonProducts;

    const existingIndex = addons.findIndex(a => a.productId === addon._id);

    if (existingIndex > -1) {
      addons[existingIndex].quantity += 1;
    } else {
      addons.push({
        productId: addon._id,
        name: addon.productName,
        price: addon.price,
        image: addon.productImage?.[0],
        quantity: 1,
      });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${addon.productName} added to cart`,
      showConfirmButton: false,
      timer: 1000
    });
  };

  const incrementAddon = (id) => {
    const { cart, index } = getOrCreateMainCartItem();

    const addons = cart[index].addonProducts;

    const addonIndex = addons.findIndex(a => a.productId === id);

    if (addonIndex > -1) {
      addons[addonIndex].quantity += 1;

      sessionStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Quantity increased",
        showConfirmButton: false,
        timer: 1000
      });
    }
  };

  const decrementAddon = (id) => {
    const { cart, index } = getOrCreateMainCartItem();

    let addons = cart[index].addonProducts;

    const addonIndex = addons.findIndex(a => a.productId === id);

    if (addonIndex > -1) {
      addons[addonIndex].quantity -= 1;

      if (addons[addonIndex].quantity <= 0) {
        addons.splice(addonIndex, 1);
      }
    }

    cart[index].addonProducts = addons;

    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
  };

  const getAddonQuantity = (addonId) => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const mainProduct = cart.find(
      item =>
        item.productId === data._id &&
        item.weight === activeWeight
    );

    const addon = mainProduct?.addonProducts?.find(
      a => a.productId === addonId
    );

    return addon?.quantity || 0;
  };

  const addonSliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.2,
        },
      },
    ],
  };

  const handleBuyNow = () => {
    if (!isServiceAvailable) {
      Swal.fire({
        icon: "warning",
        title: "Service Area Required",
        text: "Please check delivery availability for your location first.",
        timer: 2000
      });
      return;
    }

    if (orderActive === false) {
      Swal.fire({
        icon: "warning",
        title: "Orders are currently disabled by admin",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);
    if (hasWeight && !activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(
      item => item.productId === data._id && item.weight === activeWeight
    );

    if (existingProductIndex === -1) {
      const newItem = {
        productId: data._id,
        name: data.productName,
        categoryId: data?.categoryName?._id,
        weight: activeWeight,
        price: price,
        massage: massage,
        quantity: quantity, // Uses the state quantity
        image: data?.productImage?.[0],
        deliveryDate,
        eggOption,
        addonProducts: [],
      };
      cart.push(newItem);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
    }

    setPopupSource("buynow");
    setOpenPopup(true);
  };


  const settings = {
    customPaging: function (i) {
      return (
        <button
          type="button"
          className="p-0 border-0 bg-transparent"
        >
          <img
            src={`https://api.cakenpetals.com/${data.productImage?.[i]}`}
            className="w-100"
            style={{ borderRadius: "1rem" }}
            alt={`Thumbnail ${i + 1}`}
          />
        </button>
      );
    },
    dots: true,
    arrow: false,
    dotsClass: "miniImage",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
    setPopupSource("");
  };

  const getCartButtonText = () => {
    if (isAdded) {
      return "GO TO CART";
    }
    return "ADD TO CART";
  };

  const mobileImageSliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    appendDots: dots => (
      <div style={{ bottom: "-25px" }}>
        <ul style={{ padding: "0px", margin: "0px", display: "flex", justifyContent: "center", gap: "8px" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        className="mobile-custom-dot"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "#d4d4d4",
          borderRadius: "50%",
          marginTop: "10px",
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
      ></div>
    )
  };

  return (
    <>
      <style>{`
        .mobile-slider-container .slick-dots li {
          width: auto;
          height: auto;
          margin: 0;
        }
        .mobile-slider-container .slick-dots li.slick-active .mobile-custom-dot {
          background-color: #2e6a7c !important; 
          width: 24px !important;
          border-radius: 10px !important;
        }
      `}</style>

      <section className="breadCrumb" style={{ marginBottom: "0" }}>
        <div className="breadCrumbContent">
          <Link to="/" style={{ color: "#007185", fontWeight: "500" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#666" }}>&gt;</span>
          <Link to="" style={{ color: "#666" }}>{data?.productName}</Link>
        </div>
      </section>

      <section className="pdx-wrapper" style={{ backgroundColor: "#f4f4f4", padding: "20px 0" }}>
        <div className="container">

          <div
            className="product-island p-3 p-md-4"
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="row gx-4">

              {/* LEFT: IMAGE GALLERY */}
              <div className="col-lg-5">
                <div className="pdx-left-sticky">

                  {/* === DESKTOP VIEW === */}
                  <div className="d-none d-lg-flex pdxImg" style={{ gap: "12px" }}>
                    <div className="pdx-thumb-column" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "70px" }}>
                      {data?.productImage?.map((img, i) => {
                        const imagePath = img.replace(/\\/g, "/");
                        return (
                          <img
                            key={i}
                            src={`https://api.cakenpetals.com/${imagePath}`}
                            alt="thumb"
                            className={`pdx-thumb ${imageIndex === i ? "active-thumb" : ""}`}
                            onClick={() => setImageIndex(i)}
                            style={{
                              borderRadius: "8px",
                              border: imageIndex === i ? "2px solid #df4444" : "1px solid #ddd",
                              width: "100%",
                              cursor: "pointer",
                              aspectRatio: "1/1",
                              objectFit: "cover"
                            }}
                          />
                        );
                      })}
                    </div>

                    <div className="pdx-main-images" style={{ flex: 1, borderRadius: "12px", overflow: "hidden", backgroundColor: "#f9f9f9" }}>
                      {data?.productImage?.length > 0 && (
                        <img
                          src={`https://api.cakenpetals.com/${data?.productImage[imageIndex]?.replace(/\\/g, "/")}`}
                          alt="product"
                          style={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "1/1" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* === MOBILE VIEW === */}
                  <div className="d-block d-lg-none mb-3 mobile-slider-container" style={{ paddingBottom: "25px" }}>
                    {data?.productImage?.length > 0 && (
                      <Slider {...mobileImageSliderSettings}>
                        {data?.productImage?.map((img, i) => (
                          <div key={i} style={{ outline: "none" }}>
                            <img
                              src={`https://api.cakenpetals.com/${img.replace(/\\/g, "/")}`}
                              alt={`product-${i}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                aspectRatio: "1/1",
                                objectFit: "cover",
                                borderRadius: "12px",
                                backgroundColor: "#f9f9f9"
                              }}
                            />
                          </div>
                        ))}
                      </Slider>
                    )}
                  </div>

                </div>
              </div>

              {/* RIGHT: PRODUCT DETAILS */}
              <div className="col-lg-7 mt-3 mt-lg-0">
                <div className="pdx-right-scroll" style={{ paddingLeft: "5px" }}>

                  {/* Micro-Badges */}
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {data.eggless && (
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#388e3c", border: "1px solid #388e3c", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
                        ⊡ EGGLESS
                      </span>
                    )}
                    <span style={{ fontSize: "11px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 8px", borderRadius: "4px" }}>
                      ⚡ 30-60 Min Delivery
                    </span>
                  </div>

                  {/* TITLE ROW */}
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                    <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#111", lineHeight: "1.3", margin: 0, flex: 1, wordBreak: "break-word" }}>
                      {data.productName?.charAt(0).toUpperCase() + data.productName?.slice(1)}
                    </h1>

                    {/* WISHLIST HEART */}
                    <div
                      className={`wishlist-icon d-flex align-items-center justify-content-center ${wishlist?.includes(data?._id) ? "active" : ""}`}
                      onClick={() => toggleWishlist(data?._id)}
                      role="button"
                      aria-label="Add to wishlist"
                      style={{
                        cursor: "pointer", width: "36px", height: "36px", backgroundColor: "#fff",
                        borderRadius: "50%", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", flexShrink: 0, border: "1px solid #eaeaea"
                      }}
                    >
                      {wishlist?.includes(data?._id) ? (
                        <FaHeart color="#ff3b30" size={16} />
                      ) : (
                        <FaRegHeart color="#888" size={16} />
                      )}
                    </div>
                  </div>

                  {/* Pricing Hierarchy */}
                  <div className="mb-3 d-flex align-items-baseline gap-2">
                    <span className="pdx-price" style={{ fontSize: "24px", fontWeight: "700", color: "#111" }}>
                      ₹ {Math?.round(price)}
                    </span>
                    {activeWeight && originalPrice > 0 && (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '16px', fontWeight: "500" }}>
                          ₹{originalPrice}
                        </span>
                        <span style={{ color: '#d68716', fontSize: '14px', fontWeight: '700' }}>
                          {discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>


                  {/* CONTROLS */}
                  <div style={{ backgroundColor: "#fcfcfc", padding: "15px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #f0f0f0" }}>

                    {/* NEW: QUANTITY SELECTOR */}
                    {/* <div className="pdx-block mb-3 d-flex align-items-center justify-content-between">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", margin: 0 }}>Quantity</label>
                      <div className="d-flex align-items-center" style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          style={{ padding: "6px 14px", border: "none", background: "#f9f9f9", color: "#333", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
                        >−</button>
                        <span style={{ padding: "6px 16px", fontSize: "14px", fontWeight: "600", borderLeft: "1px solid #eee", borderRight: "1px solid #eee", backgroundColor: "#fff", minWidth: "40px", textAlign: "center" }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          style={{ padding: "6px 14px", border: "none", background: "#f9f9f9", color: "#333", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
                        >+</button>
                      </div>
                    </div> */}

                    {data?.Variant?.some(v => v?.weight) && (
                      <div className="pdx-block mb-3">
                        <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#333", display: "block" }}>Select Option</label>
                        <div className="pdx-weight-group" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {data?.Variant
                            ?.filter(v => v?.weight)
                            ?.map((v) => (
                              <button
                                key={v?._id}
                                className={`pdx-weight-btn ${activeWeight === v?.weight ? "active" : ""}`}
                                onClick={() => handleWeightSelection(v?.weight)}
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: "6px",
                                  border: activeWeight === v?.weight ? "2px solid #df4444" : "1px solid #ccc",
                                  backgroundColor: activeWeight === v?.weight ? "#fff4f4" : "#fff",
                                  color: activeWeight === v?.weight ? "#df4444" : "#333",
                                  fontWeight: activeWeight === v?.weight ? "600" : "400",
                                  fontSize: "13px"
                                }}
                              >
                                {v?.weight}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {data?.ActiveonFlavours && (
                      <div className="pdx-block formInput mb-3">
                        <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#333", display: "block" }}>Select Flavour</label>
                        <select className="form-select inputfield" style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", width: "100%", fontSize: "14px" }}>
                          <option>Butterscotch</option>
                          <option>Chocolate</option>
                          <option>Vanilla</option>
                        </select>
                      </div>
                    )}

                    {data?.NameOnCake && (
                      <div className="pdx-block mb-3" style={{ marginTop: "8%", }}>
                        <label style={{ fontSize: "13px", marginTop: 10, fontWeight: "600", marginBottom: "6px", color: "#333", display: "flex", justifyContent: "space-between" }}>
                          Name on Cake <small style={{ color: "#888", fontWeight: "normal" }}>{massage?.length} / 25</small>
                        </label>
                        <input
                          type="text"
                          value={massage}
                          onChange={(e) => setMassage(e.target.value)}
                          className="form-control formInput inputfield"
                          placeholder="Write Name Here"
                          maxLength={25}
                          style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", fontSize: "14px" }}
                        />
                      </div>
                    )}

                    {data?.ActiveonDeliveryDate && (
                      <div className="pdx-block mb-1">
                        <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#333", display: "block" }}>
                          Delivery Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control inputfield"
                          value={deliveryDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", width: "100%", fontSize: "14px" }}
                        />
                      </div>
                    )}
                  </div>


                  {/* LOCATION & SERVICE */}
                  <div style={{ marginBottom: "20px" }}>
                    <LocationOption onServiceChange={updateServiceStatus} />
                  </div>

                  {/* MAKE IT EXTRA SPECIAL (Addons) */}
                  {data?.recommendedProductId?.length > 0 && (
                    <div className="pdx-block mt-3">
                      <h6 className="pdx-addon-title" style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "12px" }}>Make this gift extra special</h6>

                      <div className="pdx-addon-slider">
                        <Slider {...addonSliderSettings}>
                          {data?.recommendedProductId?.map((item, index) => {
                            const addonQuantity = getAddonQuantity(item._id);

                            return (
                              <div key={index}>
                                <div className="rpS-card" style={{ border: "1px solid #eaeaea", borderRadius: "10px", padding: "8px", margin: "0 5px", backgroundColor: "#fff" }}>
                                  <img
                                    src={`https://api.cakenpetals.com/${item?.productImage?.[0]?.replace(/\\/g, "/")}`}
                                    alt={item?.productName}
                                    style={{ width: "100%", height: "70px", objectFit: "contain", marginBottom: "8px", borderRadius: "6px" }}
                                  />
                                  <div className="text-center">
                                    <h6 style={{ fontSize: "11px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "0 0 4px 0" }}>{item?.productName}</h6>
                                    <p style={{ fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0" }}>₹ {item?.price}</p>
                                  </div>

                                  {addonQuantity === 0 ? (
                                    <button
                                      className="rpS-add-btn w-100"
                                      onClick={() => addAddon(item)}
                                      style={{ border: "1px solid #df4444", color: "#df4444", backgroundColor: "transparent", padding: "4px 0", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}
                                    >
                                      ADD
                                    </button>
                                  ) : (
                                    <div className="rpS-qty d-flex justify-content-between align-items-center" style={{ backgroundColor: "#df4444", color: "#fff", borderRadius: "4px", padding: "4px 8px" }}>
                                      <button
                                        onClick={() => decrementAddon(item._id)}
                                        disabled={!isServiceAvailable}
                                        style={{ border: "none", background: "transparent", color: "#fff", padding: 0 }}
                                      >
                                        −
                                      </button>
                                      <span style={{ fontSize: "13px", fontWeight: "600" }}>{addonQuantity}</span>
                                      <button
                                        onClick={() => incrementAddon(item._id)}
                                        disabled={!isServiceAvailable}
                                        style={{ border: "none", background: "transparent", color: "#fff", padding: 0 }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      </div>

                      {!activeWeight && isServiceAvailable && (
                        <div className="weight-warning-message mt-2" style={{ fontSize: "12px", color: "#d68716", fontWeight: "500" }}>
                          ⚠️ Please select cake weight to add addons
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid #eee" }}>

                    {/* Delivery Hint */}
                    <div className="delivery d-flex align-items-center gap-1 mb-2">
                      <span style={{ fontSize: "13px", color: "#444" }}>
                        <i className="bi bi-truck me-1"></i> Want today? <strong style={{ color: "#007185", cursor: "pointer", fontWeight: "600" }}>Call Us Now</strong>
                      </span>
                    </div>

                    {!orderActive && (
                      <div className="order-close" style={{ background: "#fff3f3", color: "#d32f2f", padding: "10px 15px", borderRadius: "8px", fontSize: "14px", marginBottom: "15px", fontWeight: 500 }}>
                        ⚠️ Ordering is temporarily unavailable. Please try again later.
                      </div>
                    )}
                    {orderActive && data?.categoryName?._id && (
                      <div className="order-close mb-3">
                        <CountdownTimer categoryId={data?.categoryName?._id} />
                      </div>
                    )}

                    <div className="pdx-cta d-flex gap-2">
                      <button
                        className={`pdx-cart flex-fill ${isAdded ? "in-cart" : ""}`}
                        onClick={addToCart}
                        disabled={orderActive === false}
                        style={{
                          padding: "12px 10px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          border: isAdded ? "1px solid #4caf50" : "1px solid #222",
                          backgroundColor: isAdded ? "#e8f5e9" : "#fff",
                          color: isAdded ? "#2e7d32" : "#222"
                        }}
                      >
                        {getCartButtonText()}
                      </button>
                      <button
                        className="pdx-buy flex-fill"
                        onClick={handleBuyNow}
                        disabled={orderActive === false}
                        style={{
                          padding: "12px 10px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          border: "none",
                          backgroundColor: "#2e6a7c",
                          color: "#fff",
                          whiteSpace: "nowrap"
                        }}
                      >
                        BUY NOW | ₹ {Math.round(price * quantity)}
                      </button>
                    </div>
                  </div>

                  {/* PRODUCT DETAILS & DESCRIPTION */}
                  <div className="mt-4">
                    {data?.productDetails && (
                      <div className="description-box mb-3">
                        <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>Product Details</h6>
                        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}>
                          {new DOMParser()
                            .parseFromString(data?.productDetails || "", "text/html")
                            .body?.textContent}
                        </p>
                      </div>
                    )}

                    {data?.productDescription && (
                      <div className="description-box">
                        <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>Description</h6>
                        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}>
                          {new DOMParser()
                            .parseFromString(data.productDescription || "", "text/html")
                            .body.textContent}
                        </p>
                      </div>
                    )}
                  </div>

                  <RecommendedPopup
                    productId={data._id}
                    productData={data}
                    activeWeight={activeWeight}
                    price={price}
                    massage={massage}
                    deliveryDate={deliveryDate}
                    eggOption={eggOption}
                    open={openPopup}
                    onClose={handlePopupClose}
                    source={popupSource}
                  />

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="relatedProducts mt-4">
        <div className="container">
          <h2 className="mb-3 MainTitle" style={{ fontSize: "20px", fontWeight: "600", color: "#222" }}>Related Products</h2>
        </div>
        <AllProducts relatedProducts={'relatedProducts'} />
      </section>

    </>
  );
};

export default ProductDetails;
