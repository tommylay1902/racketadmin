const express = require("express");
require("../db/mongoose");
const auth = require("../middleware/auth");
const router = new express.Router();
const User = require("../models/user");

router.get("/users/profile", auth, async (req, res) => {
    res.send(req.user);
});

router.post("/users", async (req, res) => {
    try {
        const user = await new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.send(e);
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return req.token !== token.token;
        });

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.user._id });
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
