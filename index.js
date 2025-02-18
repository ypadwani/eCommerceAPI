const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productsRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL
    )
    
    .then(() => console.log("Db connection successful"))
    .catch((err) => {
        console.log(err)
    });


    app.use(express.json());
    app.use("/api/auth", authRoute)
    app.use("/api/users", userRoute)
    app.use("/api/products", productsRoute)
    app.use("/api/carts", cartRoute)
    app.use("/api/orders", orderRoute)

app.listen(process.env.PORT || 5001, () => {
    console.log("Backend server is running!");
});