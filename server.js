const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://mariakanteliotis.github.io"
}));

app.use(express.json());

// -----------------------------
let orders = [];
let idCounter = 1;

// -----------------------------
// GET all orders
app.get("/api/orders", (req, res) => {
    const status = req.query.status;

    if (status) {
        const filtered = orders.filter(o => o.status === status);
        return res.json(filtered);
    }

    res.json(orders);
});

// -----------------------------
// CREATE order
app.post("/api/orders", (req, res) => {
    const newOrder = {
        orderId: idCounter++,
        fullName: req.body.fullName,
        email: req.body.email,
        event: req.body.event,
        participation: req.body.participation,
        comments: req.body.comments,
        status: "pending"
    };

    orders.push(newOrder);
    res.json(newOrder);
});

// -----------------------------
// APPROVE order
app.put("/api/orders/:id/approve", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === id);
    if (!order) return res.status(404).json({ error: "Not found" });

    order.status = "approved";
    res.json(order);
});

// -----------------------------
// DECLINE order
app.put("/api/orders/:id/decline", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === id);
    if (!order) return res.status(404).json({ error: "Not found" });

    order.status = "declined";
    res.json(order);
});

// -----------------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
