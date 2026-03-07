const Razorpay = require('razorpay');
const crypto = require('crypto');
const Checkout = require('../Model/CheckoutModel');
const User = require('../Model/SignupModel')
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "rzp_test_XPcfzOlm39oYi8",
    key_secret: process.env.RAZORPAY_API_SECRET || "Q79P6w7erUar31TwW4GLAkpa",
});

// const createCheckout = async (req, res) => {
//     try {
//         const { userId, name, email, phone, address, state, city, pin, cartItems, totalPrice, paymentMode } = req.body;

//         if (!userId || !name || !email || !phone || !address || !state || !city || !pin || !Array.isArray(cartItems) || cartItems.length === 0 || totalPrice <= 0) {
//             return res.status(400).json({ message: "All fields are required and must be valid." });
//         }

//         // Ensure totalPrice has only two decimal places
//         const formattedTotalPrice = Number(totalPrice.toFixed(2));

//         if (paymentMode === "cod") {
//             const newCheckout = new Checkout({
//                 userId, name, email, phone, address, state, city, pin, cartItems, totalPrice: formattedTotalPrice,
//                 transactionId: null, orderStatus: 'Order Confirmed', paymentMode, paymentStatus: 'Pending',
//             });
//             const savedCheckout = await newCheckout.save();
//             return res.status(200).json(savedCheckout);
//         }

//         const options = {
//             amount: Math.round(totalPrice * 100), // Convert to paise
//             currency: 'INR',
//             receipt: `receipt_${Date.now()}`,
//         };

//         const order = await razorpay.orders.create(options);
//         if (!order) {
//             return res.status(500).json({ message: "Razorpay order creation failed." });
//         }
//         const newCheckout = new Checkout({
//             userId, name, email, phone, address, state, city, pin, cartItems, totalPrice: formattedTotalPrice,
//             transactionId: order.id, orderStatus: 'Order Confirmed', paymentMode, paymentStatus: 'Pending',
//         });
//         const savedCheckout = await newCheckout.save();

//         res.status(200).json({
//             message: 'Order created successfully. Proceed with payment.',
//             checkout: savedCheckout,
//             razorpayOrderId: order.id,
//             amount: options.amount,
//             currency: options.currency,
//         });
//     } catch (error) {
//         console.error("Checkout creation error:", error);
//         res.status(500).json({ message: "Server error occurred while creating checkout." });
//     }
// };

