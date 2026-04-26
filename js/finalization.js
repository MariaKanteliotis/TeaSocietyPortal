$(document).ready(function () {

    $("#finalizationForm").submit(function (e) {
        e.preventDefault();

        const data = {
            name: $("input[type='text']").val(),
            email: $("input[type='email']").val(),
            event: $("select").eq(0).val(),
            type: $("select").eq(1).val(),
            comments: $("textarea").val()
        };

        $.ajax({
            url: "http://localhost:3000/orders",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Submitted!");
                $("#finalizationForm")[0].reset();
            }
        });
    });

});
