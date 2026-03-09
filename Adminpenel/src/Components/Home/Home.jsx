import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Header from '../Header/Header'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import AllCategory from '../../Pages/Category/AllCategory'
import AddCategory from '../../Pages/Category/AddCategory'
import EditCategory from '../../Pages/Category/EditCategory'
import AllProduct from '../../Pages/Products/AllProduct'
import AddProduct from '../../Pages/Products/AddProduct'
import AllTags from '../../Pages/Tags/AllTags'
import AddTag from '../../Pages/Tags/AddTag'
import EditTag from '../../Pages/Tags/EditTag'
import AllVoucher from '../../Pages/Vouchers/AllVoucher'
import CreateVoucher from '../../Pages/Vouchers/AddVoucher'
import AllOrder from '../../Pages/Orders/AllOrder'
import EditOrder from '../../Pages/Orders/EditOrder'
import AllUsers from '../../Pages/Users/AllUsers'
import AllSubCategory from '../../Pages/SubCategory/AllSubCategory'
import AddSubCategory from '../../Pages/SubCategory/AddSubCategory'
import EditSubCategory from '../../Pages/SubCategory/EditSubCategory'
import AllColor from '../../Pages/Color/AllColor'
import AddColor from '../../Pages/Color/AddColor'
import EditColor from '../../Pages/Color/EditColor'
import AllSize from '../../Pages/Size/AllSize'
import AddSize from '../../Pages/Size/AddSize'
import EditSize from '../../Pages/Size/EditSize'
import AllFlavour from '../../Pages/Flavour/AllFlavour'
import AddFlavour from '../../Pages/Flavour/AddFlavour'
import EditFlavour from '../../Pages/Flavour/EditFlavour'
import AllSBanner from '../../Pages/Banner/AllSBanner'
import AllShopBanner from '../../Pages/ShopsBanner/AllShopBanner'
import AddShopBanner from '../../Pages/ShopsBanner/AddShopBanner'
import EditShopBanner from '../../Pages/ShopsBanner/EditShopBanner'
import AddBanner from '../../Pages/Banner/AddBanner'
import EditBanner from '../../Pages/Banner/EditBanner'
import AllRefrenceCompany from '../../Pages/RefrenceCompany/AllRefrenceCompany'
import AddRefrenceCompany from '../../Pages/RefrenceCompany/AddRefrenceCompany'
import EditRefrenceCompany from '../../Pages/RefrenceCompany/EditRefrenceCompany'
import AllCategoryTitel from '../../Pages/CategoryTitel/AllCategoryTitel'
import AddCategoryTitel from '../../Pages/CategoryTitel/AddCategoryTitel'
import EditCategoryTitel from '../../Pages/CategoryTitel/EditCategoryTitel'
import EditProduct from '../../Pages/Products/EditProduct '
import AllInnerSubCategory from '../../Pages/InnerSubCategory/AllInnerSubCategory'
import AddInnerSubCategory from '../../Pages/InnerSubCategory/AddInnerSubCategory'
import EditInnerSubCategory from '../../Pages/InnerSubCategory/EditInnerSubCategory'
import AllProductTag from '../../Pages/ProductTag/AllProductTag'
import AddProductTag from '../../Pages/ProductTag/AddProductTag'
import EditProductTag from '../../Pages/ProductTag/EditProductTag'
import AllContactQuery from '../../Pages/ContactQuery/AllContactQuery'
import Login from '../auth/Login'
import AllSubSubCategory from '../../Pages/SubSubCategory/AllSubSubCategory'
import AddSubSubCategory from '../../Pages/SubSubCategory/AddSubSubCategory'
import EditSubSubCategory from '../../Pages/SubSubCategory/EditSubSubCategory'
import AllReels from '../../Pages/Reels/AllReels'
import AddReel from '../../Pages/Reels/AddReels'
import EditReel from '../../Pages/Reels/EditReels'
import AddPromoBanners from '../../Pages/PromoBanner/AddPromoBanners'
import AllPromoBanners from '../../Pages/PromoBanner/AllPromoBanners'
import EditPromoBanners from '../../Pages/PromoBanner/EditPromoBanners'
import AllCakeBanners from '../../Pages/CakeBanners/AllCakeBanner'
import AddCakeBanner from '../../Pages/CakeBanners/AddCakeBanner'
import EditCakeBanner from '../../Pages/CakeBanners/EditCakeBanner'
import AllRecommendedCategory from '../../Pages/RecommendedCategory/AllRecommendedCategory'
import AddRecommendedCategory from '../../Pages/RecommendedCategory/AddRecommendedCategory'
import EditRecommendedCategory from '../../Pages/RecommendedCategory/EditRecommendedCategory'
import AllRecommendedProduct from '../../Pages/RecommendedProducts/AllRecommendedProduct'
import AddRecommendedProduct from '../../Pages/RecommendedProducts/AddRecommendedProduct'
import EditRecommendedProduct from '../../Pages/RecommendedProducts/EditRecommendedProduct'
import AllPincode from "../../Pages/State-Pincode/AllPincode"
import AddPincode from "../../Pages/State-Pincode/AddPincode"
import EditPincode from "../../Pages/State-Pincode/EditPincode"
import AllCoupon from '../../Pages/Coupon/AllCoupon'
import AddCoupon from '../../Pages/Coupon/AddCoupon'
import EditCoupon from '../../Pages/Coupon/EditCoupon'
import AllCountdown from '../../Pages/countdown/AllCountdown'
import AddCountdown from '../../Pages/countdown/AddCountdown'
import EditCountdown from '../../Pages/countdown/EditCountdown'
import AllAdmin from '../../Pages/AdminPermission/AllAdmin'
import AllSubscribeEmail from '../../Pages/Subscribe/AllSubscribe'
import AddAdmin from '../../Pages/AdminPermission/AddAdmin'
import AllPerantProduct from '../../Pages/ParancProduct/AllParancProduct'
import AddPerantProduct from '../../Pages/ParancProduct/AddParancProduct'
import EditPerantProduct from '../../Pages/ParancProduct/EditParancProduct'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { toast } from "react-toastify";

