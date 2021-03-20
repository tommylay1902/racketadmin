const express = require("express");
require("../db/mongoose");
const auth = require("../middleware/auth");
const router = new express.Router();
const Order = require("../models/order");
const Customer = require("../models/customer");

router.post("/orders/:id", auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
        });

        if (!customer) return res.status(400).send();
        const order = await new Order({
            ...req.body,
            customer: customer._id,
        });
        await order.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete("/orders/:id", auth, async (req, res) => {
    try {
        //find order with given id
        const order = await Order.findOne({
            _id: req.params.id,
        });

        //no order -> bad reauest
        if (!order) return res.status(400).send();

        //find the customer with the given order and current user
        const customer = await Customer.findOne({
            _id: order.customer,
            user: req.user._id,
        });

        // no customer -> bad request
        if (!customer) return res.send(400).send();

        await order.remove();
        res.send();
    } catch (e) {}
});

module.exports = router;
