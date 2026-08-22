const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/index.html";
}

// Navegação entre páginas
const navLinks = document.querySelectorAll<HTMLButtonElement>(".sidebar__link[data-page]");
const pages = document.querySelectorAll<HTMLElement>("section[id^='page-']");

function showPage(pageId: string): void {
  pages.forEach((page) => {
    page.style.display = "none";
  });

  navLinks.forEach((link) => {
    link.classList.remove("sidebar__link--active");
  });

  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) targetPage.style.display = "block";

  const activeLink = document.querySelector<HTMLButtonElement>(
    `.sidebar__link[data-page="${pageId}"]`
  );
  if (activeLink) activeLink.classList.add("sidebar__link--active");
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const page = link.dataset["page"];
    if (page) showPage(page);
  });
});

// Logout
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/index.html";
});

// Utilitário de feedback
function showFeedback(element: HTMLElement, message: string, type: "success" | "error"): void {
  element.textContent = message;
  element.className = `feedback-message feedback-message--visible feedback-message--${type}`;

  setTimeout(() => {
    element.className = "feedback-message";
  }, 4000);
}

// Formulário de entradas
const incomeForm = document.getElementById("income-form") as HTMLFormElement;
const incomeFeedback = document.getElementById("income-feedback") as HTMLDivElement;
const incomeBtn = document.getElementById("income-btn") as HTMLButtonElement;

incomeForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const amount = (document.getElementById("income-amount") as HTMLInputElement).value;
  const date = (document.getElementById("income-date") as HTMLInputElement).value;
  const description = (document.getElementById("income-description") as HTMLInputElement).value;

  if (!amount || !date || !description) {
    showFeedback(incomeFeedback, "Preencha todos os campos.", "error");
    return;
  }

  incomeBtn.disabled = true;
  incomeBtn.textContent = "Registrando...";

  try {
    const response = await fetch("http://localhost:3001/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "income",
        amount: Number(amount),
        description,
        date,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showFeedback(incomeFeedback, data.error ?? "Erro ao registrar entrada.", "error");
      return;
    }

    showFeedback(incomeFeedback, "Entrada registrada com sucesso!", "success");
    incomeForm.reset();

  } catch {
    showFeedback(incomeFeedback, "Não foi possível conectar ao servidor.", "error");
  } finally {
    incomeBtn.disabled = false;
    incomeBtn.textContent = "Registrar entrada";
  }
});