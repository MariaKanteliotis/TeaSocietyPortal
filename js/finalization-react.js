const { useState } = React;

function FinalizationApp() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        event: "",
        participation: "",
        comments: ""
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Simple validation
        if (!formData.fullName || !formData.email || !formData.event || !formData.participation) {
            setMessage("Please fill in all required fields");
            return;
        }

        // Send to YOUR Node.js backend
        fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            setMessage("Submitted successfully!");
            console.log(data);
        })
        .catch(err => {
            setMessage("Error submitting");
            console.error(err);
        });
    }

    return (
        <div className="card custom-card p-4">
            <h2>Finalization Form (React)</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <select
                    name="event"
                    className="form-select mb-3"
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
                    onChange={handleChange}
                />

                <button className="btn btn-success">Submit</button>
            </form>

            <p className="mt-3">{message}</p>
        </div>
    );
}

// Render React
ReactDOM.createRoot(document.getElementById("react-root")).render(<FinalizationApp />);
