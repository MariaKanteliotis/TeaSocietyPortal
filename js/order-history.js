$(document).ready(function () {

    const API_URL = "https://teasocietyportal.onrender.com/api/orders";

    function loadOrders() {
        console.log("Fetching from:", API_URL);

        $.ajax({
            url: API_URL,
            method: "GET",
            success: function (orders) {
                console.log("SUCCESS:", orders);
                displayOrders(orders);
            },
            error: function (err) {
                console.log("ERROR:", err);

                $("#orderTable").html(
                    "<tr><td colspan='5'>Error loading orders</td></tr>"
                );
            }
        });
    }

    // DISPLAY FUNCTION
    function displayOrders(orders) {
        const table = $("#orderTable");
        table.empty();

        if (orders.length === 0) {
            table.html("<tr><td colspan='5'>No orders found</td></tr>");
            return;
        }

        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.fullName}</td>
                    <td>${order.email}</td>
                    <td>${order.event}</td>
                    <td>${order.status}</td>
                </tr>
            `;
            table.append(row);
        });
    }

    loadOrders();

});
