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
  const category = (
    document.getElementById("income-category") as HTMLSelectElement
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
        category,
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
    (document.getElementById("income-category") as HTMLSelectElement).value =
      "outros";
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
  const category = (
    document.getElementById("expense-category") as HTMLSelectElement
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
        category,
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
    (document.getElementById("expense-category") as HTMLSelectElement).value =
      "outros";
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

// Mapa de categorias
const categoryLabels: Record<string, string> = {
  alimentacao: "Alimentação",
  moradia: "Moradia",
  transporte: "Transporte",
  lazer: "Lazer",
  saude: "Saúde",
  educacao: "Educação",
  salario: "Salário",
  outros: "Outros",
};

interface TransactionRow {
  id: string;
  type: "income" | "expense";
  date: string;
  description: string;
  payment_method: string | null;
  category: string;
  amount: number;
}

function getFiltersQuery(): string {
  const params = new URLSearchParams();
  const month = (document.getElementById("filter-month") as HTMLInputElement)
    .value;
  const type = (document.getElementById("filter-type") as HTMLSelectElement)
    .value;
  const payment = (document.getElementById("filter-payment") as HTMLSelectElement)
    .value;
  const category = (document.getElementById("filter-category") as HTMLSelectElement)
    .value;
  const q = (document.getElementById("filter-q") as HTMLInputElement).value.trim();

  if (month) {
    const [year, monthIndex] = month.split("-").map(Number);
    const lastDay = new Date(year, monthIndex, 0).getDate();
    params.set("startDate", `${month}-01`);
    params.set("endDate", `${month}-${String(lastDay).padStart(2, "0")}`);
  }
  if (type) params.set("type", type);
  if (payment) params.set("paymentMethod", payment);
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const query = params.toString();
  return query ? `?${query}` : "";
}

let lastTransactions: TransactionRow[] = [];

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

  historyContent.innerHTML = `<div class="empty-state">Carregando...</div>`;

  try {
    const response = await fetch(`${API_URL}/transactions${getFiltersQuery()}`, {
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

    lastTransactions = data.transactions;

    // Renderizar tabela
    if (data.transactions.length === 0) {
      historyContent.innerHTML = `<div class="empty-state">Nenhuma transação registrada ainda.</div>`;
      renderCharts([]);
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
              <th>Categoria</th>
              <th>Valor</th>
              <th class="actions-col">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${data.transactions
              .map(
                (t: TransactionRow) => `
              <tr data-id="${t.id}">
                <td>${formatDate(t.date)}</td>
                <td>${t.description}</td>
                <td>
                  <span class="transaction-type transaction-type--${t.type}">
                    ${t.type === "income" ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td>${t.payment_method ? paymentLabels[t.payment_method] : "—"}</td>
                <td><span class="category-badge">${categoryLabels[t.category] ?? "Outros"}</span></td>
                <td class="transaction-amount transaction-amount--${t.type}">
                  ${t.type === "income" ? "+" : "-"} ${formatCurrency(Number(t.amount))}
                </td>
                <td class="actions-col">
                  <div class="row-actions">
                    <button type="button" class="icon-btn icon-btn--edit" data-action="edit" aria-label="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      </svg>
                    </button>
                    <button type="button" class="icon-btn icon-btn--delete" data-action="delete" aria-label="Excluir">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    renderCharts(data.transactions);
  } catch {
    historyContent.innerHTML = `<div class="empty-state">Não foi possível conectar ao servidor.</div>`;
  }
}

// --- Ações da tabela (editar/excluir) ---
const historyContentEl = document.getElementById(
  "history-content",
) as HTMLDivElement;

historyContentEl.addEventListener("click", async (event) => {
  const target = (event.target as HTMLElement).closest(
    "button[data-action]",
  ) as HTMLButtonElement | null;
  if (!target) return;

  const row = target.closest("tr[data-id]") as HTMLTableRowElement | null;
  const id = row?.dataset["id"];
  if (!id) return;

  const transaction = lastTransactions.find((t) => t.id === id);
  if (!transaction) return;

  if (target.dataset["action"] === "delete") {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta transação?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        alert(data.error ?? "Erro ao excluir.");
        return;
      }
      await loadHistory();
    } catch {
      alert("Não foi possível conectar ao servidor.");
    }
  } else if (target.dataset["action"] === "edit") {
    openEditModal(transaction);
  }
});

// --- Modal de edição ---
const editModal = document.getElementById("edit-modal") as HTMLDivElement;
const editForm = document.getElementById("edit-form") as HTMLFormElement;
const editFeedback = document.getElementById("edit-feedback") as HTMLDivElement;
let editingId: string | null = null;

function openEditModal(transaction: TransactionRow): void {
  editingId = transaction.id;
  (document.getElementById("edit-amount") as HTMLInputElement).value = String(
    transaction.amount,
  );
  (document.getElementById("edit-date") as HTMLInputElement).value =
    transaction.date.split("T")[0];
  (document.getElementById("edit-type") as HTMLSelectElement).value =
    transaction.type;
  (document.getElementById("edit-payment") as HTMLSelectElement).value =
    transaction.payment_method ?? "";
  (document.getElementById("edit-category") as HTMLSelectElement).value =
    transaction.category;
  (document.getElementById("edit-description") as HTMLInputElement).value =
    transaction.description;

  const typeSelect = document.getElementById("edit-type") as HTMLSelectElement;
  const paymentGroup = (document.getElementById(
    "edit-payment",
  ) as HTMLSelectElement).closest(".field-group") as HTMLElement;
  paymentGroup.style.display =
    typeSelect.value === "expense" ? "flex" : "none";

  editFeedback.className = "feedback-message";
  editModal.hidden = false;
}

function closeEditModal(): void {
  editModal.hidden = true;
  editingId = null;
}

(document.getElementById("edit-modal-close") as HTMLButtonElement).addEventListener(
  "click",
  closeEditModal,
);
(document.getElementById("edit-cancel") as HTMLButtonElement).addEventListener(
  "click",
  closeEditModal,
);
editModal.addEventListener("click", (event) => {
  if (event.target === editModal) closeEditModal();
});
document.getElementById("edit-type")?.addEventListener("change", (event) => {
  const type = (event.target as HTMLSelectElement).value;
  const paymentGroup = (document.getElementById(
    "edit-payment",
  ) as HTMLSelectElement).closest(".field-group") as HTMLElement;
  paymentGroup.style.display = type === "expense" ? "flex" : "none";
});

editForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  if (!editingId) return;

  const amount = (document.getElementById("edit-amount") as HTMLInputElement)
    .value;
  const date = (document.getElementById("edit-date") as HTMLInputElement).value;
  const type = (document.getElementById("edit-type") as HTMLSelectElement).value;
  const payment = (document.getElementById("edit-payment") as HTMLSelectElement)
    .value;
  const category = (
    document.getElementById("edit-category") as HTMLSelectElement
  ).value;
  const description = (
    document.getElementById("edit-description") as HTMLInputElement
  ).value;

  if (!amount || !date || !description) {
    showFeedback(editFeedback, "Preencha os campos obrigatórios.", "error");
    return;
  }
  if (type === "expense" && !payment) {
    showFeedback(
      editFeedback,
      "Selecione a forma de pagamento para saídas.",
      "error",
    );
    return;
  }

  const saveBtn = document.getElementById("edit-save") as HTMLButtonElement;
  saveBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/transactions/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        amount: Number(amount),
        description,
        paymentMethod: type === "expense" ? payment : undefined,
        category,
        date,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      showFeedback(
        editFeedback,
        data.error ?? "Erro ao atualizar transação.",
        "error",
      );
      return;
    }

    closeEditModal();
    await loadHistory();
  } catch {
    showFeedback(editFeedback, "Não foi possível conectar ao servidor.", "error");
  } finally {
    saveBtn.disabled = false;
  }
});

// --- Filtros ---
(document.getElementById("filter-apply") as HTMLButtonElement).addEventListener(
  "click",
  loadHistory,
);
(document.getElementById("filter-clear") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    (document.getElementById("filter-month") as HTMLInputElement).value = "";
    (document.getElementById("filter-type") as HTMLSelectElement).value = "";
    (document.getElementById("filter-payment") as HTMLSelectElement).value = "";
    (document.getElementById("filter-category") as HTMLSelectElement).value = "";
    (document.getElementById("filter-q") as HTMLInputElement).value = "";
    loadHistory();
  },
);
(document.getElementById("filter-q") as HTMLInputElement).addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loadHistory();
    }
  },
);

// --- Exportar CSV ---
(document.getElementById("export-csv") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    if (lastTransactions.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    const header = ["Data", "Descrição", "Tipo", "Pagamento", "Categoria", "Valor"];
    const rows = lastTransactions.map((t) => [
      t.date.split("T")[0],
      `"${t.description.replace(/"/g, '""')}"`,
      t.type === "income" ? "Entrada" : "Saída",
      t.payment_method ? paymentLabels[t.payment_method] : "",
      categoryLabels[t.category] ?? "Outros",
      (t.type === "income" ? "" : "-") + Number(t.amount).toFixed(2),
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `finance-transacoes-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
);

// --- Gráficos (SVG puro) ---
interface ChartPoint {
  label: string;
  value: number;
}

function renderCharts(transactions: TransactionRow[]): void {
  renderBalanceChart(transactions);
  renderCategoryChart(transactions);
}

function renderBalanceChart(transactions: TransactionRow[]): void {
  const container = document.getElementById("chart-balance") as HTMLDivElement;
  if (transactions.length === 0) {
    container.innerHTML = `<div class="empty-state">Sem dados para exibir.</div>`;
    return;
  }

  // saldo acumulado por data (ordenado crescente)
  const sorted = [...transactions].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  let running = 0;
  const points: ChartPoint[] = sorted.map((t) => {
    running += t.type === "income" ? Number(t.amount) : -Number(t.amount);
    return { label: formatDate(t.date), value: running };
  });

  const svg = buildLineChart(points);
  container.innerHTML = svg;
}

function buildLineChart(points: ChartPoint[]): string {
  const width = 560;
  const height = 220;
  const padX = 40;
  const padY = 24;

  const values = points.map((p) => p.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const range = max - min || 1;

  const xAt = (i: number): number =>
    padX + (i / (points.length - 1 || 1)) * (width - padX * 2);
  const yAt = (v: number): number =>
    height - padY - ((v - min) / range) * (height - padY * 2);

  const sum = points.reduce((acc, p) => acc + p.value, 0);
  const avg = sum / points.length;

  const coords = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(p.value)}`)
    .join(" ");

  const zeroY = yAt(0);

  const area = `${coords} L${xAt(points.length - 1)},${zeroY} L${xAt(0)},${zeroY} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Evolução do saldo">
      <line x1="${padX}" y1="${zeroY}" x2="${width - padX}" y2="${zeroY}"
        stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>
      <path d="${area}" fill="rgba(37, 99, 235, 0.12)" stroke="none"/>
      <path d="${coords}" fill="none" stroke="#2563eb" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>
      ${
        avg !== 0
          ? `<circle cx="${xAt(
              points.length - 1,
            )}" cy="${yAt(points[points.length - 1].value)}" r="3.5" fill="#2563eb"/>`
          : ""
      }
    </svg>
    <div class="chart-caption">Saldo final: ${formatCurrency(
      points[points.length - 1].value,
    )}</div>
  `;
}

function renderCategoryChart(transactions: TransactionRow[]): void {
  const container = document.getElementById(
    "chart-category",
  ) as HTMLDivElement;
  const expenses = transactions.filter((t) => t.type === "expense");
  if (expenses.length === 0) {
    container.innerHTML = `<div class="empty-state">Sem gastos para exibir.</div>`;
    return;
  }

  const totals = new Map<string, number>();
  expenses.forEach((t) => {
    const cat = categoryLabels[t.category] ?? "Outros";
    totals.set(cat, (totals.get(cat) ?? 0) + Number(t.amount));
  });

  const entries = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const maxVal = entries[0][1];

  const bars = entries
    .map(([label, value]) => {
      const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
      return `
        <div class="bar-row">
          <span class="bar-label">${label}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%" title="${formatCurrency(
              value,
            )}"></div>
          </div>
          <span class="bar-value">${formatCurrency(value)}</span>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `<div class="bar-chart">${bars}</div>`;
}

// Carregar histórico ao clicar na aba
document
  .querySelector<HTMLButtonElement>('.sidebar__link[data-page="history"]')
  ?.addEventListener("click", loadHistory);
export {};
