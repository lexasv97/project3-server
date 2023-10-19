const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
    {
        comment: { type: String, maxlength: 200 },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        user: { type: Schema.Types.ObjectId, ref: "User" }
    },
    {
        timestamps: true,
    }
);

module.exports = model("Review", reviewSchema);