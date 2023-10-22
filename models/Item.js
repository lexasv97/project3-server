const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User'},
        name: String,
        description: String,
        category: String,
        price: Number,
        image: {
            type: String,
            default: 'https://arthurmillerfoundation.org/wp-content/uploads/2018/06/default-placeholder-1024x1024.png'
        },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    },
    {
        timestamps: true,
    }
)

module.exports = model("Item", itemSchema);