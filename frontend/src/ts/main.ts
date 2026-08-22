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

async function handleLogin(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  if (!validateForm()) return;

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

  } catch {
    showError(emailError);
    emailError.textContent = "Não foi possível conectar ao servidor.";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Entrar";
  }
}

form.addEventListener("submit", handleLogin);