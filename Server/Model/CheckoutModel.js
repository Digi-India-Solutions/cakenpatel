const mongoose = require("mongoose");

const addonProductSchema = new mongoose.Schema(
    {
        productId: { type: String, },
        name: { type: String, },
        price: { type: Number, },
        image: { type: String },
        quantity: { type: Number, default: 1 },
    },
    { _id: false }
);

const checkoutSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    walletUsed: { type: Number },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
    trackingOrders: [{
        date: { type: Date },
        status: { type: String, },
        massage: { type: String }
    }],
    delivery: {
        date: { type: String },
        time: { type: String }
    },
    cartItems: [
        {
            productId: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            weight: { type: String, },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            // deliveryDate: { type: String, required: true },
            addonProducts: [addonProductSchema],
            // eggOption: { type: String, required: true },
            massage: { type: String, }
        }
    ],
    specialNote: {
        occasion: { type: String },
        relation: { type: String },
        message: { type: String },
        toName: { type: String },
    },
    totalPrice: { type: Number, required: true },
    transactionId: { type: String },
    paymentStatus: { type: String, default: 'Pending' },
    orderStatus: { type: String, default: 'Order Is Placed' },
    paymentMode: { type: String, enum: ['online', 'cod'], default: "online" },
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Checkout = mongoose.model("Checkout", checkoutSchema);
module.exports = Checkout;
