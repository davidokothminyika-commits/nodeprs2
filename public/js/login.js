document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userName = document.getElementById('userName');
    const password = document.getElementById('password');

    const data = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_name: userName.value,
            password: password.value
        })
    });

    const result = await data.json();
    console.log(result);

    if (result.success) {
        window.location.href = '/auth';
    }
})