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
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm())
        return;
    loginBtn.disabled = true;
    loginBtn.textContent = "Entrando...";
    // Por enquanto apenas simula — a integração real vem na Etapa 10
    setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.textContent = "Entrar";
        console.log("Credenciais:", {
            email: emailInput.value,
            password: passwordInput.value,
        });
    }, 1000);
});
//# sourceMappingURL=main.js.map