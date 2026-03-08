const mongoose = require("mongoose");


const homeSettingSchema = new mongoose.Schema({
    homeLevel: {
        type: String,
        enum : ["category", "subcategory", "subsubcategory"],
        required: true,
        default: "category",

    },

},{
    timestamps:true
}
)

module.exports = mongoose.model("HomeSetting", homeSettingSchema);