// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import Slider from "react-slick";
// import "./productDetails.css";
// import AllProducts from "../../Components/AllProducts/AllProducts";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Pic1 from "../../images/pic/redVelvet.jpg";
// import { FaLocationCrosshairs } from "react-icons/fa6";
// import RecommendedPopup from "../../Components/RecommendedPopup/RecommendedPopup";
// import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
// import { TbTruckDelivery } from "react-icons/tb";
// import { TbMapPinCode } from "react-icons/tb";
// import LocationOption from "../../Components/LocationOption/LocationOption";
// import { useNavigate } from "react-router-dom";
// import CountdownTimer from "../../Components/Countdown/Countdown";
// import ReviewModel from "../../Components/ReviewModel/ReviewModel"

// const ProductDetails = () => {
//   const loginvalue = sessionStorage.getItem("login");
//   const user = sessionStorage.getItem("userId");
//   const navigate = useNavigate()
//   const { name } = useParams();
//   const [data, setData] = useState({});
//   const [activeWeight, setActiveWeight] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [originalPrice, setOriginalPrice] = useState(0);
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [eggOption, setEggOption] = useState("");
//   const [openPopup, setOpenPopup] = useState(false);
//   const [popupSource, setPopupSource] = useState("");
//   const [wishlist, setWishlist] = useState([]);
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [countDown, setCountDown] = useState({});
//   const [imageIndex, setImageIndex] = useState(0);
//   const [massage, setMassage] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const [isAdded, setIsAdded] = useState(false);
//   const [isServiceAvailable, setIsServiceAvailable] = useState(false);
//   const [orderActive, setOrderActive] = useState(true);

//   // NEW: State for main product quantity
//   const [quantity, setQuantity] = useState(1);

//   const updateServiceStatus = (status) => {
//     setIsServiceAvailable(status);
//     console.log("Service status updated:", status);
//   };
//   const [reviews, setReviews] = useState([]);
//   const [averageRating, setAverageRating] = useState(0);
//   const [totalReviews, setTotalReviews] = useState(0);
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

//   // Review Form State
//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     name: "", // Will auto-fill if user is logged in
//     reviewText: "",
//     photoUrl: ""
//   });
//   useEffect(() => {
//     const fetchReviews = async () => {
//       if (!data._id) return;
//       try {
//         // TODO: Replace with your actual backend endpoint
//         // const res = await axios.get(`https://api.cakenpetals.com/api/reviews/${data._id}`);

//         // Mock Data for UI presentation
//         const mockReviews = [
//           { _id: "1", name: "Priya Sharma", rating: 5, reviewText: "Absolutely delicious! The cake was fresh and delivered on time.", photoUrl: "https://i.pravatar.cc/150?img=1", date: "2026-03-01" },
//           { _id: "2", name: "Rahul Verma", rating: 4, reviewText: "Great packaging and taste. Will order again.", photoUrl: "", date: "2026-02-28" }
//         ];
//         setReviews(mockReviews);
//         setTotalReviews(mockReviews.length);

//         // Calculate average rating
//         const avg = mockReviews.reduce((acc, curr) => acc + curr.rating, 0) / mockReviews.length;
//         setAverageRating(avg.toFixed(1));

//       } catch (err) {
//         console.error("Failed to fetch reviews", err);
//       }
//     };
//     fetchReviews();
//   }, [data._id]);

//   // 2. Auto-fill name if logged in when opening modal
//   const handleOpenReviewModal = () => {
//     // if (user) {
//     //   // Assuming you store the user's name in sessionStorage upon login
//     //   const userName = sessionStorage.getItem("userName") || "Logged In User";
//     //   setReviewForm(prev => ({ ...prev, name: userName }));
//     //   setIsReviewModalOpen(true);
//     // }
//     setIsReviewModalOpen(true);
//     alert("Please login to submit a review.");
//   };

//   // 3. Submit Review
//   const submitReview = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         productId: data._id,
//         userId: user || null, // null if guest
//         ...reviewForm
//       };

//       // TODO: Replace with your actual POST endpoint
//       // await axios.post(`https://api.cakenpetals.com/api/reviews/add`, payload);

//       Swal.fire({ icon: "success", title: "Review Submitted", text: "Thank you for your feedback!" });
//       setIsReviewModalOpen(false);
//       setReviewForm({ rating: 5, name: "", reviewText: "", photoUrl: "" });

//       // Ideally, re-fetch reviews here to show the new one.
//     } catch (err) {
//       Swal.fire({ icon: "error", title: "Error", text: "Could not submit review." });
//     }
//   };

//   useEffect(() => {
//     const stored = sessionStorage.getItem("wishlist");
//     if (stored) {
//       setWishlist(JSON.parse(stored));
//     }
//     const fetchOrderStatus = async () => {
//       try {
//         const res = await axios.get(`https://api.cakenpetals.com/api/active-order/get-active-order`);
//         console.log("res.data.data==>", res.data.data.isActive)
//         setOrderActive(res.data.data.isActive);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     fetchOrderStatus()
//   }, []);

//   const toggleWishlist = async (productId) => {
//     if (!user) {
//       Swal.fire({
//         icon: "warning",
//         title: "Login Required",
//         text: "Please login to use wishlist",
//       });
//       navigate("/login");
//       return;
//     }

//     setWishlist((prev) => {
//       const isExist = prev.includes(productId);

//       const updated = isExist
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId];

//       sessionStorage.setItem("wishlist", JSON.stringify(updated));
//       handleWishlistApi(productId, isExist);

//       return updated;
//     });
//   };


