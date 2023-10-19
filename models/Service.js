const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'Business'},
        description: String,
        image: String,
        category: String,
        location: String,
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

module.exports = model("Service", serviceSchema);