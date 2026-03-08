const Wishlist = require("../Model/Wishlist");

// ✅ ADD TO WISHLIST
exports.addWishlist = async (req, res) => {
    try {
        const { user, productId } = req.body;

        // check already exists
        const exists = await Wishlist.findOne({ user, productId });

        if (exists) {
            return res.status(200).json({
                success: true,
                message: "Already in wishlist",
            });
        }

        const wishlist = new Wishlist({
            user,
            productId,
        });

        await wishlist.save();

        res.status(201).json({
            success: true,
            message: "Added to wishlist",
            data: wishlist,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ REMOVE FROM WISHLIST
exports.removeWishlist = async (req, res) => {
  try {
    const { user, productId } = req.body;

    await Wishlist.findOneAndDelete({ user, productId });

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ GET USER WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ user: userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};



// ✅ CLEAR WISHLIST
exports.clearWishlist = async (req, res) => {
  try {
    const { user } = req.body;

    await Wishlist.deleteMany({ user });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
