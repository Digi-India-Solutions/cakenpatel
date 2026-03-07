import React from "react";
import "./App.css";
import "./allResponsive.css";
import "./responsive.css";
// import { HashRouter as Router } from 'react-router-dom';
// import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./Components/Header/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import AboutUs from "./Components/AboutUs/AboutUs";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AllCakes from "./Pages/AllCakes/AllCakes";
import SubSubCat from "./Pages/SubSubCategories/SubSubCategories";
import AllCandles from "./Pages/AllCandles/AllCandles";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Cart from "./Pages/Cart/Cart";
import Login from "./Pages/Login/Login";
// import AllProducts from "./Components/AllProducts/AllProducts";
import TermsConditions from "./Pages/FooterPages/TermsConditions";
import PrivacyPolicy from "./Pages/FooterPages/PrivacyPolicy";
import FAQ from "./Pages/FooterPages/FAQ";
import AllProducts from "./Pages/AllProducts/AllProducts";
import CheckOut from "./Pages/checkout/Checkout";
import SuccessPage from "./Pages/successpage/SuccessPage";
import Profile from "./Pages/Profile/Profile";
import OrderTracking from "./Pages/OrderTracking/OrderTracking";
import QA from "./Pages/Faq/Faq"
import ReferAndEarn from "./Pages/ReferEarn/ReferEarn";
import SubSubcategory from "./Pages/SubSubCategories/SubSubCategories"
import Wishlist from './Components/Wishlist/Wishlist'
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import AllProductByChildCategory from "./Pages/AllProductByChildCategory/AllProductByChildCategory";
import CancellationRefund from "./Pages/FooterPages/CancellationRefund";
import EggLess from "./Components/EggLess/EggLess";
import WhatsAppChat from "./Components/WhatsApp/WhatsApp";



const App = () => {
  return (
    <>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <ScrollToTop />
        <Header />
        <EggLess />
        <WhatsAppChat />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/cancellation-refund-policy" element={<CancellationRefund />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/product-related/:subcatname" element={<AllCakes />} />
          <Route path="/:subcatname" element={<AllProductByChildCategory />} />
          <Route path="/sub-subcategory/:subcatname" element={<SubSubcategory />} />
          <Route path="/candle/all-candles" element={<AllCandles />} />
          <Route path="/product-details/:name" element={<ProductDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/terms-&-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/frequently-asked-questions" element={<FAQ />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/faq" element={<QA />} />
          <Route path="/refer" element={<ReferAndEarn />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
