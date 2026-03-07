// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./wishlist.css";
// import pic1 from '../../images/pic/redVelvet.jpg'
// import pic2 from '../../images/pic/Product2.avif'
// import pic3 from '../../images/pic/vanilla.jpg'
// import { FaRegTrashCan } from "react-icons/fa6";
// import { FaHeart } from "react-icons/fa6";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";


// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const user = sessionStorage.getItem("userId");
//   const navigate = useNavigate()

//   useEffect(() => {
//     // Static / session data (replace later with API)
//     const data = [
//       {
//         id: 1,
//         name: "Beanie with Logo",
//         image: pic1,
//         price: 20,
//         salePrice: 18,
//         stock: "In Stock",
//         addedOn: "December 5, 2019",
//       },
//       {
//         id: 2,
//         name: "Classy shirt",
//         image: pic2,
//         price: 16,
//         salePrice: null,
//         stock: "In Stock",
//         addedOn: "December 6, 2019",
//       },
//       {
//         id: 3,
//         name: "Beanie",
//         image: pic3,
//         price: 20,
//         salePrice: 18,
//         stock: "In Stock",
//         addedOn: "December 6, 2019",
//       },
//     ];

//     setWishlist(data);
//   }, []);

//   // const handleRemove = (id) => {
//   //   setWishlist(wishlist.filter((item) => item.id !== id));
//   // };

//   const fetchWishlist = async () => {
//     try {
//       const res = await axios.get(`https://api.cakenpetals.com/api/wishlist/get-wishlist/${user}`);
//       if (res.status === 200) {
//         setWishlist(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     // const stored = sessionStorage.getItem("wishlist");
//     // if (stored) {
//     //   setWishlist(JSON.parse(stored));
//     // }
//     fetchWishlist();
//   }, []);

//   // get existing wishlist from session
//   const handleRemove = async (productId) => {
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

//       // ✅ update session
//       sessionStorage.setItem("wishlist", JSON.stringify(updated));

//       // ✅ call API (fire and forget)
//       handleWishlistApi(productId, isExist);

//       return updated;
//     });
//   };


//   const handleWishlistApi = async (productId, isRemoving) => {
//     console.log("isRemoving==>", isRemoving);
//     try {
//       if (isRemoving) {
//         // ✅ REMOVE from wishlist
//         await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
//           data: {
//             user: user,
//             productId: productId,
//           },
//         });
//       } else {
//         // ✅ ADD to wishlist
//         await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
//           user: user,
//           productId: productId,
//         });
//       }
//     } catch (error) {
//       console.error("Wishlist API error:", error);
//     }
//   };


//   const getOrCreateMainCartItem = () => {
//     const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     let index = cart.findIndex(
//       item => item.productId === data._id && item.weight === activeWeight
//     );

//     // If not exist → create
//     if (index === -1) {
//       const newItem = {
//         productId: data?._id,
//         name: data.productName,
//         weight: activeWeight,
//         price: price,
//         massage: massage,
//         quantity: 1,
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

//   const addToCart = (product) => {
//     const hasWeight = product.Variant?.some(v => v?.weight?.sizeweight);
//     const { cart, index } = getOrCreateMainCartItem();
//     cart[index].quantity += 1;
//     sessionStorage.setItem("cart", JSON.stringify(cart));
//   };

//   console.log("SSSSSSSSXXXXXX:=>", wishlist);
//   return (
//     <div className="wishlist-page">
//       {/* TITLE */}
//       <div className="wishlist-header text-center">
//         <div className="heart"> <FaHeart className="text-danger" /></div>
//         <h1>My Wishlist</h1>
//       </div>

//       {/* TABLE */}
//       <div className="container wishlistContainer">
//         <div className="wishlist-table">
//           <div className="wishlist-row wishlist-head">
//             <div></div>
//             <div>Product name</div>
//             <div>Unit price</div>
//             <div>quantity</div>
//             <div></div>
//           </div>

