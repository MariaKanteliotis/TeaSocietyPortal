$("#finalizationForm").submit(function (e) {
    e.preventDefault();

    let name = $("input[type='text']").val().trim();
    let email = $("input[type='email']").val().trim();
    let event = $("select").eq(0).val();
    let type = $("select").eq(1).val();
    let comments = $("textarea").val().trim();

    if (!name || !email || !event || !type) {
        alert("Please fill in all required fields!");
        return;
    }

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(emailPattern)) {
        alert("Enter a valid email!");
        return;
    }

    let finalizationData = {
        fullName: name,
        email: email,
        event: event,
        participationType: type,
        comments: comments || "None"
    };

    console.log("JSON Data:", finalizationData);

    $(".summary-box").html(`
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Event:</strong> ${event}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Comments:</strong> ${comments || "None"}</p>
    `);

    $(".hidden-section pre").text(JSON.stringify(finalizationData, null, 2));
    
    sendFinalization(finalizationData);

    alert("Finalization submitted successfully!");

    $("#finalizationForm")[0].reset();
});

function sendFinalization(data) {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts", 
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
            console.log("Sent successfully!", response);
            $(".hidden-section p strong:contains('Status')")
                .parent()
                .html("<strong>Status:</strong> Sent successfully!");
        },
        error: function () {
            console.log("Error sending data.");
            $(".hidden-section p strong:contains('Status')")
                .parent()
                .html("<strong>Status:</strong> Error sending data.");
        }
    });
}

$(".hidden-section button").click(function () {
    alert("Click Submit first to generate JSON!");
});
