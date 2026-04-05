$("#rsvpForm").submit(function (e) {
    e.preventDefault();

    let name = $("#name").val().trim();
    let email = $("#email").val().trim();
    let event = $("#event").val();
    let type = $("#type").val();
    let notes = $("#notes").val().trim();

    if (!name || !email || !event || !type) {
        alert("Please fill in all required fields!");
        return;
    }

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(emailPattern)) {
        alert("Please enter a valid email!");
        return;
    }

    let rsvpData = {
        name: name,
        email: email,
        event: event,
        participationType: type,
        notes: notes || "None"
    };

    $("#jsonOutput").text(JSON.stringify(rsvpData, null, 2));

    console.log("RSVP JSON:", rsvpData);

    sendRSVP(rsvpData);

    alert("RSVP submitted successfully!");

    $("#rsvpForm")[0].reset();
});

function sendRSVP(data) {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
            console.log("Data sent successfully!", response);
            alert("Data successfully sent to server!");
        },
        error: function () {
            console.log("Error sending data.");
            alert("Error sending data.");
        }
    });
}

$("#email").on("keyup", function () {
    let email = $(this).val();
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;

    if (!email.match(pattern)) {
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    } else {
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
    }
});
