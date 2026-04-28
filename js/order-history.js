$(document).ready(function () {

const API_URL = "https://teasocietyportal.onrender.com/api/orders";
    
    function loadOrders() {
        $.ajax({
            url: API_URL,
            method: "GET",
            success: function (orders) {
                displayOrders(orders);
            },
            error: function (err) {
                console.error(err);
                $("#orderTable").html(
                    "<tr><td colspan='5'>Error loading orders</td></tr>"
                );
            }
        });
    }

    function displayOrders(orders) {
        const table = $("#orderTable");
        table.empty();

        if (!orders || orders.length === 0) {
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

    $("#search").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $("#orderTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    loadOrders();
});
