const express = require("express");
require("../db/mongoose");
const auth = require("../middleware/auth");
const Customer = require("../models/customer");
const router = new express.Router();

router.get("/customers", auth, async (req, res) => {
    try {
        const cust = await Customer.find({ user: req.user._id });
        res.send(cust);
    } catch (e) {}
});

router.post("/customers", auth, async (req, res) => {
    try {
        const cust = new Customer({
            ...req.body,
            user: req.user._id,
        });
        await cust.save();
        res.status(201).send();
    } catch (e) {
        res.status(404).send();
    }
});

router.delete("/customers/:id", auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        //no customer -> bad reauest
        if (!customer) return res.status(400).send();
        await customer.remove();
        res.send();
    } catch (e) {
        res.status().send();
    }
});

module.exports = router;
