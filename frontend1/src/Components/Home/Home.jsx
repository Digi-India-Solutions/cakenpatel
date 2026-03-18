import React, { lazy, Suspense } from "react";

import HomeBannerSlider from "../BannerSlider/HomeBannerSlider";
import Category from "../Category/Category";
import CakeBanners from "../CakeBanner/CakeBanner";
import ReelSection from "../ReelSection/ReelSection";
import BestSellingProduct from "../BestSelling/BestSellingProject";
import FeaturedProducts from "../FeatureProducts/FeatureProducts";
import Coustomize from "../Coustomize/Coustomize";
import Hero from "../Hero/Hero";

const CakeIngredientScroll = lazy(
  () => import("../CakeStory/CakeIngredientScroll"),
);
const PromoBanner = lazy(() => import("../PromoBanner/PromoBanner"));
const Occasions = lazy(() => import("../Occasions/Occasions"));
const Testimonial = lazy(() => import("../Testimonial/Testimonial"));
const Banner = lazy(() => import("../BottomBanner/Banner"));

const Home = () => {
  return (
    <main>
      <HomeBannerSlider />
      <Category />
      <CakeBanners />
      <ReelSection />
      <BestSellingProduct />
      <FeaturedProducts />
      <Coustomize />
      <Hero />

      <Suspense fallback={<div>Loading...</div>}>
        <CakeIngredientScroll />
        <PromoBanner />
        <Occasions />
        <Testimonial />
        <Banner />
      </Suspense>
    </main>
  );
};

export default Home;
