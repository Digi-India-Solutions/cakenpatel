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
  const [imageIndex, setImageIndex] = useState(0)
  const [massage, setMassage] = useState("")
  const [cartItems, setCartItems] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);
  const [orderActive, setOrderActive] = useState(true)

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

    // Also check when cart changes
    window.addEventListener('storage', checkIfAdded);

    return () => {
      window.removeEventListener('storage', checkIfAdded);
    };
  }, [activeWeight, data._id]);

  // Check if product is in cart whenever activeWeight or cartItems change
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
        quantity: 1,
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

    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(
      item => item.productId === data._id && item.weight === activeWeight
    );

    if (existingProductIndex !== -1) {
      // Product IS in cart → redirect to cart page (NO SWEET ALERT HERE)
      navigate("/cart");
      return;
    }

    // Product is NOT in cart → add to cart immediately
    const newItem = {
      productId: data._id,
      name: data.productName,
      categoryId: data?.categoryName?._id,
      weight: activeWeight,
      price: price,
      massage: massage,
      quantity: 1,
      image: data?.productImage?.[0],
      deliveryDate,
      eggOption,
      addonProducts: [],
    };

    cart.push(newItem);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);

    // Open recommended popup (NO SUCCESS MESSAGE HERE)
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

    const NextArrow = ({ onClick }) => {
    return (
      <div
        className="custom-arrow custom-next"
        onClick={onClick}
      >
        ›
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div
        className="custom-arrow custom-prev"
        onClick={onClick}
      >
        ‹
      </div>
    );
  };

  const addonSliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
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
        quantity: 1,
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

  // Get button text based on cart status
  const getCartButtonText = () => {
    if (isAdded) {
      return "GO TO CART";
    }
    return "ADD TO CART";
  };

  // console.log("data==>", data);
  return (
    <>
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <Link to="/" style={{ color: "#df4444" }}>Home /</Link>{" "}
          {/* <Link to="" style={{ color: "#df4444" }}>{data?.categoryName?.mainCategoryName} /</Link>{" "} */}
          <Link to="">{data?.productName}</Link>
        </div>
      </section>

      <section className="pdx-wrapper">
        <div className="container">
          <div className="row gx-4">

            <div className="col-lg-5">
              <div className="pdx-left-sticky">
                <div className="d-flex pdxImg">

                  <div className="pdx-thumb-column">
                    {data?.productImage?.map((img, i) => {
                      const imagePath = img.replace(/\\/g, "/");

                      return (
                        <img
                          key={i}
                          src={`https://api.cakenpetals.com/${imagePath}`}
                          alt="thumb"
                          className={`pdx-thumb ${imageIndex === i ? "active-thumb" : ""}`}
                          onClick={() => setImageIndex(i)}
                        />
                      );
                    })}
                  </div>

                  <div className="pdx-main-images">
                    {data?.productImage?.length > 0 && (
                      <img
                        src={`https://api.cakenpetals.com/${data?.productImage[imageIndex]?.replace(/\\/g, "/")}`}
                        alt="product"
                      />
                    )}
                  </div>
                </div>

                <div className="pdx-features" >
                  <div className="text-center">
                    <TbTruckDelivery className="fs-2" />
                    <p>20+ Min Delivered</p>
                  </div>
                  <div className="text-center">
                    <TbMapPinCode className="fs-2" />
                    <p>Pincodes</p>
                  </div>
                  <div className="text-center">
                    <TbTruckDelivery className="fs-2" />
                    <p>620+ Cities Same-day Delivery</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="pdx-right-scroll">

                <div className="pdx-title-row">
                  <div className="pdx-title">
                    {data.eggless ? <span className="pdx-badge"> 100% EGGLESS </span> : ''}
                    <h1>{data.productName?.charAt(0).toUpperCase() + data.productName?.slice(1)}</h1>
                  </div>
                  <div
                    className={`wishlist-icon ${wishlist?.includes(data?._id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(data?._id)}
                    role="button"
                    aria-label="Add to wishlist"
                  >{wishlist?.includes(data?._id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                  </div>
                </div>

                <div>
                  <div className="pdx-price">₹ {Math?.round(price)}</div>
                  {activeWeight && originalPrice > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                      <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '16px' }}>
                        M.R.P: ₹{originalPrice}
                      </span>
                      <span style={{ color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>
                        {discountPercentage}% OFF
                      </span>
                      <span style={{ color: '#df4444', fontSize: '14px' }}>
                        Save: ₹{(originalPrice - price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {data?.Variant?.some(v => v?.weight) && (
                  <div className="pdx-block">
                    {/* <div className="pdx-block-head">
                      <span>Weight</span>
                    </div> */}

                    <div className="pdx-weight-group">
                      {data?.Variant
                        ?.filter(v => v?.weight)
                        ?.map((v) => (
                          <button
                            key={v?._id}
                            className={`pdx-weight-btn ${activeWeight === v?.weight ? "active" : ""
                              }`}
                            onClick={() =>
                              handleWeightSelection(v?.weight)
                            }
                          >
                            {v?.weight}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {data?.ActiveonFlavours && <div className="pdx-block formInput">
                  <label>Select Flavour</label>
                  <select className="form-select  inputfield">
                    <option>Butterscotch</option>
                    <option>Chocolate</option>
                    <option>Vanilla</option>
                  </select>
                </div>}

                {data?.NameOnCake && <div className="pdx-block">
                  <label>
                    Name on Cake <small>{massage?.length} / 25</small>
                  </label>
                  <input
                    type="text"
                    value={massage}
                    onChange={(e) => setMassage(e.target.value)}
                    className="form-control formInput  inputfield"
                    placeholder="Write Name Here"
                    maxLength={25}
                  />
                </div>}

                {data?.ActiveonDeliveryDate && <div className="pdx-block">
                  <label>
                    Delivery Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control inputfield"
                    value={deliveryDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>}

                {data?.recommendedProductId?.length > 0 && (
                  <div className="pdx-block">
                    <h6 className="pdx-addon-title">Recommended Addon Products</h6>

                    <div className="pdx-addon-slider">
                      <Slider {...addonSliderSettings}>
                        {data?.recommendedProductId?.map((item, index) => {
                          const addonQuantity = getAddonQuantity(item._id);

                          return (
                            <div key={index}>
                              <div className="rpS-card">
                                <img
                                  src={`https://api.cakenpetals.com/${item?.productImage?.[0]?.replace(/\\/g, "/")}`}
                                  alt={item?.productName}
                                />
                                <div style={{ paddingLeft: "15px" }}>
                                  <h6>{item?.productName}</h6>
                                  <p>₹ {item?.price}</p>

                                </div>
                                {addonQuantity === 0 ? (
                                  <button
                                    className="rpS-add-btn"
                                    onClick={() => addAddon(item)}
                                  >
                                    Add
                                  </button>
                                ) : (
                                  <div className="rpS-qty">
                                    <button
                                      onClick={() => decrementAddon(item._id)}
                                      disabled={!isServiceAvailable}
                                      style={{
                                        opacity: !isServiceAvailable ? 0.5 : 1,
                                        cursor: !isServiceAvailable ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      −
                                    </button>
                                    <span>{addonQuantity}</span>
                                    <button
                                      onClick={() => incrementAddon(item._id)}
                                      disabled={!isServiceAvailable}
                                      style={{
                                        opacity: !isServiceAvailable ? 0.5 : 1,
                                        cursor: !isServiceAvailable ? 'not-allowed' : 'pointer'
                                      }}
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
                      <div className="weight-warning-message">
                        ⚠️ Please select cake weight to add addons
                      </div>
                    )}
                  </div>
                )}

                <LocationOption onServiceChange={updateServiceStatus} />

                {data?.productDetails &&
                  <div className="description-box" style={{ marginBottom: '12px', borderRadius: '13px 13px 0px 0px' }}>
                    <h6>Product Details</h6>
                    <p>
                      {new DOMParser()
                        .parseFromString(data?.productDetails || "", "text/html")
                        .body?.textContent}
                    </p>
                  </div>
                }

                {data?.productDescription && <div className="description-box" style={{ marginBottom: '12px', borderRadius: '13px 13px 0px 0px' }}>
                  <h6>Description</h6>
                  <p style={{}}>
                    {new DOMParser()
                      .parseFromString(data.productDescription || "", "text/html")
                      .body.textContent}
                  </p>
                </div>}

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
                <div>
                  {!orderActive && (
                    <div
                      className="order-close"
                      style={{
                        background: "#fff3f3", color: "#d32f2f", padding: "8px 12px", borderRadius: "6px", fontSize: "14px", marginBottom: "10px", fontWeight: 500,
                      }}
                    >
                      ⚠️ Ordering is temporarily unavailable. Please try again later.
                    </div>
                  )}
                  {orderActive && data?.categoryName?._id && <div
                    className="order-close"
                  >
                    <CountdownTimer categoryId={data?.categoryName?._id} />
                  </div>}
                  <div className="pdx-cta">
                    <button
                      className={`pdx-cart ${isAdded ? "in-cart" : ""}`}
                      onClick={addToCart}
                      disabled={orderActive === false}
                    >
                      {getCartButtonText()}
                    </button>
                    <button
                      className="pdx-buy"
                      onClick={handleBuyNow}
                      disabled={orderActive === false}
                    >
                      BUY NOW | ₹ {Math.round(price)}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relatedProducts">
        <hr style={{ marginTop: "5px", marginBottom: "5px" }} />
        <div className="container">
          <h2 className="mb-0 MainTitle">Related Products</h2>
        </div>
        <AllProducts />
      </section>

    </>
  );
};

export default ProductDetails;