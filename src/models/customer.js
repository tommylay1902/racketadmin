const mongoose = require("mongoose");
const validator = require("validator");

customerSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

customerSchema.virtual("orders", {
    ref: "order",
    localField: "_id",
    foreignField: "customer",
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
