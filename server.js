const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Tea Society Backend is working");
});

// data
let orders = [];

// routes
app.get("/api/orders", (req, res) => {
    res.json(orders);
});

app.post("/api/orders", (req, res) => {
    const newOrder = {
        orderId: orders.length + 1,
        fullName: req.body.customer?.fullName,
        email: req.body.customer?.email,
        comments: req.body.customer?.comments,
        items: req.body.items,
        total: req.body.total,
        status: "pending"
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.put("/api/orders/:id/approve", (req, res) => {
    const order = orders.find(o => o.orderId == req.params.id);
    if (!order) return res.status(404).json({ error: "Not found" });

    order.status = "approved";
    res.json(order);
});

app.put("/api/orders/:id/decline", (req, res) => {
    const order = orders.find(o => o.orderId == req.params.id);
    if (!order) return res.status(404).json({ error: "Not found" });

    order.status = "declined";
    res.json(order);
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
