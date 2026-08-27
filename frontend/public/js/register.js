const form = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const API_URL = "https://finance-production-d756.up.railway.app";
const passwordError = document.getElementById("password-error");
const registerBtn = document.getElementById("register-btn");
function clearErrors() {
    [nameError, emailError, passwordError].forEach((el) => {
        el.textContent = "";
        el.classList.remove("error-message--visible");
    });
}
function showFieldError(element, message) {
    element.textContent = message;
    element.classList.add("error-message--visible");
}
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    registerBtn.disabled = true;
    registerBtn.textContent = "Criando conta...";
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (data.errors) {
                data.errors.forEach((err) => {
                    if (err.field === "name")
                        showFieldError(nameError, err.message);
                    if (err.field === "email")
                        showFieldError(emailError, err.message);
                    if (err.field === "password")
                        showFieldError(passwordError, err.message);
                });
            }
            else {
                showFieldError(emailError, data.error ?? "Erro ao criar conta.");
            }
            return;
        }
        window.location.href = "/?registered=true";
    }
    catch {
        showFieldError(emailError, "Não foi possível conectar ao servidor.");
    }
    finally {
        registerBtn.disabled = false;
        registerBtn.textContent = "Criar conta";
    }
});
export {};
//# sourceMappingURL=register.js.map