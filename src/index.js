const express = require("express");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
const customerRouter = require("./routers/customer");
const cors = require("cors");
const app = express();

const port = process.env.PORT;

app.use(express.json());

//set up cors
app.use(cors());

//set up routers
app.use(userRouter);
app.use(orderRouter);
app.use(customerRouter);

app.get("/", async (req, res) => {
    res.send({
        welcome:
            "Welcome to racket admin api. An API built for organizing tennis rackets for your customers. (still in development)",
    });
});

app.listen(port, () => {
    if (port === 3001) console.log(`http:localhost/${port}`);
});
