const STORAGE_KEY = "tea_society_members";

function getMembersFromStorage() {
    const members = localStorage.getItem(STORAGE_KEY);
    return members ? JSON.parse(members) : [];
}

function saveMembersToStorage(members) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function setFieldState(field, isValid, message = "") {
    const errorElement = document.getElementById(field.id + "Error");

    if (isValid) {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        errorElement.textContent = "";
    } else {
        field.classList.remove("is-valid");
        field.classList.add("is-invalid");
        errorElement.textContent = message;
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = "";

    if (field.id === "memberName") {
        if (value === "") {
            isValid = false;
            message = "Member name is required.";
        } else if (value.length < 2) {
            isValid = false;
            message = "Member name must be at least 2 characters.";
        }
    }

    if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === "") {
            isValid = false;
            message = "Email is required.";
        } else if (!emailPattern.test(value)) {
            isValid = false;
            message = "Please enter a valid email address.";
        }
    }

    if (field.id === "year") {
        if (value === "") {
            isValid = false;
            message = "Year in school is required.";
        }
    }

    if (field.id === "affiliation") {
        if (value === "") {
            isValid = false;
            message = "Affiliation / Major is required.";
        }
    }

    if (field.id === "phone" && value !== "") {
        const phonePattern = /^[0-9()\-\s]+$/;
        if (!phonePattern.test(value)) {
            isValid = false;
            message = "Phone number can only contain digits, spaces, parentheses, or dashes.";
        }
    }

    setFieldState(field, isValid, message);
    return isValid;
}

function validateForm() {
    const fields = [
        document.getElementById("memberName"),
        document.getElementById("email"),
        document.getElementById("year"),
        document.getElementById("affiliation"),
        document.getElementById("phone")
    ];

    let formIsValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            formIsValid = false;
        }
    });

    return formIsValid;
}

function getFormData() {
    return {
        memberName: document.getElementById("memberName").value.trim(),
        email: document.getElementById("email").value.trim(),
        year: document.getElementById("year").value,
        affiliation: document.getElementById("affiliation").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };
}

function clearForm() {
    document.getElementById("memberForm").reset();
    document.getElementById("memberIndex").value = "";

    const fields = document.querySelectorAll("#memberForm input, #memberForm select");
    fields.forEach(field => {
        field.classList.remove("is-valid", "is-invalid");
    });

    const errorMessages = document.querySelectorAll("#memberForm .text-danger");
    errorMessages.forEach(error => {
        error.textContent = "";
    });
}

function renderMembers() {
    const members = getMembersFromStorage();
    const tableBody = document.getElementById("memberTableBody");

    tableBody.innerHTML = "";

    if (members.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No members registered yet.</td>
            </tr>
        `;
        return;
    }

    members.forEach((member, index) => {
        const row = `
            <tr>
                <td>${member.memberName}</td>
                <td>${member.email}</td>
                <td>${member.year}</td>
                <td>${member.affiliation}</td>
                <td>${member.phone || "N/A"}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editMember(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMember(${index})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function editMember(index) {
    const members = getMembersFromStorage();
    const member = members[index];

    document.getElementById("memberName").value = member.memberName;
    document.getElementById("email").value = member.email;
    document.getElementById("year").value = member.year;
    document.getElementById("affiliation").value = member.affiliation;
    document.getElementById("phone").value = member.phone;
    document.getElementById("memberIndex").value = index;
}

function deleteMember(index) {
    const members = getMembersFromStorage();
    members.splice(index, 1);
    saveMembersToStorage(members);
    renderMembers();
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        alert("Please fix the errors in the form.");
        return;
    }

    const members = getMembersFromStorage();
    const formData = getFormData();
    const memberIndex = document.getElementById("memberIndex").value;

    if (memberIndex === "") {
        members.push(formData);
        alert("Member added successfully.");
    } else {
        members[memberIndex] = formData;
        alert("Member updated successfully.");
    }

    saveMembersToStorage(members);
    renderMembers();
    clearForm();
}

function initializeApp() {
    document.getElementById("memberForm").addEventListener("submit", handleFormSubmit);

    const fields = document.querySelectorAll("#memberForm input, #memberForm select");
    fields.forEach(field => {
        field.addEventListener("blur", function () {
            validateField(field);
        });
    });

    document.getElementById("clearBtn").addEventListener("click", function () {
        clearForm();
    });

    renderMembers();
}

document.addEventListener("DOMContentLoaded", initializeApp);


document.addEventListener("DOMContentLoaded", initializeApp);
