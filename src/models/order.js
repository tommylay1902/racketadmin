const mongoose = require("mongoose");
const validator = require("validator");

//create seperate racket model
orderSchema = new mongoose.Schema(
    {
        racketBrand: String,
        model: String,
        stringPattern: String,
        recTension: String,
        stringType: String,
        completed: Boolean,
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            //implement required customer later
            required: true,
            ref: "Customer",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
