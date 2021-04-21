const mongoose = require("mongoose");

stockSchema = new mongoose.Schema({
    productName: String,
    quantity: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

const Stock = mongoose.model("stock", stockSchema);

module.exports = Stock;
