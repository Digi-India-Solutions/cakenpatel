const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    title: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false, trim: true },
    minAmount: { type: Number, },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: { type: Date, default: Date.now, },

});

couponSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Coupon', couponSchema);

