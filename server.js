const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const FILE = 'orders.json';


function readOrders() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE));
}

function writeOrders(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.post('/orders', (req, res) => {
    const orders = readOrders();

    const newOrder = {
        id: Date.now(),
        ...req.body,
        status: "pending"
    };

    orders.push(newOrder);
    writeOrders(orders);

    res.json(newOrder);
});

app.get('/orders', (req, res) => {
    res.json(readOrders());
});

app.put('/orders/:id/approve', (req, res) => {
    let orders = readOrders();

    orders = orders.map(o => {
        if (o.id == req.params.id) o.status = "approved";
        return o;
    });

    writeOrders(orders);
    res.json({ message: "Approved" });
});

app.put('/orders/:id/decline', (req, res) => {
    let orders = readOrders();

    orders = orders.map(o => {
        if (o.id == req.params.id) o.status = "declined";
        return o;
    });

    writeOrders(orders);
    res.json({ message: "Declined" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
