const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User'},
        name: String,
        description: String,
        category: String,
        location: String,
        image: {
            type: String,
            default: 'https://curie.pnnl.gov/sites/default/files/default_images/default-image_0.jpeg'
        },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    },
    {
        timestamps: true,
    }
)

module.exports = model("Service", serviceSchema);