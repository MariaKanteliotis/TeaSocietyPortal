const STORAGE_KEY = 'storefront_user';

function updateField(formField, errorElement, isValid, errorMessage) {
    if (isValid) {
        formField.classList.add('is-valid');
        formField.classList.remove('is-invalid');

        errorElement.textContent = "";
        errorElement.classList.remove('show');
    } else {
        formField.classList.add('is-invalid');
        formField.classList.remove('is-valid');

        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    }
}

function validateField(formField) {
    const fieldId = formField.id;
    const value = formField.value.trim();
    const errorElement = document.getElementById(fieldId + 'Error');

    let isValid = true;
    let errorMessage = "";

    if (formField.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }

    if (isValid && value !== '') {
        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email';
                }
                break;
        }
    }

    updateField(formField, errorElement, isValid, errorMessage);
    return isValid;
}

function validateForm(form) {
    let isValid = true;

    const formInputs = form.querySelectorAll('input, select');

    formInputs.forEach(formField => {
        if (!validateField(formField)) {
            isValid = false;
        }
    });

    return isValid;
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip
        },
        creationDate: new Date().toISOString()
    };
}

function saveFormDataToLocalStorage(formData) {
    try {
        const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        existingUsers.push(formData);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUsers));

        console.log('Saved successfully!');
        return true;
    } catch (error) {
        console.log('Error saving to local storage:', error);
        return false;
    }
}

function displayAllUserCards(users) {
    const userCardContainer = document.getElementById('userCard');
    userCardContainer.innerHTML = "";

    users.forEach(userData => {
        let cardHtml = `
            <div class="card mb-2 p-2">
                <div>
                    <h5>${userData.firstName} ${userData.lastName}</h5>
                    <p>Email: ${userData.email}</p>
                    <p>Phone: ${userData.phone || ''}</p>
                    <p>
                        Address: ${userData.address.street}, 
                        ${userData.address.city}, 
                        ${userData.address.state} 
                        ${userData.address.zip}
                    </p>
                </div>
            </div>
        `;
        userCardContainer.innerHTML += cardHtml;
    });
}

function downloadUsersJSON() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (users.length === 0) {
        alert("No users to download!");
        return;
    }

    const blob = new Blob(
        [JSON.stringify(users, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function handleSignupSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("signupForm");

    if (!validateForm(form)) return;

    const formData = getFormData(form);

    if (saveFormDataToLocalStorage(formData)) {
        alert('You successfully signed up!');
        form.reset();

        // remove validation styles after reset
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    } else {
        alert('Sign up failed!');
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    displayAllUserCards(users);
}

function initializeApp() {
    console.log('Setting Everything');

    document.getElementById('signupForm')
        .addEventListener('submit', handleSignupSubmit);

    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadUsersJSON);
    }

    // Load users on page load
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    displayAllUserCards(users);
}

document.addEventListener('DOMContentLoaded', initializeApp);
