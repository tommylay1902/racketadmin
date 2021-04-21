const express = require("express");
require("../db/mongoose");
const auth = require("../middleware/auth");
const Stock = require("../models/stock");

const router = new express.Router();

//get all stock products related to user
router.get("/stock", auth, async (req, res) => {
    try {
        const stocks = await Stock.find({ user: req.user._id });
        res.send(stocks);
    } catch (e) {
        res.send(e);
    }
});

router.get("/stock/:id", auth, async (req, res) => {
    try {
        const stock = await Stock.find({
            user: req.user._id,
            _id: req.params.id,
        });
        res.send(stock);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post("/stock", auth, async (req, res) => {
    try {
        if (Object.keys({ ...req.body }).length === 0) throw new Error();
        const stock = new Stock({ ...req.body, user: req.user._id });
        await stock.save();
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.put("/stock/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["productName", "quantity"];
    //checks to see if every element arr is valid update parameter
    const isAllowed = updates.every((i) => allowedUpdates.includes(i));

    //return bad request if any update parameters are not allowed
    if (!isAllowed)
        return res.status(400).send({ error: "invalid operation!" });

    try {
        const stock = await Stock.findOne({
            user: req.user._id,
        });

        if (!stock) return res.sendStatus(404);

        updates.forEach((update) => {
            stock[update] = req.body[update];
        });
        await stock.save();
        res.send(stock);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete("/stock/:id", auth, async (req, res) => {
    try {
        const stock = Stock.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!stock) res.sendStatus(404);
        await stock.remove();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
});

module.exports = router;
