const { Schema, model } = require("mongoose");

const businessSchema = new Schema(
    {
        email: String,
        password: String,
        name: String,
        location: String,
        items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
        services: [{type: Schema.Types.ObjectId, ref: 'Service'}],
        image: {
            type: String,
            default: 'https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg'
        }
    },
    {
        timestamps: true,
    }
)

module.exports = model("Business", businessSchema);