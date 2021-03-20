const express = require("express");
require("../db/mongoose");
const auth = require("../middleware/auth");
const Customer = require("../models/customer");
const router = new express.Router();

router.get("/customers", auth, async (req, res) => {
    //implement pagination later
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

module.exports = router;