//           {wishlist?.map((item) => (
//             <div className="wishlist-row" key={item?.productId?._id}>
//               <div className="remove-icon" onClick={() => handleRemove(item?.productId?._id)}>
//                 < FaRegTrashCan className="fs-4" />
//               </div>

//               <div className="product-info">
//                 <img src={`https://api.cakenpetals.com/${item?.productId?.productImage[0] || item?.productId?.productImage}`} alt={item?.name} />
//                 <span className="text-success">{item?.productId?.productName}</span>
//               </div>

//               <div className="price">
//                 {item?.salePrice ? (
//                   <>
//                     <del>${item?.productId?.Variant[0]?.finalPrice?.toFixed(2)}</del>
//                     <span className="sale">
//                       ${item?.salePrice?.toFixed(2)}
//                     </span>
//                   </>
//                 ) : (
//                   <span>${item?.productId?.Variant[0]?.finalPrice?.toFixed(2)}</span>
//                 )}
//               </div>

//               <div>
//                 + 1 -
//               </div>

//               <div className="action">
//                 <small>Added on: {item?.createdAt?.split("T")[0]}</small>
//                 <button onClick={() => addToCart(item?.productId)}>Add to cart</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Wishlist;


// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./wishlist.css";
// import { FaRegTrashCan, FaHeart } from "react-icons/fa6";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const user = sessionStorage.getItem("userId");
//   const [carts, setCarts] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
//   const navigate = useNavigate();

//   // ✅ fetch wishlist
//   const fetchWishlist = async () => {
//     try {
//       const res = await axios.get(
//         `https://api.cakenpetals.com/api/wishlist/get-wishlist/${user}`
//       );
//       if (res.status === 200) {
//         setWishlist(res.data.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     fetchWishlist();
//   }, [user]);

//   // ✅ REMOVE from wishlist
//   const handleRemove = async (productId) => {
//     try {
//       await axios.delete(
//         "https://api.cakenpetals.com/api/wishlist/remove-wishlist",
//         {
//           data: { user, productId },
//         }
//       );

//       // ✅ update UI instantly

//       setWishlist((prev) => {
//         const updated = prev.filter(
//           (item) => item.productId._id !== productId
//         );

//         // ✅ ALSO update sessionStorage
//         sessionStorage.setItem("wishlist", JSON.stringify(updated));

//         return updated;
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Removed",
//         text: "Item removed from wishlist",
//         timer: 1200,
//         showConfirmButton: false,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     setCarts(JSON.parse(sessionStorage.getItem("cart")) || [])
//   }, [])

//   // ✅ ADD TO CART (clean version)
//   const addToCart = (product) => {
//     let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     const existingIndex = cart.findIndex(
//       (item) => item.productId === product._id
//     );

//     if (existingIndex > -1) {
//       cart[existingIndex].quantity += 1;

//       Swal.fire({
//         icon: "success",
//         title: "Already in cart And Quantity Updated",
//         timer: 1000,
//         showConfirmButton: false,
//       });
//       setCarts(cart[existingIndex].quantity += 1);
//     } else {
//       cart.push({
//         productId: product._id,
//         name: product.productName,
//         price: product?.Variant?.[0]?.finalPrice || 0,
//         quantity: 1,
//         image: product?.productImage[0],
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Added to cart",
//         timer: 1000,
//         showConfirmButton: false,
//       });
//     }

//     // ✅ update both places
//     sessionStorage.setItem("cart", JSON.stringify(cart));
//     setCarts(cart);
//   };

//   const existCart = (product) => {
//     const existingIndex = carts.findIndex(
//       (item) => item.productId === product._id
//     )
//     return existingIndex
//   }


//   return (
//     <div className="wishlist-page">
//       {/* HEADER */}
//       <div className="wishlist-header text-center">
//         <div className="heart">
//           <FaHeart className="text-danger" />
//         </div>
//         <h1>My Wishlist</h1>
//       </div>

