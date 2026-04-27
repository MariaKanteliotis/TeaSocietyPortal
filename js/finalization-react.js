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

        // Validation
        if (!formData.fullName || !formData.email || !formData.event || !formData.participation) {
            setMessage("Please fill in all required fields");
            return;
        }

    
        fetch("https://tea-society-backend.onrender.com/api/orders", {
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

            // Reset form
            setFormData({
                fullName: "",
                email: "",
                event: "",
                participation: "",
                comments: ""
            });
        })
        .catch(err => {
            setMessage("Error submitting");
            console.error(err);
        });
    }

    return (
        <div>
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

                <button className="btn btn-success">Submit</button>
            </form>

            <p className="mt-3">{message}</p>
        </div>
    );
}

// Render React
ReactDOM.createRoot(document.getElementById("react-root")).render(<FinalizationApp />);
