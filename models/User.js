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
            default: 'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
        }
    },
    {
        timestamps: true,
    }
)

module.exports = model("User", userSchema);