//       <div className="container wishlistContainer">
//         <div className="wishlist-table">
//           <div className="wishlist-row wishlist-head">
//             <div></div>
//             <div>Product</div>
//             <div>Price</div>
//             <div>Status</div>
//             <div></div>
//           </div>

//           {wishlist.length === 0 && (
//             <div className="text-center py-5">
//               <h5>Your wishlist is empty ❤️</h5>
//             </div>
//           )}

//           {wishlist.map((item) => {
//             const product = item.productId;

//             return (
//               <div className="wishlist-row" key={product?._id}>
//                 {/* remove */}
//                 <div
//                   className="remove-icon"
//                   onClick={() => handleRemove(product?._id)}
//                 >
//                   <FaRegTrashCan className="fs-4" />
//                 </div>

//                 {/* product */}
//                 <div className="product-info">
//                   <img
//                     src={`https://api.cakenpetals.com/${product?.productImage?.[0]}`}
//                     alt={product?.productName}
//                   />
//                   <span className="text-success">
//                     {product?.productName?.charAt(0).toUpperCase() + product?.productName?.slice(1)}
//                   </span>
//                 </div>

//                 {/* price */}
//                 <div className="price">
//                   ₹{product?.Variant?.[0]?.finalPrice?.toFixed(2)}
//                 </div>

//                 {/* stock */}
//                 <div className="text-success fw-semibold">
//                   In Stock
//                 </div>

//                 {/* action */}
//                 <div className="action">
//                   <small>
//                     Added on: {item?.createdAt?.split("T")[0]}
//                   </small>

//                   <button
//                     onClick={() => addToCart(product)}
//                     className="btn btn-dark btn-sm mt-1"
//                   >

//                     {existCart(product) ? "Add to Cart" : "Update Cart Quantity"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./wishlist.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [carts, setCarts] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );

  const user = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        `https://api.cakenpetals.com/api/wishlist/get-wishlist/${user}`
      );
      if (res.status === 200) {
        setWishlist(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(
        "https://api.cakenpetals.com/api/wishlist/remove-wishlist",
        { data: { user, productId } }
      );

      const updated = wishlist.filter(
        (item) => item.productId._id !== productId
      );

      setWishlist(updated);

      Swal.fire({
        icon: "success",
        title: "Removed",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (product) => {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) => item.productId === product._id
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.productName,
        price: product?.Variant?.[0]?.finalPrice || 0,
        quantity: 1,
        image: product?.productImage?.[0],
      });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCarts([...cart]);

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="wishlist-wrapper container py-5">
      <h3 className="wishlist-title">My Wishlist</h3>

      <div className="wishlist-table">
        <div className="wishlist-head">
          <div></div>
          <div>Product Name</div>
          <div>Unit Price</div>
          <div>Stock Status</div>
          <div>Actions</div>
        </div>

        {wishlist.length === 0 && (
          <div className="text-center py-4">Your wishlist is empty.</div>
        )}

        {wishlist.map((item) => {
          const product = item.productId;

          return (
            <div className="wishlist-row" key={product?._id}>
              {/* Remove */}
              <div
                className="remove"
                onClick={() => handleRemove(product?._id)}
              >
                ×
              </div>

              {/* Product */}
              <div className="product">
                <img
                  src={`https://api.cakenpetals.com/${product?.productImage?.[0]}`}
                  alt={product?.productName}
                />
                <span>{product?.productName}</span>
              </div>

              {/* Price */}
              <div className="price">
                {product?.Variant?.[0]?.discountPrice && (
                  <del>
                    ₹{product?.Variant?.[0]?.price?.toFixed(2)}
                  </del>
                )}
                <span>
                  ₹{product?.Variant?.[0]?.finalPrice?.toFixed(2)}
                </span>
              </div>

              {/* Stock */}
              <div className="stock">In Stock</div>

              {/* Action */}
              <div>
                <button
                  className="add-btn"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;