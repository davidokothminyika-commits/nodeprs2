document.getElementById('registerForm').addEventListener('submit', async function (event) {
    const form = this;
    event.preventDefault();

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const userName = document.getElementById('userName');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');

    let isValid = true;

    const data = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({
            Fname: firstName.value,
            Lname: lastName.value,
            email: email.value,
            password: password.value,
            user_name: userName.value
        })
    });

    const result = await data.json();
    console.log(result.message);

    if (result.success) {
        window.location.href = '/auth/login';
    }
})