//   const handleWishlistApi = async (productId, isRemoving) => {
//     console.log("isRemoving==>", isRemoving);
//     try {
//       if (isRemoving) {
//         await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
//           data: {
//             user: user,
//             productId: productId,
//           },
//         });
//       } else {
//         await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
//           user: user,
//           productId: productId,
//         });
//       }
//     } catch (error) {
//       console.error("Wishlist API error:", error);
//     }
//   };

//   const getApiData = async () => {
//     try {
//       const res = await axios.get(
//         `https://api.cakenpetals.com/api/get-product-by-name/${name?.replace(/-/g, " ")}`
//       );
//       const productData = res.data.data;
//       console.log(productData.Variant)

//       setData(productData);

//       if (productData?.Variant?.length > 0) {
//         const firstVariant = productData.Variant[0];
//         setActiveWeight(firstVariant?.weight);
//         setPrice(firstVariant?.finalPrice);
//         setOriginalPrice(firstVariant?.price);
//         setDiscountPercentage(firstVariant?.discountPrice);
//       }

//     } catch (error) {
//       console.error("Error fetching product data:", error);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     getApiData();
//   }, [name]);

//   useEffect(() => {
//     const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//   }, []);


//   // Listen for cart updates
//   useEffect(() => {
//     const checkIfAdded = () => {
//       if (activeWeight && data._id) {
//         const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
//         const productInCart = cart.some(
//           item => item.productId === data._id && item.weight === activeWeight
//         );
//         console.log("Checking if product in cart:", productInCart);
//         setIsAdded(productInCart);
//       }
//     };

//     checkIfAdded();

//     window.addEventListener('storage', checkIfAdded);

//     return () => {
//       window.removeEventListener('storage', checkIfAdded);
//     };
//   }, [activeWeight, data._id]);

//   useEffect(() => {
//     if (activeWeight && data._id) {
//       const productInCart = cartItems.some(
//         item => item.productId === data._id && item.weight === activeWeight
//       );
//       setIsAdded(productInCart);
//     } else {
//       setIsAdded(false);
//     }
//   }, [activeWeight, cartItems, data?._id]);

//   useEffect(() => {

