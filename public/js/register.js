document.getElementById('registerForm').addEventListener('submit', function (event) {
    const form = this;
    const password = document.getElementById('password');
    const userName = document.getElementById('userName');
    const lastName = document.getElementById('lastName`');
    const firstName = document.getElementById('firstName');
    const email = document.getElementById('email');
    const confirmPassword = document.getElementById('confirmPassword');
    let isValid = true;

    // Reset custom error messages
    password.setCustomValidity("");
    confirmPassword.setCustomValidity("");

    // 1. Validate Password length manually or via built-in validation
    if (password.value.length < 8) {
        password.setCustomValidity("Too short");
        isValid = false;
    }

    if (email.value.length < 1) {
        email.setCustomValidity("Too Short");
        isValid = false;
    }

    if (userName.value.length < 1) {
        userName.setCustomValidity("Too Short");
        isValid = false;
    }
    if (firstName.value.length < 1) {
        firstName.setCustomValidity("Too Short");
        isValid = false;
    }
    if (lastName.value.length < 1) {
        lastName.setCustomValidity("Too Short");
        isValid = false;
    }
    // 2. Validate matching passwords
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match");
        password.setCustomValidity("Do not match");
        isValid = false;
    }

    // Check overall native + custom validity rules
    if (!form.checkValidity() || !isValid) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        // event.preventDefault(); // Remove this line if you want the form to submit to a real backend
        alert('Registration successful!');
    }

    // Apply Bootstrap styling classes
    form.classList.add('was-validated');
}, false);