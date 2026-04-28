const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://mariakanteliotis.github.io",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ------------------ DEBUG LOGGING ------------------
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ------------------ TEST ROUTE ------------------
app.get("/", (req, res) => {
    res.send("Tea Society Backend is working");
});

// ------------------ DATA ------------------
let orders = [];

// ------------------ GET ORDERS ------------------
app.get("/api/orders", (req, res) => {
    res.json(orders);
});

// ------------------ CREATE ORDER ------------------
app.post("/api/orders", (req, res) => {
    console.log("BODY RECEIVED:", req.body);

    const newOrder = {
        orderId: orders.length + 1,

        fullName: req.body.fullName || req.body.customer?.fullName,
        email: req.body.email || req.body.customer?.email,
        event: req.body.event || req.body.customer?.event,
        participation: req.body.participation || req.body.customer?.participation,
        comments: req.body.comments || req.body.customer?.comments,

        status: "pending"
    };

    orders.push(newOrder);

    console.log("New order added:", newOrder);

    res.status(201).json(newOrder);
});

// ------------------ APPROVE ------------------
app.put("/api/orders/:id/approve", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === id);

    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    order.status = "approved";

    res.json(order);
});

// ------------------ DECLINE ------------------
app.put("/api/orders/:id/decline", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === id);

    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    order.status = "declined";

    res.json(order);
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
