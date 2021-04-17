const express = require("express");
require("../db/mongoose");
const auth = require("../middleware/auth");
const router = new express.Router();
const Order = require("../models/order");
const Customer = require("../models/customer");
const { ObjectId } = require("mongoose");

/// update for get orders
/// :id = customer
router.get("/orders/:id", auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!customer) return res.status(404).send();
        const orders = await Order.find({
            customer: customer._id,
        });
        res.send(orders);
    } catch (e) {
        res.send(400).status();
    }
});

//will get all orders pertaining to a user
router.get("/orders", auth, async (req, res) => {
    try {
        //get the customers with corresponding user id
        const customers = await Customer.find({
            user: req.user._id,
        });
        //user does not have access to customer if not found
        if (!customers) return res.status(404).send();
        //if found, find orders for these customers
        const idArr = customers.map((e) => {
            return e._id;
        });

        const orders = await Order.find({
            customer: { $in: idArr },
        });
        res.send(orders);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

/// :id = customer id
router.post("/orders/:id", auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
        });

        if (!customer) return res.status(404).send();
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

//:id = order id
router.delete("/orders/:id", auth, async (req, res) => {
    try {
        //find order with given id
        const order = await Order.findOne({
            _id: req.params.id,
        });

        //no order -> 404
        if (!order) return res.status(400).send();

        //find the customer with the given order and current user
        const customer = await Customer.findOne({
            _id: order.customer,
            user: req.user._id,
        });

        // no customer -> 404
        if (!customer) return res.send(404).send();

        await order.remove();
        res.send();
    } catch (e) {}
});

module.exports = router;