//     const fetchCountdown = async () => {
//       try {
//         const res = await axios.get(
//           `https://api.cakenpetals.com/api/countdown/get-countdown-by-category/${data?.subcategoryName?._id}`
//         );
//         console.log("SSSXXXX:=>", res)
//         setCountDown(res?.data?.data);
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     if (data?.subcategoryName?._id) {
//       fetchCountdown();
//     }
//   }, [data?.subcategoryName?._id])

//   const handleWeightSelection = (weight) => {
//     setActiveWeight(weight);
//     const selectedVariant = data.Variant?.find(
//       (variant) => variant?.weight === weight
//     );
//     if (selectedVariant) {
//       setPrice(selectedVariant.finalPrice);
//       setOriginalPrice(selectedVariant.price);
//       setDiscountPercentage(selectedVariant.discountPrice);
//     }
//   };

//   const getOrCreateMainCartItem = () => {
//     const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     let index = cart.findIndex(
//       item => item.productId === data._id && item.weight === activeWeight
//     );

//     if (index === -1) {
//       const newItem = {
//         productId: data?._id,
//         name: data.productName,
//         weight: activeWeight,
//         categoryId: data?.categoryName?._id,
//         price: price,
//         massage: massage,
//         quantity: quantity, // Uses the state quantity
//         image: data?.productImage?.[0],
//         deliveryDate,
//         eggOption,
//         addonProducts: [],
//       };
//       cart.push(newItem);
//       index = cart.length - 1;
//     }

//     return { cart, index };
//   };

//   const addToCart = () => {
//     if (!isServiceAvailable) {
//       Swal.fire({
//         icon: "warning",
//         title: "Service Area Required",
//         text: "Please check delivery availability for your location first.",
//         timer: 2000
//       });
//       return;
//     }

//     if (orderActive === false) {
//       Swal.fire({
//         toast: true,
//         position: "top-end",
//         icon: "warning",
//         title: "Orders are currently disabled by admin",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       return;
//     }

//     const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);
//     if (hasWeight && !activeWeight) {
//       Swal.fire("Select Weight", "Please select cake weight first", "warning");
//       return;
//     }

//     let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     const existingProductIndex = cart.findIndex(
//       item => item.productId === data._id && item.weight === activeWeight
//     );

//     if (existingProductIndex !== -1) {
//       navigate("/cart");
//       return;
//     }

//     const newItem = {
//       productId: data._id,
//       name: data.productName,
//       categoryId: data?.categoryName?._id,
//       weight: activeWeight,
//       price: price,
//       massage: massage,
//       quantity: quantity, // Uses the state quantity
//       image: data?.productImage?.[0],
//       deliveryDate,
//       eggOption,
//       addonProducts: [],
//     };

//     cart.push(newItem);
//     sessionStorage.setItem("cart", JSON.stringify(cart));
//     setCartItems(cart);

//     setPopupSource("cart");
//     setOpenPopup(true);
//   };

//   const addAddon = (addon) => {
//     if (!isServiceAvailable && !isAdded) {
//       Swal.fire({
//         icon: "warning",
//         title: "Service Area Required",
//         text: "Please check if we deliver to your location first",
//         timer: 2000
//       });
//       return;
//     }
//     if (orderActive === false) {
//       Swal.fire({
//         toast: true,
//         position: "top-end",
//         icon: "warning",
//         title: "Orders are currently disabled by admin",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       return;
//     }
//     if (!activeWeight) {
//       Swal.fire("Select Weight", "Please select cake weight first", "warning");
//       return;
//     }

//     const { cart, index } = getOrCreateMainCartItem();

//     const addons = cart[index].addonProducts;

//     const existingIndex = addons.findIndex(a => a.productId === addon._id);

//     if (existingIndex > -1) {
//       addons[existingIndex].quantity += 1;
//     } else {
//       addons.push({
//         productId: addon._id,
//         name: addon.productName,
//         price: addon.price,
//         image: addon.productImage?.[0],
//         quantity: 1,
//       });
//     }

//     sessionStorage.setItem("cart", JSON.stringify(cart));
//     setCartItems(cart);

//     Swal.fire({
//       toast: true,
//       position: "top-end",
//       icon: "success",
//       title: `${addon.productName} added to cart`,
//       showConfirmButton: false,
//       timer: 1000
//     });
//   };

//   const incrementAddon = (id) => {
//     const { cart, index } = getOrCreateMainCartItem();

//     const addons = cart[index].addonProducts;

//     const addonIndex = addons.findIndex(a => a.productId === id);

//     if (addonIndex > -1) {
//       addons[addonIndex].quantity += 1;

//       sessionStorage.setItem("cart", JSON.stringify(cart));
//       setCartItems(cart);

//       Swal.fire({
//         toast: true,
//         position: "top-end",
//         icon: "success",
//         title: "Quantity increased",
//         showConfirmButton: false,
//         timer: 1000
//       });
//     }
//   };

//   const decrementAddon = (id) => {
//     const { cart, index } = getOrCreateMainCartItem();

//     let addons = cart[index].addonProducts;

//     const addonIndex = addons.findIndex(a => a.productId === id);

//     if (addonIndex > -1) {
//       addons[addonIndex].quantity -= 1;

//       if (addons[addonIndex].quantity <= 0) {
//         addons.splice(addonIndex, 1);
//       }
//     }

//     cart[index].addonProducts = addons;

//     sessionStorage.setItem("cart", JSON.stringify(cart));
//     setCartItems(cart);
//   };

//   const getAddonQuantity = (addonId) => {
//     const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     const mainProduct = cart.find(
//       item =>
//         item.productId === data._id &&
//         item.weight === activeWeight
//     );

//     const addon = mainProduct?.addonProducts?.find(
//       a => a.productId === addonId
//     );

//     return addon?.quantity || 0;
//   };

//   const addonSliderSettings = {
//     dots: false,
//     arrows: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 1200,
//         settings: {
//           slidesToShow: 4,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 2.2,
//         },
//       },
//     ],
//   };

//   const handleBuyNow = () => {
//     if (!isServiceAvailable) {
//       Swal.fire({
//         icon: "warning",
//         title: "Service Area Required",
//         text: "Please check delivery availability for your location first.",
//         timer: 2000
//       });
//       return;
//     }

//     if (orderActive === false) {
//       Swal.fire({
//         icon: "warning",
//         title: "Orders are currently disabled by admin",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       return;
//     }

//     const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);
//     if (hasWeight && !activeWeight) {
//       Swal.fire("Select Weight", "Please select cake weight first", "warning");
//       return;
//     }

//     let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     const existingProductIndex = cart.findIndex(
//       item => item.productId === data._id && item.weight === activeWeight
//     );

//     if (existingProductIndex === -1) {
//       const newItem = {
//         productId: data._id,
//         name: data.productName,
//         categoryId: data?.categoryName?._id,
//         weight: activeWeight,
//         price: price,
//         massage: massage,
//         quantity: quantity, // Uses the state quantity
//         image: data?.productImage?.[0],
//         deliveryDate,
//         eggOption,
//         addonProducts: [],
//       };
//       cart.push(newItem);
//       sessionStorage.setItem("cart", JSON.stringify(cart));
//       setCartItems(cart);
//     }

//     setPopupSource("buynow");
//     setOpenPopup(true);
//   };


//   const settings = {
//     customPaging: function (i) {
//       return (
//         <button
//           type="button"
//           className="p-0 border-0 bg-transparent"
//         >
//           <img
//             src={`https://api.cakenpetals.com/${data.productImage?.[i]}`}
//             className="w-100"
//             style={{ borderRadius: "1rem" }}
//             alt={`Thumbnail ${i + 1}`}
//           />
//         </button>
//       );
//     },
//     dots: true,
//     arrow: false,
//     dotsClass: "miniImage",
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   const handlePopupClose = () => {
//     setOpenPopup(false);
//     setPopupSource("");
//   };

//   const getCartButtonText = () => {
//     if (isAdded) {
//       return "GO TO CART";
//     }
//     return "ADD TO CART";
//   };

//   const mobileImageSliderSettings = {
//     dots: true,
//     arrows: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: false,
//     appendDots: dots => (
//       <div style={{ bottom: "-25px" }}>
//         <ul style={{ padding: "0px", margin: "0px", display: "flex", justifyContent: "center", gap: "8px" }}> {dots} </ul>
//       </div>
//     ),
//     customPaging: i => (
//       <div
//         className="mobile-custom-dot"
//         style={{
//           width: "8px",
//           height: "8px",
//           backgroundColor: "#d4d4d4",
//           borderRadius: "50%",
//           marginTop: "10px",
//           transition: "all 0.3s ease",
//           cursor: "pointer"
//         }}
//       ></div>
//     )
//   };

//   useEffect(() => {
//     const getCategory = async () => {
//       try {
//         const res = await axios.get(`https://api.cakenpetals.com/api/get-categories-by-product/${data?._id}`);
//         if (res.status === 200) {
//           // setCategory(res.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching category data:", error);
//       }
//     };

//     getCategory();

//   }, [data?._id])

//   const handleCloseReviewModal = () => {
//     setIsReviewModalOpen(false)
//   }
//   return (
//     <>
//       <style>{`
//         .mobile-slider-container .slick-dots li {
//           width: auto;
//           height: auto;
//           margin: 0;
//         }
//         .mobile-slider-container .slick-dots li.slick-active .mobile-custom-dot {
//           background-color: #2e6a7c !important; 
//           width: 24px !important;
//           border-radius: 10px !important;
//         }
//       `}</style>

//       <section className="breadCrumb" style={{ marginBottom: "0" }}>
//         <div className="breadCrumbContent">
//           <Link to="/" style={{ color: "#007185", fontWeight: "500" }}>Home</Link>
//           <span style={{ margin: "0 8px", color: "#666" }}>&gt;</span>
//           <Link to="" style={{ color: "#666" }}>{data?.productName}</Link>
//         </div>
//       </section>

//       <section className="pdx-wrapper" style={{ backgroundColor: "#f4f4f4", padding: "20px 0" }}>
//         <div className="container">

//           <div
//             className="product-island p-3 p-md-4"
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "16px",
//               boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)"
//             }}
//           >
//             <div className="row gx-4">

//               {/* LEFT: IMAGE GALLERY */}
//               <div className="col-lg-5">
//                 <div className="pdx-left-sticky">

//                   {/* === DESKTOP VIEW === */}
//                   <div className="d-none d-lg-flex pdxImg" style={{ gap: "12px" }}>
//                     <div className="pdx-thumb-column" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "70px" }}>
//                       {data?.productImage?.map((img, i) => {
//                         const imagePath = img.replace(/\\/g, "/");
//                         return (
//                           <img
//                             key={i}
//                             src={`https://api.cakenpetals.com/${imagePath}`}
//                             alt="thumb"
//                             className={`pdx-thumb ${imageIndex === i ? "active-thumb" : ""}`}
//                             onClick={() => setImageIndex(i)}
//                             style={{
//                               borderRadius: "8px",
//                               border: imageIndex === i ? "2px solid #df4444" : "1px solid #ddd",
//                               width: "100%",
//                               cursor: "pointer",
//                               aspectRatio: "1/1",
//                               objectFit: "cover"
//                             }}
//                           />
//                         );
//                       })}
//                     </div>

//                     <div className="pdx-main-images" style={{ flex: 1, borderRadius: "12px", overflow: "hidden", backgroundColor: "#f9f9f9" }}>
//                       {data?.productImage?.length > 0 && (
//                         <img
//                           src={`https://api.cakenpetals.com/${data?.productImage[imageIndex]?.replace(/\\/g, "/")}`}
//                           alt="product"
//                           style={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "1/1" }}
//                         />
//                       )}
//                     </div>
//                   </div>

//                   {/* === MOBILE VIEW === */}
//                   <div className="d-block d-lg-none mb-3 mobile-slider-container" style={{ paddingBottom: "25px" }}>
//                     {data?.productImage?.length > 0 && (
//                       <Slider {...mobileImageSliderSettings}>
//                         {data?.productImage?.map((img, i) => (
//                           <div key={i} style={{ outline: "none" }}>
//                             <img
//                               src={`https://api.cakenpetals.com/${img.replace(/\\/g, "/")}`}
//                               alt={`product-${i}`}
//                               style={{
//                                 width: "100%",
//                                 height: "auto",
//                                 aspectRatio: "1/1",
//                                 objectFit: "cover",
//                                 borderRadius: "12px",
//                                 backgroundColor: "#f9f9f9"
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </Slider>
//                     )}
//                   </div>

//                 </div>
//               </div>

//               {/* RIGHT: PRODUCT DETAILS */}
//               <div className="col-lg-7 mt-3 mt-lg-0">
//                 <div className="pdx-right-scroll" style={{ paddingLeft: "5px" }}>

//                   {/* Micro-Badges */}
//                   <div className="d-flex align-items-center gap-2 mb-2">
//                     {data.eggless && (
//                       <span style={{ fontSize: "11px", fontWeight: "700", color: "#388e3c", border: "1px solid #388e3c", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
//                         ⊡ EGGLESS
//                       </span>
//                     )}
//                     <span style={{ fontSize: "11px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 8px", borderRadius: "4px" }}>
//                       ⚡ 30-60 Min Delivery
//                     </span>
//                   </div>

//                   {/* TITLE ROW */}
//                   <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
//                     <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#111", lineHeight: "1.3", margin: 0, flex: 1, wordBreak: "break-word" }}>
//                       {data.productName?.charAt(0).toUpperCase() + data.productName?.slice(1)}
//                     </h1>

//                     {/* WISHLIST HEART */}
//                     <div
//                       className={`wishlist-icon d-flex align-items-center justify-content-center ${wishlist?.includes(data?._id) ? "active" : ""}`}
//                       onClick={() => toggleWishlist(data?._id)}
//                       role="button"
//                       aria-label="Add to wishlist"
//                       style={{
//                         cursor: "pointer", width: "36px", height: "36px", backgroundColor: "#fff",
//                         borderRadius: "50%", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", flexShrink: 0, border: "1px solid #eaeaea"
//                       }}
//                     >
//                       {wishlist?.includes(data?._id) ? (
//                         <FaHeart color="#ff3b30" size={16} />
//                       ) : (
//                         <FaRegHeart color="#888" size={16} />
//                       )}
//                     </div>
//                   </div>

//                   {/* Pricing Hierarchy */}
//                   <div className="mb-3 d-flex align-items-baseline gap-2">
//                     <span className="pdx-price" style={{ fontSize: "24px", fontWeight: "700", color: "#111" }}>
//                       ₹ {Math?.round(price)}
//                     </span>
//                     {activeWeight && originalPrice > 0 && (
//                       <>
//                         <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '16px', fontWeight: "500" }}>
//                           ₹{originalPrice}
//                         </span>
//                         <span style={{ color: '#d68716', fontSize: '14px', fontWeight: '700' }}>
//                           {discountPercentage}% OFF
//                         </span>
//                       </>
//                     )}
//                   </div>


//                   {/* CONTROLS */}
//                   <div style={{ backgroundColor: "#fcfcfc", padding: "15px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #f0f0f0" }}>

//                     {/* NEW: QUANTITY SELECTOR */}
//                     {/* <div className="pdx-block mb-3 d-flex align-items-center justify-content-between">
//                       <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", margin: 0 }}>Quantity</label>
//                       <div className="d-flex align-items-center" style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
//                         <button
//                           onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                           style={{ padding: "6px 14px", border: "none", background: "#f9f9f9", color: "#333", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
//                         >−</button>
//                         <span style={{ padding: "6px 16px", fontSize: "14px", fontWeight: "600", borderLeft: "1px solid #eee", borderRight: "1px solid #eee", backgroundColor: "#fff", minWidth: "40px", textAlign: "center" }}>
//                           {quantity}
//                         </span>
//                         <button
//                           onClick={() => setQuantity(q => q + 1)}
//                           style={{ padding: "6px 14px", border: "none", background: "#f9f9f9", color: "#333", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
//                         >+</button>
//                       </div>
//                     </div> */}

//                     {data?.Variant?.some(v => v?.weight) && (
//                       <div className="pdx-block mb-3">
//                         <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#333", display: "block" }}>Select Option</label>
//                         <div className="pdx-weight-group" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {data?.Variant
//                             ?.filter(v => v?.weight)
//                             ?.map((v) => (
//                               <button
//                                 key={v?._id}
//                                 className={`pdx-weight-btn ${activeWeight === v?.weight ? "active" : ""}`}
//                                 onClick={() => handleWeightSelection(v?.weight)}
//                                 style={{
//                                   padding: "6px 14px",
//                                   borderRadius: "6px",
//                                   border: activeWeight === v?.weight ? "2px solid #df4444" : "1px solid #ccc",
//                                   backgroundColor: activeWeight === v?.weight ? "#fff4f4" : "#fff",
//                                   color: activeWeight === v?.weight ? "#df4444" : "#333",
//                                   fontWeight: activeWeight === v?.weight ? "600" : "400",
//                                   fontSize: "13px"
//                                 }}
//                               >
//                                 {v?.weight}
//                               </button>
//                             ))}
//                         </div>
//                       </div>
//                     )}

//                     {data?.ActiveonFlavours && (
//                       <div className="pdx-block formInput mb-3">
//                         <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#333", display: "block" }}>Select Flavour</label>
//                         <select className="form-select inputfield" style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", width: "100%", fontSize: "14px" }}>
//                           <option>Butterscotch</option>
//                           <option>Chocolate</option>
//                           <option>Vanilla</option>
//                         </select>
//                       </div>
//                     )}

//                     {data?.NameOnCake && (
//                       <div className="pdx-block mb-3" style={{ marginTop: "8%", }}>
//                         <label style={{ fontSize: "13px", marginTop: 10, fontWeight: "600", marginBottom: "6px", color: "#333", display: "flex", justifyContent: "space-between" }}>
//                           Name on Cake <small style={{ color: "#888", fontWeight: "normal" }}>{massage?.length} / 25</small>
//                         </label>
//                         <input
//                           type="text"
//                           value={massage}
//                           onChange={(e) => setMassage(e.target.value)}
//                           className="form-control formInput inputfield"
//                           placeholder="Write Name Here"
//                           maxLength={25}
//                           style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", fontSize: "14px" }}
//                         />
//                       </div>
//                     )}

//                     {data?.ActiveonDeliveryDate && (
//                       <div className="pdx-block mb-1">
//                         <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#333", display: "block" }}>
//                           Delivery Date <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="date"
//                           className="form-control inputfield"
//                           value={deliveryDate}
//                           min={new Date().toISOString().split("T")[0]}
//                           onChange={(e) => setDeliveryDate(e.target.value)}
//                           style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", width: "100%", fontSize: "14px" }}
//                         />
//                       </div>
//                     )}
//                   </div>


//                   {/* LOCATION & SERVICE */}
//                   <div style={{ marginBottom: "20px" }}>
//                     <LocationOption onServiceChange={updateServiceStatus} />
//                   </div>

//                   {/* MAKE IT EXTRA SPECIAL (Addons) */}
//                   {data?.recommendedProductId?.length > 0 && (
//                     <div className="pdx-block mt-3">
//                       <h6 className="pdx-addon-title" style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "12px" }}>Make this gift extra special</h6>

//                       <div className="pdx-addon-slider">
//                         <Slider {...addonSliderSettings}>
//                           {data?.recommendedProductId?.map((item, index) => {
//                             const addonQuantity = getAddonQuantity(item._id);

//                             return (
//                               <div key={index}>
//                                 <div className="rpS-card" style={{ border: "1px solid #eaeaea", borderRadius: "10px", padding: "8px", margin: "0 5px", backgroundColor: "#fff" }}>
//                                   <img
//                                     src={`https://api.cakenpetals.com/${item?.productImage?.[0]?.replace(/\\/g, "/")}`}
//                                     alt={item?.productName}
//                                     style={{ width: "100%", height: "70px", objectFit: "contain", marginBottom: "8px", borderRadius: "6px" }}
//                                   />
//                                   <div className="text-center">
//                                     <h6 style={{ fontSize: "11px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "0 0 4px 0" }}>{item?.productName}</h6>
//                                     <p style={{ fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0" }}>₹ {item?.price}</p>
//                                   </div>

//                                   {addonQuantity === 0 ? (
//                                     <button
//                                       className="rpS-add-btn w-100"
//                                       onClick={() => addAddon(item)}
//                                       style={{ border: "1px solid #df4444", color: "#df4444", backgroundColor: "transparent", padding: "4px 0", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}
//                                     >
//                                       ADD
//                                     </button>
//                                   ) : (
//                                     <div className="rpS-qty d-flex justify-content-between align-items-center" style={{ backgroundColor: "#df4444", color: "#fff", borderRadius: "4px", padding: "4px 8px" }}>
//                                       <button
//                                         onClick={() => decrementAddon(item._id)}
//                                         disabled={!isServiceAvailable}
//                                         style={{ border: "none", background: "transparent", color: "#fff", padding: 0 }}
//                                       >
//                                         −
//                                       </button>
//                                       <span style={{ fontSize: "13px", fontWeight: "600" }}>{addonQuantity}</span>
//                                       <button
//                                         onClick={() => incrementAddon(item._id)}
//                                         disabled={!isServiceAvailable}
//                                         style={{ border: "none", background: "transparent", color: "#fff", padding: 0 }}
//                                       >
//                                         +
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </Slider>
//                       </div>

//                       {!activeWeight && isServiceAvailable && (
//                         <div className="weight-warning-message mt-2" style={{ fontSize: "12px", color: "#d68716", fontWeight: "500" }}>
//                           ⚠️ Please select cake weight to add addons
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* ACTION BUTTONS */}
//                   <div className="mt-3 pt-3" style={{ borderTop: "1px solid #eee" }}>

//                     {/* Delivery Hint */}
//                     <div className="delivery d-flex align-items-center gap-1 mb-2">
//                       <span style={{ fontSize: "13px", color: "#444" }}>
//                         <i className="bi bi-truck me-1"></i> Want today? <strong style={{ color: "#007185", cursor: "pointer", fontWeight: "600" }}>Call Us Now</strong>
//                       </span>
//                     </div>

//                     {!orderActive && (
//                       <div className="order-close" style={{ background: "#fff3f3", color: "#d32f2f", padding: "10px 15px", borderRadius: "8px", fontSize: "14px", marginBottom: "15px", fontWeight: 500 }}>
//                         ⚠️ Ordering is temporarily unavailable. Please try again later.
//                       </div>
//                     )}
//                     {orderActive && data?.categoryName?._id && (
//                       <div className="order-close mb-3">
//                         <CountdownTimer categoryId={data?.categoryName?._id} />
//                       </div>
//                     )}

//                     <div className="pdx-cta d-flex gap-2">
//                       <button
//                         className={`pdx-cart flex-fill ${isAdded ? "in-cart" : ""}`}
//                         onClick={addToCart}
//                         disabled={orderActive === false}
//                         style={{
//                           padding: "12px 10px",
//                           borderRadius: "8px",
//                           fontSize: "13px",
//                           fontWeight: "700",
//                           border: isAdded ? "1px solid #4caf50" : "1px solid #222",
//                           backgroundColor: isAdded ? "#e8f5e9" : "#fff",
//                           color: isAdded ? "#2e7d32" : "#222"
//                         }}
//                       >
//                         {getCartButtonText()}
//                       </button>
//                       <button
//                         className="pdx-buy flex-fill"
//                         onClick={handleBuyNow}
//                         disabled={orderActive === false}
//                         style={{
//                           padding: "12px 10px",
//                           borderRadius: "8px",
//                           fontSize: "13px",
//                           fontWeight: "700",
//                           border: "none",
//                           backgroundColor: "#2e6a7c",
//                           color: "#fff",
//                           whiteSpace: "nowrap"
//                         }}
//                       >
//                         BUY NOW | ₹ {Math.round(price * quantity)}
//                       </button>
//                     </div>
//                   </div>

//                   {/* PRODUCT DETAILS & DESCRIPTION */}
//                   <div className="mt-4">
//                     {data?.productDetails && (
//                       <div className="description-box mb-3">
//                         <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>Product Details</h6>
//                         <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}>
//                           {new DOMParser()
//                             .parseFromString(data?.productDetails || "", "text/html")
//                             .body?.textContent}
//                         </p>
//                       </div>
//                     )}

//                     {data?.productDescription && (
//                       <div className="description-box">
//                         <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>Description</h6>
//                         <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}>
//                           {new DOMParser()
//                             .parseFromString(data.productDescription || "", "text/html")
//                             .body.textContent}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                   <div className="reviews-section mt-5 pt-4" style={{ borderTop: "1px solid #eee" }}>
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                       <div>
//                         <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#222", margin: 0 }}>Customer Reviews</h4>
//                         {totalReviews > 0 ? (
//                           <div className="d-flex align-items-center gap-2 mt-1">
//                             <span style={{ backgroundColor: "#388e3c", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
//                               ★ {averageRating}
//                             </span>
//                             <span style={{ fontSize: "13px", color: "#666" }}>Based on {totalReviews} reviews</span>
//                           </div>
//                         ) : (
//                           <span style={{ fontSize: "13px", color: "#666" }}>No reviews yet. Be the first!</span>
//                         )}
//                       </div>

//                       <button
//                         onClick={handleOpenReviewModal}
//                         style={{ backgroundColor: "#fff", border: "1px solid #2e6a7c", color: "#2e6a7c", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", transition: "0.3s" }}
//                       >
//                         Write a Review
//                       </button>
//                       <ReviewModel show={isReviewModalOpen} onHide={handleCloseReviewModal} productId={data?._id} onReviewAdded={submitReview} />
//                     </div>

//                     {/* REVIEWS LIST */}
//                     <div className="reviews-list">
//                       {reviews.map((review) => (
//                         <div key={review._id} className="review-card mb-3 p-3" style={{ backgroundColor: "#fcfcfc", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
//                           <div className="d-flex align-items-center gap-3 mb-2">
//                             {/* User Avatar */}
//                             <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eee", overflow: "hidden" }}>
//                               {review.photoUrl ? (
//                                 <img src={review.photoUrl} alt={review.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                               ) : (
//                                 <div className="d-flex align-items-center justify-content-center h-100 fw-bold text-secondary">
//                                   {review.name.charAt(0)}
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>{review.name}</h6>

//                               {/* Render Stars */}
//                               <div style={{ color: "#ffb400", fontSize: "12px", marginTop: "2px" }}>
//                                 {[...Array(5)].map((star, i) => {
//                                   const ratingValue = i + 1;
//                                   return ratingValue <= review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />;
//                                 })}
//                               </div>
//                             </div>
//                           </div>

//                           <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: "1.5" }}>
//                             {review.reviewText}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   {/* END REVIEWS SECTION */}



//                   <RecommendedPopup
//                     productId={data._id}
//                     productData={data}
//                     activeWeight={activeWeight}
//                     price={price}
//                     massage={massage}
//                     deliveryDate={deliveryDate}
//                     eggOption={eggOption}
//                     open={openPopup}
//                     onClose={handlePopupClose}
//                     source={popupSource}
//                   />

//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </section>

//       <section className="relatedProducts mt-4">
//         <div className="container">
//           <h2 className="mb-3 MainTitle" style={{ fontSize: "20px", fontWeight: "600", color: "#222" }}>Related Products</h2>
//         </div>
//         <AllProducts relatedProducts={'relatedProducts'} />
//       </section>

//     </>
//   );
// };

// export default ProductDetails;


import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./productDetails.css";
import AllProducts from "../../Components/AllProducts/AllProducts";
import axios from "axios";
import Swal from "sweetalert2";
import Pic1 from "../../images/pic/redVelvet.jpg";
import { FaLocationCrosshairs } from "react-icons/fa6";
import RecommendedPopup from "../../Components/RecommendedPopup/RecommendedPopup";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { TbMapPinCode } from "react-icons/tb";
import LocationOption from "../../Components/LocationOption/LocationOption";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../../Components/Countdown/Countdown";
import { LuEggOff } from "react-icons/lu";

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
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    name: "", // Will auto-fill if user is logged in
    reviewText: "",
    photoUrl: ""
  });

  const handleOpenReviewModal = () => {
    if (!user) {
      // Redirect to login if not logged in
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to write a review",
        confirmButtonText: "Go to Login"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // Get user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    setReviewForm({
      rating: 5,
      name: userData.name || "Logged In User",
      reviewText: "",
      photoUrl: ""
    });
    setIsReviewModalOpen(true);
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
        `https://api.cakenpetals.com/api/get-product-by-name/${name?.replace(/-/g, " ").replace(/\s+/g, " ").trim()}`
      );
      const productData = res.data.data;
      // console.log(productData.Variant)

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
          `https://api.cakenpetals.com/api/countdown/get-countdown-by-category/${data?.parentProductId}`
        );
        console.log("SSSXXXX:=>", res)
        setCountDown(res?.data?.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (data?.parentProductId) {
      fetchCountdown();
    }
  }, [data?.parentProductId])

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
        categoryId: data?.parentProductId,
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
      categoryId: data?.parentProductId,
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
        categoryId: data?.parentProductId,
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

  const fetchReview = async () => {
    try {
      const reviewRes = await axios.get(`https://api.cakenpetals.com/api/product-preview/get-preview-by-product/${data?._id}`);
      console.log("ADMIN==>SS===>", data, reviewRes.data.data.reviews, reviewRes.data.data.totalReviews, reviewRes.data.data.averageRating)
      if (reviewRes.data.success === true) {
        setReviews(reviewRes.data.data.reviews);
        setTotalReviews(reviewRes.data.data.totalReviews);
        setAverageRating(reviewRes.data.data.averageRating);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 3. Submit Review
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        productId: data._id,
        userId: user, // Always required since only logged-in users can submit
        rating: reviewForm.rating,
        massege: reviewForm.reviewText,
        name: reviewForm.name,
        photoUrl: reviewForm.photoUrl
      };

      const res = await axios.post(`https://api.cakenpetals.com/api/product-preview/create-product-preview`, payload);
      if (res.data.success === true) {
        setIsReviewModalOpen(false);
        Swal.fire({ icon: "success", title: "Review Submitted", text: "Thank you for your feedback!" });
        setReviewForm({ rating: 5, name: "", reviewText: "", photoUrl: "" });
      }

    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Could not submit review." });
    }
  };


  useEffect(() => {
    if (data?._id) {
      fetchReview();
    }
  }, [data?._id]);

  console.log("ADMIN==>DD", data)

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
                      <LuEggOff /> EGGLESS
                    </span>
                  )}
                  {data?.deliveryTo60Min && <span style={{ fontSize: "11px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 8px", borderRadius: "4px" }}>
                    ⚡ 30-60 Min Delivery
                  </span>}
                </div>

                {/* TITLE ROW */}
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#111", lineHeight: "1.3", margin: 0, flex: 1, wordBreak: "break-word" }}>
                    {data?.productName?.charAt(0)?.toUpperCase() + data.productName?.slice(1)}
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

                {/* REVIEW RATING DISPLAY */}
                {totalReviews > 0 && (
                  <div className="mb-3 d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center gap-1">
                      {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                          <FaStar
                            key={i}
                            color={ratingValue <= averageRating ? "#ffb400" : "#ddd"}
                            size={16}
                          />
                        );
                      })}
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginLeft: "4px" }}>
                        {averageRating}
                      </span>
                    </div>
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}


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
                    <div className="pdx-block mb-3" style={{ marginTop: "5%", }}>
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

                {/* PRODUCT DETAILS & DESCRIPTION */}
                <div className="mt-4">
                  {data?.productDetails && (
                    <div className="description-box mb-3">
                      <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>Product Details</h6>
                      {/* allow HTML (including <img> tags) to render correctly */}
                      <div
                        className="product-details-html"
                        style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}
                        dangerouslySetInnerHTML={{ __html: data.productDetails }}
                      />
                    </div>
                  )}

                  {data?.productDescription && (
                    <div className="description-box">
                      <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>Description</h6>
                      <div
                        className="product-description-html"
                        style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}
                        dangerouslySetInnerHTML={{ __html: data.productDescription }}
                      />
                    </div>
                  )}
                </div>
                {/* STICKY ACTION BUTTONS */}
                <div className="sticky-buttons mt-4">
                  {/* Delivery Hint */}
                  {/* <div className="delivery d-flex align-items-center gap-1 mb-2">
                    <span style={{ fontSize: "13px", color: "#444" }}>
                      <i className="bi bi-truck me-1"></i> Want today? <strong style={{ color: "#007185", cursor: "pointer", fontWeight: "600" }}>Call Us Now</strong>
                    </span>
                  </div> */}

                  {!orderActive && (
                    <div className="order-close" style={{ background: "#fff3f3", color: "#d32f2f", padding: "10px 15px", borderRadius: "8px", fontSize: "14px", marginBottom: "15px", fontWeight: 500 }}>
                      ⚠️ Ordering is temporarily unavailable. Please try again later.
                    </div>
                  )}
                  {orderActive && data?.parentProductId && (
                    <div className="order-close mb-3">
                      <CountdownTimer categoryId={data?.parentProductId} />
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
                {/* REVIEWS SECTION */}
                <div className="reviews-section mt-5 pt-4" style={{ borderTop: "1px solid #eee" }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#222", margin: 0 }}>Customer Reviews</h4>
                      {totalReviews > 0 ? (
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span style={{ backgroundColor: "#388e3c", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                            ★ {averageRating}
                          </span>
                          <span style={{ fontSize: "13px", color: "#666" }}>Based on {totalReviews} reviews</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "13px", color: "#666" }}>No reviews yet. Be the first!</span>
                      )}
                    </div>

                    <button
                      onClick={handleOpenReviewModal}
                      style={{ backgroundColor: "#fff", border: "1px solid #2e6a7c", color: "#2e6a7c", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", transition: "0.3s" }}
                    >
                      Write a Review
                    </button>
                  </div>

                  {/* REVIEWS LIST */}
                  <div className="reviews-list">
                    {reviews?.map((review) => (
                      <div key={review?._id} className="review-card mb-3 p-3" style={{ backgroundColor: "#fcfcfc", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                          {/* User Avatar */}
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eee", overflow: "hidden" }}>
                            {review?.photoUrl ? (
                              <img src={review?.photoUrl} alt={review.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center h-100 fw-bold text-secondary">
                                {review?.userId?.name?.charAt(0)?.toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div>
                            <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>{review?.userId?.name}</h6>

                            {/* Render Stars */}
                            <div style={{ color: "#ffb400", fontSize: "12px", marginTop: "2px" }}>
                              {[...Array(5)].map((star, i) => {
                                const ratingValue = i + 1;
                                return ratingValue <= review?.rating ? <FaStar key={i} /> : <FaRegStar key={i} />;
                              })}
                            </div>
                          </div>
                        </div>

                        <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: "1.5" }}>
                          {review?.massege}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* END REVIEWS SECTION */}



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

                {/* REVIEW MODAL */}
                {isReviewModalOpen && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                  }}>
                    <div style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "20px",
                      width: "90%",
                      maxWidth: "500px",
                      maxHeight: "80vh",
                      overflowY: "auto"
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Write a Review</h5>
                        <button
                          onClick={() => setIsReviewModalOpen(false)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#666"
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <form onSubmit={submitReview}>
                        {/* Rating */}
                        <div className="mb-3">
                          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Rating</label>
                          <div style={{ display: "flex", gap: "5px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                style={{
                                  background: "none",
                                  border: "none",
                                  fontSize: "20px",
                                  cursor: "pointer",
                                  color: star <= reviewForm.rating ? "#ffb400" : "#ddd"
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Photo URL */}
                        {/* <div className="mb-3">
                          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Photo URL (optional)</label>
                          <input
                            type="url"
                            value={reviewForm.photoUrl}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                            className="form-control"
                            placeholder="Enter photo URL"
                            style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px" }}
                          />
                        </div> */}

                        {/* Review Text */}
                        <div className="mb-3">
                          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Review</label>
                          <textarea
                            value={reviewForm.reviewText}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                            className="form-control"
                            placeholder="Write your review here..."
                            rows={4}
                            required
                            style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "8px", resize: "vertical" }}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => setIsReviewModalOpen(false)}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f9f9f9",
                              color: "#333",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "#2e6a7c",
                              color: "#fff",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            Submit Review
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>

              {/* STICKY ACTION BUTTONS */}
              <div className="sticky-buttons mt-4">

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
