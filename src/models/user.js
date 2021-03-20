const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("must be a valid email");
        },
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

//hash before saving password
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.findUser = async (email, pass) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
};

//gen JWT when user is created or when user is logged in
userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this;
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        user.tokens = user.tokens.concat({ token });
        await user.save();
        return token;
    } catch (e) {
        console.log(e);
    }
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

userSchema.virtual("customers", {
    ref: "Customer",
    localField: "_id",
    foreignField: "user",
});
const User = mongoose.model("user", userSchema);

module.exports = User;