const createCheckout = async (req, res) => {
    try {

        const {
            userId,
            walletUsed,
            userDetails,
            deliveryAddress,
            deliverySlot,
            items,
            billing,
            paymentMode,
            specialNote,
            specialInstructions,
            orderDate,
        } = req.body;

        /* ------------------ ✅ VALIDATION ------------------ */

        if (
            !userId ||
            !deliveryAddress?.receiverName ||
            !deliveryAddress?.phone ||
            !deliveryAddress?.house ||
            !deliveryAddress?.city ||
            !deliveryAddress?.pincode ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !billing?.finalAmount
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid checkout data.",
            });
        }

        /* ------------------ ✅ FORMAT CART ITEMS ------------------ */

        const formattedCartItems = items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            weight: item.weight || "",
            image: item.image?.replace(/\\/g, "/"),
            price: item.price,
            totalPrice: item.totalPrice,
            addonProducts: item.addonProducts || [],
            massage: item?.massage || "",
        }));

        /* ------------------ ✅ ADDRESS ------------------ */

        const fullAddress = `${deliveryAddress.house}, ${deliveryAddress.area}, ${deliveryAddress.city}, ${deliveryAddress.pincode}`;

        const formattedTotalPrice = Number(
            parseFloat(billing.finalAmount).toFixed(2)
        );

        const trackingOrders = [
            {
                date: new Date().toDateString(),
                status: "Order Confirmed",
                massage: "Your order has been placed successfully",
            },
        ];

        /* ================== 💰 COD ORDER ================== */

        if (paymentMode?.toLowerCase() === "cod") {
            console.log("userExst==>", userId)
            const userExst = await User.findById(userId)
            console.log("userExst==>", userExst)
            const newCheckout = new Checkout({
                userId,
                name: deliveryAddress.receiverName,
                email: userDetails?.email,
                phone: deliveryAddress.phone,
                address: fullAddress,
                state: deliveryAddress.state || "N/A",
                city: deliveryAddress.city,
                pin: deliveryAddress.pincode,
                delivery: {
                    date: deliverySlot?.date,
                    time: deliverySlot?.time,
                },
                cartItems: formattedCartItems,
                totalPrice: formattedTotalPrice,
                transactionId: null,
                orderStatus: "Order Confirmed",
                paymentMode: "cod",
                paymentStatus: "Pending",
                trackingOrders,
                specialNote,
                specialInstructions,
                walletUsed: Number(walletUsed),
                orderDate,
            });

            const savedCheckout = await newCheckout.save();
            userExst.walletBalance = walletUsed > 0 ? 0 : userExst?.walletBalance
            userExst.save()
            return res.status(200).json({ success: true, message: "Order placed successfully (COD).", data: savedCheckout,userExst });
        }

        /* ================== 💳 ONLINE PAYMENT ================== */

        const options = {
            amount: Math.round(formattedTotalPrice * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({
                success: false,
                message: "Razorpay order creation failed.",
            });
        }

        const newCheckout = new Checkout({
            userId,
            name: deliveryAddress.receiverName,
            email: userDetails?.email,
            phone: deliveryAddress.phone,
            address: fullAddress,
            state: deliveryAddress.state || "N/A",
            city: deliveryAddress.city,
            pin: deliveryAddress.pincode,
            delivery: {
                date: deliverySlot?.date,
                time: deliverySlot?.time,
            },
            cartItems: formattedCartItems,
            totalPrice: formattedTotalPrice,
            trackingOrders,
            transactionId: order.id,
            orderStatus: "Order Created",
            paymentMode: "online",
            paymentStatus: "Pending",
            specialNote,
            specialInstructions,
            orderDate,
        });

        const savedCheckout = await newCheckout.save();

        return res.status(200).json({
            success: true,
            message: "Order created. Proceed to payment.",
            checkout: savedCheckout, razorpayOrderId: order.id, amount: options.amount, currency: options.currency,
        });

    } catch (error) {
        console.error("Checkout creation error:", error);
        return res.status(500).json({ success: false, message: "Server error while creating checkout.", });
    }
};



const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed. Missing parameters." });
        }
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET || "1xt3UXSTLfyVhQa3G9SSVIKY");
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            const updatedCheckout = await Checkout.findOneAndUpdate(
                { transactionId: razorpay_order_id },
                { paymentStatus: 'Success', orderStatus: 'Order Confirmed' },
                { new: true }
            );
            if (!updatedCheckout) {
                return res.status(404).json({ message: "Order not found." });
            }

            return res.status(200).json({ message: 'Payment successful and order confirmed.', checkout: updatedCheckout });
        } else {
            return res.status(400).json({ message: 'Invalid signature, payment verification failed.' });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: 'Server error during payment verification.' });
    }
};


const getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await Checkout.find({});
        res.status(200).json(checkouts.reverse());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while retrieving checkouts." });
    }
};

const getCheckoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json(checkout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while retrieving checkout." });
    }
};

const deleteCheckout = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCheckout = await Checkout.findByIdAndDelete(id);
        if (!deletedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json({ message: "Checkout deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while deleting checkout." });
    }
};

const updateCheckoutStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus, orderStatusMassage } = req.body;
        const updatedCheckout = await Checkout.findByIdAndUpdate(
            id,
            {
                orderStatus,
                paymentStatus,
                $push: {
                    trackingOrders: {
                        date: new Date(),
                        status: orderStatus,
                        massage: orderStatusMassage,
                    },
                },
            },  // Fields to update
            { new: true, runValidators: true } // Return updated document and run validators
        );
        if (!updatedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json(updatedCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while updating checkout status." });
    }
};

const getCheckOutByUserID = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Checkout.find({ userId });  // find based on userId, not findOne
        if (!data.length) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    createCheckout,
    getAllCheckouts,
    getCheckoutById,
    deleteCheckout,
    updateCheckoutStatus,
    getCheckOutByUserID,
    verifyPayment,
};
