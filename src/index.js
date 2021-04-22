const express = require("express");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
const customerRouter = require("./routers/customer");
const stockRouter = require("./routers/stock");
const cors = require("cors");
require("dotenv").config();

const app = express();
//set up port for specified environment
const port = process.env.PORT;

//json middleware
app.use(express.json());

//set up cors middleware
app.use(cors());

//set up routers
app.use(userRouter);
app.use(orderRouter);
app.use(customerRouter);
app.use(stockRouter);

app.get("/", async (req, res) => {
    res.send({
        welcome:
            "Welcome to racket admin api. An API built for organizing tennis rackets for your customers. (still in development)",
        GET: {
            "get users profile (need authentication)":
                "https://racketadmin.herokuapp.com/users/profile",
            "get customers (need authentication)":
                "https://racketadmin.herokuapp.com/users/customers",
        },
        POST: {
            "create user": "https://racketadmin.herokuapp.com/users/",
            "login user": "https://racketadmin.herokuapp.com/users/login",
            "logout user": "https://racketadmin.herokuapp.com/users/logout",
            "create customer (need authentication)":
                "https://racketadmin.herokuapp.com/customers",
            "create order(need authentication)":
                "https://racketadmin.herokuapp.com/orders/<customer-id>",
        },
        DELETE: {
            "delete user": "https://racketadmin.herokuapp.com/users/me",
            "delete customer":
                "https://racketadmin.herokuapp.com/customers/<customer-id>",
            "delete order":
                "https://racketadmin.herokuapp.com/orders/<order-id>",
        },
        PUT: {
            empty: "will update api for put operations",
        },
    });
});

app.listen(port, () => {
    if (port === 3001) console.log(`http:localhost/${port}`);
});
