const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let orders = [];

// root test
app.get("/", (req, res) => {
    res.send("Backend working");
});

// GET orders
app.get("/api/orders", (req, res) => {
    res.json(orders);
});

// POST order
app.post("/api/orders", (req, res) => {
    const newOrder = {
        orderId: orders.length + 1,
        ...req.body,
        status: "pending"
    };
    orders.push(newOrder);
    res.json(newOrder);
});

app.listen(3000, () => console.log("Server running"));
