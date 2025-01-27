const router = require("express").Router();
const Order = require("../models/Order");
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");

// CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted.");
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET User Orders
router.get("/find/:userID", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userID: req.params.userID });
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date(lastMonth).setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } }, // Fix: $gte (greater than or equal) for filtering dates
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income); // Fix: Properly chaining `status` and `json`
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
