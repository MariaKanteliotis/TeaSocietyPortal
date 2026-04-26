$(document).ready(function () {

    $("#finalizationForm").submit(function (e) {
        e.preventDefault();

        const data = {
            fullName: $("input[name='fullName']").val(),
            email: $("input[name='email']").val(),
            event: $("select[name='event']").val(),
            participation: $("select[name='participation']").val(),
            comments: $("textarea[name='comments']").val()
        };

        $.ajax({
            url: "https://tea-society-backend.onrender.com/api/orders",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),

            success: function (response) {
                alert("Submitted successfully!");
                console.log(response);
                $("#finalizationForm")[0].reset();
            },

            error: function (err) {
                console.error(err);
                alert("Error submitting. Check backend connection.");
            }
        });
    });

});