const Home = () => {

  // const login = sessionStorage.getItem("login")
  const [login, setLogins] = useState(false);

  const verifyAdmin = async () => {
    try {
      const response = await axios.get("https://api.cakenpetals.com/api/admin/verify-admin", { withCredentials: true });
      console.log("response==>", response?.data?.token)
      if (response.status === 200) {
        setLogins(true);
        sessionStorage.setItem("login", true);
        sessionStorage.setItem("Admintoken", response?.data?.token);
        sessionStorage.setItem("AdminData", JSON.stringify(response?.data?.data?.user));
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setLogins(false);
      } else {
        setLogins(false);
        console.log("error", error);
        toast.error(error?.response?.data?.message || "Login failed");
      }
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  // console.log("login===>", login)
  return (
    <>

      {
        login ? (
          <>
            <Header />
            <div className="rightside">
              <Routes>
                <Route path={"/dashboard"} element={<Dashboard />} />

                {/* Category --  */}
                <Route path={"/all-category"} element={<AllCategory />} />
                <Route path={"/add-category"} element={<AddCategory />} />
                <Route path={"/edit-category/:id"} element={<EditCategory />} />


                {/* Subcategory */}

                <Route path={"/all-subcategory"} element={<AllSubCategory />} />
                <Route path={"/add-subcategory"} element={<AddSubCategory />} />
                <Route path={"/edit-subcategory/:id"} element={<EditSubCategory />} />


                {/* Sub-Subcategory */}

                <Route path={"/all-sub-subcategory"} element={<AllSubSubCategory />} />
                <Route path={"/add-sub-subcategory"} element={<AddSubSubCategory />} />
                <Route path={"/edit-sub-subcategory/:id"} element={<EditSubSubCategory />} />

                {/* Recommended category */}

                <Route path={"/all-recommended-category"} element={<AllRecommendedCategory />} />
                <Route path={"/add-recommended-category"} element={<AddRecommendedCategory />} />
                <Route path={"/edit-recommended-category/:id"} element={<EditRecommendedCategory />} />


                <Route path={"/all-promo-banners"} element={<AllPromoBanners />} />
                <Route path={"/add-promo-banners"} element={<AddPromoBanners />} />
                <Route path={"/edit-promo-banners/:id"} element={<EditPromoBanners />} />



                <Route path={"/all-cake-banner"} element={<AllCakeBanners />} />
                <Route path={"/add-cake-banner"} element={<AddCakeBanner />} />
                <Route path={"/edit-cake-banner/:id"} element={<EditCakeBanner />} />




                {/* Color */}
                <Route path={"/all-color"} element={<AllColor />} />
                <Route path={"/add-color"} element={<AddColor />} />
                <Route path={"/edit-color/:id"} element={<EditColor />} />

                {/* Size */}
                <Route path={"/all-size"} element={<AllSize />} />
                <Route path={"/add-size"} element={<AddSize />} />
                <Route path={"/edit-size/:id"} element={<EditSize />} />

                {/* Flover */}
                <Route path={"/all-flower"} element={<AllFlavour />} />
                <Route path={"/add-flover"} element={<AddFlavour />} />
                <Route path={"/edit-flover/:id"} element={<EditFlavour />} />


                <Route path={"/all-ref-companies"} element={<AllRefrenceCompany />} />
                <Route path={"/add-ref-company"} element={<AddRefrenceCompany />} />
                <Route path={"/edit-ref-company/:id"} element={<EditRefrenceCompany />} />

                {/* Prant PerantProduct --  */}
                <Route path={"/all-perant-product"} element={<AllPerantProduct />} />
                <Route path={"/add-perant-product"} element={<AddPerantProduct />} />
                <Route path={"/edit-perant-product/:id"} element={<EditPerantProduct />} />

                {/* Product --  */}
                <Route path={"/all-products"} element={<AllProduct />} />
                <Route path={"/add-product"} element={<AddProduct />} />
                <Route path={"/edit-product/:id"} element={<EditProduct />} />

                {/* Recommended Product --  */}
                <Route path={"/all-recommended-products"} element={<AllRecommendedProduct />} />
                <Route path={"/add-recommended-product"} element={<AddRecommendedProduct />} />
                <Route path={"/edit-recommended-product/:id"} element={<EditRecommendedProduct />} />


                {/* --- Orders --- */}
                <Route path={"/all-users"} element={<AllUsers />} />

                <Route path={"/all-contact-query"} element={<AllContactQuery />} />


                {/* --- Vouchers --- */}
                <Route path={"/all-voucher"} element={<AllVoucher />} />   {/* // All Vouchers */}
                <Route path={"/add-voucher"} element={<CreateVoucher />} />

                {/* --- Tags --- */}
                <Route path={"/all-tags"} element={<AllTags />} />
                <Route path={"/add-tag"} element={<AddTag />} />
                <Route path={"/edit-tag/:id"} element={<EditTag />} />

                {/* --- Banners --- */}
                <Route path={"/all-shop-banners"} element={<AllShopBanner />} />
                <Route path={"/add-shop-banner"} element={<AddShopBanner />} />
                <Route path={"/edit-shop-banner/:id"} element={<EditShopBanner />} />

                {/* --- Banners --- */}
                <Route path={"/all-banners"} element={<AllSBanner />} />
                <Route path={"/add-banner"} element={<AddBanner />} />
                <Route path={"/edit-banner/:id"} element={<EditBanner />} />

                {/* --- Orders --- */}
                <Route path={"/all-orders"} element={<AllOrder />} />
                <Route path={"/order-details/:id"} element={<EditOrder />} />

                <Route path={"/all-category-titel"} element={<AllCategoryTitel />} />
                <Route path={"/add-category-titel"} element={<AddCategoryTitel />} />
                <Route path={"/edit-category-titel/:id"} element={<EditCategoryTitel />} />



                <Route path={"/all-inner-subcategory"} element={<AllInnerSubCategory />} />
                <Route path={"/add-innersubcategory"} element={<AddInnerSubCategory />} />
                <Route path={"/edit-innersubcategory/:id"} element={<EditInnerSubCategory />} />


                <Route path={"/all-product-tag"} element={<AllProductTag />} />
                <Route path={"/add-product-tag"} element={<AddProductTag />} />
                <Route path={"/edit-product-tag/:id"} element={<EditProductTag />} />



                <Route path={"/all-reels"} element={<AllReels />} />
                <Route path={"/add-reels"} element={<AddReel />} />
                <Route path={"/edit-reels/:id"} element={<EditReel />} />

                {/* all-PINCODE */}

                <Route path={"/all-pincode"} element={<AllPincode />} />
                <Route path={"/add-pincode"} element={<AddPincode />} />
                <Route path={"/edit-pincode/:id"} element={<EditPincode />} />

                {/* all-coupon */}
                <Route path={"/all-coupon"} element={<AllCoupon />} />
                <Route path={"/add-coupon"} element={<AddCoupon />} />
                <Route path={"/edit-coupon/:id"} element={<EditCoupon />} />

                {/* all-countdown */}
                <Route path={"/all-countdown"} element={<AllCountdown />} />
                <Route path={"/add-countdown"} element={<AddCountdown />} />
                <Route path={"/edit-countdown/:id"} element={<EditCountdown />} />

                {/* all-admin */}
                <Route path={'/all-admin'} element={<AllAdmin />} />
                <Route path={'/add-admin'} element={<AddAdmin />} />

                <Route path={'/all-subscribeEmail'} element={<AllSubscribeEmail />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/*" element={<Login />} />
          </Routes>
        )}
    </>
  )
}

export default Home