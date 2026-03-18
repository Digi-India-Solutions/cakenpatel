const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connectDb }


// // db.js
// const mongoose = require("mongoose");

// const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Database Connected Successfully");
//   } catch (error) {
//     console.error("❌ Database connection error:", error.message);
//     process.exit(1); // stop server if DB fails
//   }
// };

// // ✅ Correct export
// module.exports = { connectDb }