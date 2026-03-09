// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv")
// dotenv.config()


// const express = require("express")
// const { connectDb } = require("./DB/ConntectDb")
// const cors = require("cors")
// const BannerRouter = require("./Router/BannerRouter")
// const CakeBannersRouter = require("./Router/cakeBannerRouter")
// const MainCategoryRouter = require("./Router/MainCategoryRouter")
// const SubcCategoryRouter = require("./Router/SubcategoryRouter")
// const ColorRouter = require("./Router/ColorRouter")
// const SizeRouter = require("./Router/SizeRouter")
// const FloverRouter = require("./Router/FloverRouter")
// const RefrenceRouter = require("./Router/RefrenceRouter")
// const TagRouter = require("./Router/tagRoutes")
// const CategoryTitelRouter = require("./Router/categoryTitelRoutes")
// const ProductRouter = require("./Router/productRoutes")
// const InnerSubcategoryRouter = require("./Router/InnerSubcategoryRouter")
// const ProductTagRouter = require("./Router/ProductTagRouter")
// const checkoutRouter = require("./Router/CheckoutRouter")
// const userRouter = require("./Router/UserRouter")
// const ContactRouter = require("./Router/contactRoutes")
// const ReelRouter = require("./Router/ReelRouter")
// const PromoBannerRouter = require("./Router/PromoBannerRouter")
// const SecondSubCategoryRouter = require("./Router/SecondSubCategoryRouter")
// const RecommendedCategoryRouter = require("./Router/RecommendedCategoryRouter")
// const RecommendedProductRoutes = require("./Router/RecommendedProductRoutes")
// const PinCodeRouter = require("./Router/PincodeRouter")
// const wishlistRouter = require("./Router/wishlistRoutes")
// const CouponsRouter = require("./Router/CouponsRouter")
// const googleApiRouter = require("./Router/googleApiRouter")
// const ActiveOrderRouter = require("./Router/ActiveOrderRouter")
// const CountDownRouter = require("./Router/CountDownRouter")
// const SubscribeEmailRouter = require("./Router/SubscribeEmailRouter")
// const ParentProductRouter = require("./Router/ParentProductRouter")
// const ProductPreviewRouter = require("./Router/ProductPeviewRouter")

// const app = express()

// const allowedOrigins = [
//   'https://api.ssdipl.com',     // ✅ REAL 
//   'http://localhost:7000',
//   'http://localhost:3001',
//   'http://localhost:3000',
//   'http://localhost:3002',
//   // 'https://admin.ssdipl.com',
//   // 'https://www.ssdipl.com',
//   // 'https://ssdipl.com',
//   'https://api.cakenpetals.com',
//   'https://www.cakenpetals.com',
//   'https://cakenpetals.com',
//   'https://admin.cakenpetals.com'
// ];


// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));


// app.use(express.json())
// app.set(express.static("./Public"))
// app.use("/Public", express.static("Public"))
// app.use(cookieParser());

// connectDb()

// app.get("/", (req, res) => {
//   res.send("Server Is Running")
// })


// app.use("/api", BannerRouter)
// app.use("/api/cake-banner", CakeBannersRouter)
// app.use("/api", MainCategoryRouter)
// app.use("/api", SubcCategoryRouter)
// app.use("/api", ColorRouter)
// app.use("/api", SizeRouter)
// app.use("/api", FloverRouter)
// app.use("/api", RefrenceRouter)
// app.use("/api", TagRouter)
// app.use("/api", CategoryTitelRouter)
// app.use("/api", ProductRouter)
// app.use("/api", InnerSubcategoryRouter)
// app.use("/api", ProductTagRouter)
// app.use("/api", checkoutRouter)
// app.use("/api", userRouter)
// app.use("/api", ContactRouter)
// app.use("/api/reel", ReelRouter)
// app.use("/api/promo-banner", PromoBannerRouter)
// app.use("/api/second-sub-category", SecondSubCategoryRouter)
// app.use("/api/recommended-category", RecommendedCategoryRouter)
// app.use("/api/recommended-product", RecommendedProductRoutes)
// app.use("/api/pincode", PinCodeRouter)
// app.use("/api/wishlist", wishlistRouter)
// app.use("/api/coupon", CouponsRouter)
// app.use("/api/google-api", googleApiRouter)
// app.use("/api/active-order", ActiveOrderRouter)
// app.use("/api/countdown", CountDownRouter)
// app.use("/api/subscribe-email", SubscribeEmailRouter)
// app.use("/api/parent-product", ParentProductRouter)
// app.use("/api/product-preview", ProductPreviewRouter)


// app.listen(process.env.PORT, () => {
//   console.log(`Server Start in ${process.env.PORT}`)
// })


