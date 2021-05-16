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

router.put("/customers/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "phoneNumber"];
    //checks to see if every element arr is valid update parameter
    const isAllowed = updates.every((i) => allowedUpdates.includes(i));

    //return bad request if any update parameters are not allowed
    if (!isAllowed)
        return res.status(400).send({ error: "invalid operation!" });

    try {
        const customer = await Customer.findOne({
            user: req.user._id,
            _id: req.params.id,
        });

        if (!customer) return res.sendStatus(404);

        updates.forEach((update) => {
            customer[update] = req.body[update];
        });
        await customer.save();
        res.send(customer);
    } catch (e) {
        res.status(400).send();
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
        res.sendStatus(400);
    }
});

module.exports = router;
