const form = document.getElementById("resetPasswordForm");
const message = document.getElementById("formMessage");
const token = new URLSearchParams(window.location.search).get("token");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";

    if (!token) {
        message.textContent = "This reset link is missing its token.";
        return;
    }

    try {
        const response = await fetch("/api/resetpassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password: form.elements.password.value })
        });
        const result = await response.json();
        message.textContent = result.message;
        if (response.ok) form.reset();
    } catch {
        message.textContent = "Unable to contact the server. Please try again.";
    }
});