const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true }, // Changed `userID` to `userId` for consistency
        products: [
            {
                productId: { type: String }, // Changed to camelCase for consistency
                quantity: { type: Number, default: 1 },
            },
        ],
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Export the correct schema
module.exports = mongoose.model("Cart", CartSchema);