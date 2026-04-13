const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const FILE = path.join(__dirname, "orders.json");

app.use(cors());
app.use(express.json());

function readOrders() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(FILE));
}

function writeOrders(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/orders", (req, res) => {
    const orders = readOrders();
    res.json(orders);
});

app.post("/orders", (req, res) => {
    let orders = readOrders();

    const newOrder = {
        id: Date.now(),
        fullName: req.body.fullName,
        email: req.body.email,
        event: req.body.event,
        participationType: req.body.participationType,
        comments: req.body.comments,
        status: "pending",
        date: new Date().toLocaleString()
    };

    orders.push(newOrder);
    writeOrders(orders);

    res.json(newOrder);
});

app.put("/orders/:id", (req, res) => {
    let orders = readOrders();

    orders = orders.map(order => {
        if (order.id == req.params.id) {
            order.status = req.body.status;
        }
        return order;
    });

    writeOrders(orders);

    res.json({ message: "Status updated" });
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log("Tea Society Server Running");
    console.log(`http://localhost:${PORT}`);
    console.log("=================================");
});
