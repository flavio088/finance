"use strict";
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const loginBtn = document.getElementById("login-btn");
function showError(element) {
    element.classList.add("error-message--visible");
}
function hideError(element) {
    element.classList.remove("error-message--visible");
}
function validateForm() {
    let valid = true;
    if (!emailInput.value.includes("@")) {
        showError(emailError);
        valid = false;
    }
    else {
        hideError(emailError);
    }
    if (passwordInput.value.trim().length === 0) {
        showError(passwordError);
        valid = false;
    }
    else {
        hideError(passwordError);
    }
    return valid;
}
async function handleLogin(event) {
    event.preventDefault();
    if (!validateForm())
        return;
    loginBtn.disabled = true;
    loginBtn.textContent = "Entrando...";
    try {
        const response = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            showError(emailError);
            emailError.textContent = data.error ?? "Erro ao fazer login.";
            return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard.html";
    }
    catch {
        showError(emailError);
        emailError.textContent = "Não foi possível conectar ao servidor.";
    }
    finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Entrar";
    }
}
form.addEventListener("submit", handleLogin);
//# sourceMappingURL=main.js.map