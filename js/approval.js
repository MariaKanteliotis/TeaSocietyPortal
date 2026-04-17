$(document).ready(function () {
    loadPendingOrders();
});

function loadPendingOrders() {
    $.ajax({
        url: "http://localhost:3000/orders",
        method: "GET",
        success: function (data) {
            let output = "";

            data.forEach(order => {
                if (order.status === "pending") {
                    output += `
                        <div class="card mb-3 p-3">
                            <h5>${order.fullName}</h5>
                            <p>Email: ${order.email}</p>
                            <p>Event: ${order.event}</p>

                            <div>
                                <button class="btn btn-success btn-sm me-2"
                                    onclick="updateStatus(${order.id}, 'approved')">
                                    Approve
                                </button>

                                <button class="btn btn-danger btn-sm"
                                    onclick="updateStatus(${order.id}, 'declined')">
                                    Decline
                                </button>
                            </div>
                        </div>
                    `;
                }
            });

            if (output === "") {
                output = `<p class="text-center">No pending requests</p>`;
            }

            $("#approvalList").html(output);
        },
        error: function () {
            alert("Error loading data from server.");
        }
    });
}

function updateStatus(id, status) {
    $.ajax({
        url: `http://localhost:3000/orders/${id}`,
        method: "PUT",
        data: JSON.stringify({ status: status }),
        contentType: "application/json",
        success: function () {
            alert(`Order ${status}!`);
            loadPendingOrders(); 
        },
        error: function () {
            alert("Error updating status.");
        }
    });
}
    function downloadUsersJSON() {
    const users = JSON.parse(localStorage.getItem('storefront_user')) || [];
    if (users.length === 0) {
        alert("No users to download!");
        return;
    }
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.json";
    a.click();
    URL.revokeObjectURL(url);
}
