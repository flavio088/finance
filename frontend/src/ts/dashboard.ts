const hamburgerBtn = document.getElementById("hamburger-btn");
const sidebar = document.querySelector<HTMLElement>(".sidebar");
const overlay = document.getElementById("sidebar-overlay");

function toggleSidebar(): void {
  sidebar?.classList.toggle("sidebar--open");
  overlay?.classList.toggle("sidebar-overlay--visible");
}

hamburgerBtn?.addEventListener("click", toggleSidebar);
overlay?.addEventListener("click", toggleSidebar);

const API_URL = "https://finance-production-d756.up.railway.app";

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/index.html";
}

// Navegação entre páginas
const navLinks = document.querySelectorAll<HTMLButtonElement>(
  ".sidebar__link[data-page]",
);
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
    `.sidebar__link[data-page="${pageId}"]`,
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
function showFeedback(
  element: HTMLElement,
  message: string,
  type: "success" | "error",
): void {
  element.textContent = message;
  element.className = `feedback-message feedback-message--visible feedback-message--${type}`;

  setTimeout(() => {
    element.className = "feedback-message";
  }, 4000);
}

// Formulário de entradas
const incomeForm = document.getElementById("income-form") as HTMLFormElement;
const incomeFeedback = document.getElementById(
  "income-feedback",
) as HTMLDivElement;
const incomeBtn = document.getElementById("income-btn") as HTMLButtonElement;

incomeForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const amount = (document.getElementById("income-amount") as HTMLInputElement)
    .value;
  const date = (document.getElementById("income-date") as HTMLInputElement)
    .value;
  const description = (
    document.getElementById("income-description") as HTMLInputElement
  ).value;

  if (!amount || !date || !description) {
    showFeedback(incomeFeedback, "Preencha todos os campos.", "error");
    return;
  }

  incomeBtn.disabled = true;
  incomeBtn.textContent = "Registrando...";

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      showFeedback(
        incomeFeedback,
        data.error ?? "Erro ao registrar entrada.",
        "error",
      );
      return;
    }

    showFeedback(incomeFeedback, "Entrada registrada com sucesso!", "success");
    incomeForm.reset();
  } catch {
    showFeedback(
      incomeFeedback,
      "Não foi possível conectar ao servidor.",
      "error",
    );
  } finally {
    incomeBtn.disabled = false;
    incomeBtn.textContent = "Registrar entrada";
  }
});

// Formulário de saídas
const expenseForm = document.getElementById("expense-form") as HTMLFormElement;
const expenseFeedback = document.getElementById(
  "expense-feedback",
) as HTMLDivElement;
const expenseBtn = document.getElementById("expense-btn") as HTMLButtonElement;

expenseForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const amount = (document.getElementById("expense-amount") as HTMLInputElement)
    .value;
  const date = (document.getElementById("expense-date") as HTMLInputElement)
    .value;
  const description = (
    document.getElementById("expense-description") as HTMLInputElement
  ).value;
  const paymentMethod = (
    document.getElementById("expense-payment") as HTMLSelectElement
  ).value;

  if (!amount || !date || !description || !paymentMethod) {
    showFeedback(expenseFeedback, "Preencha todos os campos.", "error");
    return;
  }

  expenseBtn.disabled = true;
  expenseBtn.textContent = "Registrando...";

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "expense",
        amount: Number(amount),
        description,
        paymentMethod,
        date,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showFeedback(
        expenseFeedback,
        data.error ?? "Erro ao registrar saída.",
        "error",
      );
      return;
    }

    showFeedback(expenseFeedback, "Saída registrada com sucesso!", "success");
    expenseForm.reset();
  } catch {
    showFeedback(
      expenseFeedback,
      "Não foi possível conectar ao servidor.",
      "error",
    );
  } finally {
    expenseBtn.disabled = false;
    expenseBtn.textContent = "Registrar saída";
  }
});
// Utilitário de formatação de moeda
function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Utilitário de formatação de data
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

// Mapa de forma de pagamento
const paymentLabels: Record<string, string> = {
  debit: "Débito",
  credit: "Crédito",
  pix: "PIX",
  cash: "Dinheiro",
};

// Carregar histórico
async function loadHistory(): Promise<void> {
  const historyContent = document.getElementById(
    "history-content",
  ) as HTMLDivElement;
  const summaryBalance = document.getElementById(
    "summary-balance",
  ) as HTMLDivElement;
  const summaryIncome = document.getElementById(
    "summary-income",
  ) as HTMLDivElement;
  const summaryExpense = document.getElementById(
    "summary-expense",
  ) as HTMLDivElement;

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      historyContent.innerHTML = `<div class="empty-state">Erro ao carregar histórico.</div>`;
      return;
    }

    // Atualizar cards de resumo
    summaryBalance.textContent = formatCurrency(data.balance);
    summaryBalance.className = `summary-card__value ${data.balance >= 0 ? "summary-card__value--positive" : "summary-card__value--negative"}`;
    summaryIncome.textContent = formatCurrency(data.totalIncome);
    summaryExpense.textContent = formatCurrency(data.totalExpense);

    // Renderizar tabela
    if (data.transactions.length === 0) {
      historyContent.innerHTML = `<div class="empty-state">Nenhuma transação registrada ainda.</div>`;
      return;
    }

    historyContent.innerHTML = `
      <div class="table-wrapper">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Pagamento</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${data.transactions
              .map(
                (t: {
                  type: string;
                  date: string;
                  description: string;
                  payment_method: string | null;
                  amount: number;
                }) => `
              <tr>
                <td>${formatDate(t.date)}</td>
                <td>${t.description}</td>
                <td>
                  <span class="transaction-type transaction-type--${t.type}">
                    ${t.type === "income" ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td>${t.payment_method ? paymentLabels[t.payment_method] : "—"}</td>
                <td class="transaction-amount transaction-amount--${t.type}">
                  ${t.type === "income" ? "+" : "-"} ${formatCurrency(Number(t.amount))}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch {
    historyContent.innerHTML = `<div class="empty-state">Não foi possível conectar ao servidor.</div>`;
  }
}

// Carregar histórico ao clicar na aba
document
  .querySelector<HTMLButtonElement>('.sidebar__link[data-page="history"]')
  ?.addEventListener("click", loadHistory);
export {};