const dotenv = require("dotenv");
dotenv.config(); // ✅ must be first — loads .env before anything reads process.env

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");   // ✅ FIX: was used but never imported
const morgan = require("morgan");   // ✅ FIX: was async-imported incorrectly
const { connectDb } = require("./DB/ConntectDb");

// ── Routers ───────────────────────────────────────────────────────────────────
const BannerRouter = require("./Router/BannerRouter");
const CakeBannersRouter = require("./Router/cakeBannerRouter");
const MainCategoryRouter = require("./Router/MainCategoryRouter");
const SubcCategoryRouter = require("./Router/SubcategoryRouter");
const ColorRouter = require("./Router/ColorRouter");
const SizeRouter = require("./Router/SizeRouter");
const FloverRouter = require("./Router/FloverRouter");
const RefrenceRouter = require("./Router/RefrenceRouter");
const TagRouter = require("./Router/tagRoutes");
const CategoryTitelRouter = require("./Router/categoryTitelRoutes");
const ProductRouter = require("./Router/productRoutes");
const InnerSubcategoryRouter = require("./Router/InnerSubcategoryRouter");
const ProductTagRouter = require("./Router/ProductTagRouter");
const checkoutRouter = require("./Router/CheckoutRouter");
const userRouter = require("./Router/UserRouter");
const ContactRouter = require("./Router/contactRoutes");
const ReelRouter = require("./Router/ReelRouter");
const PromoBannerRouter = require("./Router/PromoBannerRouter");
const SecondSubCategoryRouter = require("./Router/SecondSubCategoryRouter");
const RecommendedCategoryRouter = require("./Router/RecommendedCategoryRouter");
const RecommendedProductRoutes = require("./Router/RecommendedProductRoutes");
const PinCodeRouter = require("./Router/PincodeRouter");
const wishlistRouter = require("./Router/wishlistRoutes");
const CouponsRouter = require("./Router/CouponsRouter");
const googleApiRouter = require("./Router/googleApiRouter");
const ActiveOrderRouter = require("./Router/ActiveOrderRouter");
const CountDownRouter = require("./Router/CountDownRouter");
const SubscribeEmailRouter = require("./Router/SubscribeEmailRouter");
const ParentProductRouter = require("./Router/ParentProductRouter");
const ProductPreviewRouter = require("./Router/ProductPeviewRouter");

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();

// ── Allowed Origins ───────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:7000",
  "https://cakenpetals.com",
  "https://www.cakenpetals.com",
  "https://admin.cakenpetals.com",
  "https://api.cakenpetals.com",
  "https://api.ssdipl.com",
];

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — ORDER MATTERS
// ─────────────────────────────────────────────────────────────────────────────

// 1. Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow images/files from /Public to load cross-origin
  })
);
app.disable("x-powered-by"); // hide Express fingerprint

// 2. Request logger (dev only)
// ✅ FIX: morgan is a regular CJS module — no await/dynamic import needed
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 3. CORS — must be before cookieParser and routes
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (Postman, mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // ✅ required — tells browser to send cookies cross-origin
  })
);

// 4. Cookie parser — before ANY route that reads req.cookies
app.use(cookieParser());

// 5. Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 6. Static files
app.use("/Public", express.static("Public"));

// ── Database ──────────────────────────────────────────────────────────────────
connectDb();

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (_req, res) => res.send("Server is running ✅"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", BannerRouter);
app.use("/api/cake-banner", CakeBannersRouter);
app.use("/api", MainCategoryRouter);
app.use("/api", SubcCategoryRouter);
app.use("/api", ColorRouter);
app.use("/api", SizeRouter);
app.use("/api", FloverRouter);
app.use("/api", RefrenceRouter);
app.use("/api", TagRouter);
app.use("/api", CategoryTitelRouter);
app.use("/api", ProductRouter);
app.use("/api", InnerSubcategoryRouter);
app.use("/api", ProductTagRouter);
app.use("/api", checkoutRouter);
app.use("/api", userRouter);
app.use("/api", ContactRouter);
app.use("/api/reel", ReelRouter);
app.use("/api/promo-banner", PromoBannerRouter);
app.use("/api/second-sub-category", SecondSubCategoryRouter);
app.use("/api/recommended-category", RecommendedCategoryRouter);
app.use("/api/recommended-product", RecommendedProductRoutes);
app.use("/api/pincode", PinCodeRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/coupon", CouponsRouter);
app.use("/api/google-api", googleApiRouter);
app.use("/api/active-order", ActiveOrderRouter);
app.use("/api/countdown", CountDownRouter);
app.use("/api/subscribe-email", SubscribeEmailRouter);
app.use("/api/parent-product", ParentProductRouter);
app.use("/api/product-preview", ProductPreviewRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Global error:", err.message);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});