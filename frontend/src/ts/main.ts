const form = document.getElementById("login-form") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const emailError = document.getElementById("email-error") as HTMLSpanElement;
const passwordError = document.getElementById("password-error") as HTMLSpanElement;
const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;

function showError(element: HTMLSpanElement): void {
  element.classList.add("error-message--visible");
}

function hideError(element: HTMLSpanElement): void {
  element.classList.remove("error-message--visible");
}

function validateForm(): boolean {
  let valid = true;

  if (!emailInput.value.includes("@")) {
    showError(emailError);
    valid = false;
  } else {
    hideError(emailError);
  }

  if (passwordInput.value.trim().length === 0) {
    showError(passwordError);
    valid = false;
  } else {
    hideError(passwordError);
  }

  return valid;
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  if (!validateForm()) return;

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