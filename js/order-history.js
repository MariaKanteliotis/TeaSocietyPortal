$(document).ready(function () {

    const API_URL = "https://tea-society-backend.onrender.com/api/orders";

    // Load all orders
    function loadOrders() {
        $.ajax({
            url: API_URL,
            method: "GET",
            success: function (orders) {
                displayOrders(orders);
            },
            error: function () {
                $("#orderTable").html(
                    "<tr><td colspan='5'>Error loading orders</td></tr>"
                );
            }
        });
    }

    // Display orders in table
    function displayOrders(orders) {
        const table = $("#orderTable");
        table.empty();

        if (orders.length === 0) {
            table.html("<tr><td colspan='5'>No orders found</td></tr>");
            return;
        }

        orders.forEach(order => {

            let statusClass = "pending";
            if (order.status === "approved") statusClass = "approved";
            if (order.status === "declined") statusClass = "declined";

            const row = `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.fullName || order.name}</td>
                    <td>${order.email}</td>
                    <td>${order.event}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${order.status}
                        </span>
                    </td>
                </tr>
            `;

            table.append(row);
        });
    }

    // 🔍 Search filter
    $("#search").on("keyup", function () {
        const value = $(this).val().toLowerCase();

        $("#orderTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Load on start
    loadOrders();
});
