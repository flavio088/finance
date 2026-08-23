const form = document.getElementById("register-form") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const nameError = document.getElementById("name-error") as HTMLSpanElement;
const emailError = document.getElementById("email-error") as HTMLSpanElement;
const passwordError = document.getElementById(
  "password-error",
) as HTMLSpanElement;
const registerBtn = document.getElementById(
  "register-btn",
) as HTMLButtonElement;

function clearErrors(): void {
  [nameError, emailError, passwordError].forEach((el) => {
    el.textContent = "";
    el.classList.remove("error-message--visible");
  });
}

function showFieldError(element: HTMLSpanElement, message: string): void {
  element.textContent = message;
  element.classList.add("error-message--visible");
}

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  clearErrors();

  registerBtn.disabled = true;
  registerBtn.textContent = "Criando conta...";

  try {
    const response = await fetch("http://localhost:3001/auth/register", {
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
        data.errors.forEach((err: { field: string; message: string }) => {
          if (err.field === "name") showFieldError(nameError, err.message);
          if (err.field === "email") showFieldError(emailError, err.message);
          if (err.field === "password")
            showFieldError(passwordError, err.message);
        });
      } else {
        showFieldError(emailError, data.error ?? "Erro ao criar conta.");
      }
      return;
    }

    window.location.href = "/?registered=true";
  } catch {
    showFieldError(emailError, "Não foi possível conectar ao servidor.");
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Criar conta";
  }
});

export {};
