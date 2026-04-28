const express = require("express");
const cors = require("cors");

const app = express();

// ------------------ CORS ------------------
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

// ------------------ DATA (TEMP STORAGE) ------------------
let orders = [];

// ------------------ GET ORDERS ------------------
app.get("/api/orders", (req, res) => {
    console.log("Returning orders:", orders);
    res.json(orders);
});

// ------------------ CREATE ORDER ------------------
app.post("/api/orders", (req, res) => {
    console.log("BODY RECEIVED:", req.body);

    const newOrder = {
        orderId: orders.length + 1,

        fullName:
            req.body.fullName ||
            req.body.name ||
            req.body.customer?.fullName ||
            "Unknown",

        email:
            req.body.email ||
            req.body.customer?.email ||
            "No Email",

        event:
            req.body.event ||
            req.body.customer?.event ||
            "No Event",

        participation:
            req.body.participation ||
            req.body.customer?.participation ||
            "N/A",

        comments:
            req.body.comments ||
            req.body.customer?.comments ||
            "",

        status: "pending"
    };

    orders.push(newOrder);

    console.log("New order added:", newOrder);

    res.status(201).json(newOrder);
});

// ------------------ APPROVE ORDER ------------------
app.put("/api/orders/:id/approve", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === id);

    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    order.status = "approved";

    console.log("Order approved:", order);

    res.json(order);
});

// ------------------ DECLINE ORDER ------------------
app.put("/api/orders/:id/decline", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === id);

    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    order.status = "declined";

    console.log("Order declined:", order);

    res.json(order);
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
