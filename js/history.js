$(document).ready(function () {

    $.get("http://localhost:3000/orders", function (data) {

        $("#historyTable").empty();

        data.forEach(order => {

            let color = "secondary";

            if (order.status === "pending") color = "warning";
            if (order.status === "approved") color = "success";
            if (order.status === "declined") color = "danger";

            $("#historyTable").append(`
                <tr>
                    <td>${order.name}</td>
                    <td>${order.email}</td>
                    <td>${order.event}</td>
                    <td><span class="badge bg-${color}">${order.status}</span></td>
                </tr>
            `);
        });

    });

});
