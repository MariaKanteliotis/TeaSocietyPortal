const { useState, useEffect } = React;

function FinalizationApp() {
    const [cart, setCart] = useState([]);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        event: "",
        participation: "",
        comments: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function getTotal() {
        return cart.reduce((sum, item) => sum + item.price, 0);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!formData.fullName || !formData.email) {
            setMessage("Please complete required fields.");
            return;
        }

        const orderData = {
            fullName: formData.fullName,
            email: formData.email,
            event: formData.event,
            participation: formData.participation,
            comments: formData.comments,
            items: cart,
            total: getTotal()
        };

        fetch("https://teasocietyportal.onrender.com/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Server error");
            }
            return res.json();
        })
        .then(data => {
            setMessage("Order finalized successfully!");

            // clear cart
            localStorage.removeItem("cart");
            setCart([]);

            // reset form
            setFormData({
                fullName: "",
                email: "",
                event: "",
                participation: "",
                comments: ""
            });
        })
        .catch(err => {
            console.error(err);
            setMessage("Error submitting order.");
        });
    }

    return (
        <div>
            <h4 className="mb-3">Cart Items</h4>

            {cart.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                <ul className="list-group mb-4">
                    {cart.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            {item.description}
                            <span>${item.price.toFixed(2)}</span>
                        </li>
                    ))}
                    <li className="list-group-item fw-bold">
                        Total: ${getTotal().toFixed(2)}
                    </li>
                </ul>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    value={formData.fullName}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    value={formData.email}
                    onChange={handleChange}
                />

                <select
                    name="event"
                    className="form-select mb-3"
                    value={formData.event}
                    onChange={handleChange}
                >
                    <option value="">Select Event</option>
                    <option>Spring Tea Tasting</option>
                    <option>Matcha Workshop</option>
                    <option>Tea Social</option>
                </select>

                <select
                    name="participation"
                    className="form-select mb-3"
                    value={formData.participation}
                    onChange={handleChange}
                >
                    <option value="">Participation Type</option>
                    <option>In-Person</option>
                    <option>Virtual</option>
                </select>

                <textarea
                    name="comments"
                    placeholder="Comments"
                    className="form-control mb-3"
                    value={formData.comments}
                    onChange={handleChange}
                />

                <button className="btn btn-success">
                    Finalize Order
                </button>
            </form>

            <p className="mt-3">{message}</p>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("react-root")).render(<FinalizationApp />);
