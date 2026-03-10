const mongoose = require("mongoose")

const VariantSchema = new mongoose.Schema({
    // weight: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Size",
    //     default: null
    // },

    weight: {
        type: String,
        default: ''
    },
    // flover: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Flover",
    //     default: null
    // },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    // categoryName: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Main-Category",
    //     // required:true
    //     default: null
    // },
    // subcategoryName: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Subcategory",
    //     // required: true
    //     default: null
    // },
    // secondsubcategoryName: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "SecondSubcategory",
    //     // required: true
    //     default: null
    // },
    parentProductId: {
        type: mongoose.Schema.ObjectId,
        ref: "ParentProduct",
        default: null
    },
    recommendedProductId: [{
        type: mongoose.Schema.ObjectId,
        ref: "RecommendedProduct",
        default: null
    }],
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productDetails: {
        type: String,
        required: true,
    },
    Variant: {
        type: [VariantSchema],
        required: true,
    },
    productImage: {
        type: [String],
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: false
    },
    ActiveonFlavours: {
        type: Boolean,
        default: false
    },
    NameOnCake: {
        type: Boolean,
        default: false
    },
    FeaturedProducts: {
        type: Boolean,
        default: false
    },
    BestSellingProduct: {
        type: Boolean,
        default: false
    },
    eggless: {
        type: Boolean,
        default: false
    },
    deliveryTo60Min: {
        type: Boolean,
        default: false
    },
    ActiveonDeliveryDate: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product