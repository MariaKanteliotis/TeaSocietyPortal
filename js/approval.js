$(document).ready(function () {

    const API_URL = "https://tea-society-backend.onrender.com/api/orders";

    // Load pending orders
    function loadPendingOrders() {
        $.ajax({
            url: API_URL + "?status=pending",
            method: "GET",
            success: function (orders) {
                displayOrders(orders);
            },
            error: function () {
                alert("Error loading orders");
            }
        });
    }

    // Display orders
    function displayOrders(orders) {
        const container = $("#approvalList");
        container.empty();

        if (orders.length === 0) {
            container.html("<p>No pending submissions</p>");
            return;
        }

        orders.forEach(order => {
            const card = `
                <div class="card mb-3 p-3">
                    <h5>${order.fullName || order.name}</h5>
                    <p>Email: ${order.email}</p>
                    <p>Event: ${order.event}</p>
                    <p>Type: ${order.participation || order.type}</p>

                    <button class="btn btn-success me-2 approve-btn" data-id="${order.orderId}">
                        Approve
                    </button>

                    <button class="btn btn-danger decline-btn" data-id="${order.orderId}">
                        Decline
                    </button>
                </div>
            `;

            container.append(card);
        });
    }

    // Approve
    $(document).on("click", ".approve-btn", function () {
        const id = $(this).data("id");

        $.ajax({
            url: `${API_URL}/${id}/approve`,
            method: "PUT",
            success: function () {
                alert("Approved!");
                loadPendingOrders();
            },
            error: function () {
                alert("Error approving");
            }
        });
    });

    // Decline
    $(document).on("click", ".decline-btn", function () {
        const id = $(this).data("id");

        $.ajax({
            url: `${API_URL}/${id}/decline`,
            method: "PUT",
            success: function () {
                alert("Declined!");
                loadPendingOrders();
            },
            error: function () {
                alert("Error declining");
            }
        });
    });

    // Initial load
    loadPendingOrders();
});
