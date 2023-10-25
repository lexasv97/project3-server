const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        email: String,
        password: String,
        name: String,
        isBusiness: {type: Boolean, default: false},
        addresses: [{type: String}],
        phone: Number,
        items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
        services: [{type: Schema.Types.ObjectId, ref: 'Service'}],
        profileImage: {
            type: String,
            default: 'https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400.png'
        }
    },
    {
        timestamps: true,
    }
)

module.exports = model("User", userSchema);