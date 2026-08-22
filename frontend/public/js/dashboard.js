"use strict";
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/index.html";
}
// Navegação entre páginas
const navLinks = document.querySelectorAll(".sidebar__link[data-page]");
const pages = document.querySelectorAll("section[id^='page-']");
function showPage(pageId) {
    pages.forEach((page) => {
        page.style.display = "none";
    });
    navLinks.forEach((link) => {
        link.classList.remove("sidebar__link--active");
    });
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage)
        targetPage.style.display = "block";
    const activeLink = document.querySelector(`.sidebar__link[data-page="${pageId}"]`);
    if (activeLink)
        activeLink.classList.add("sidebar__link--active");
}
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const page = link.dataset["page"];
        if (page)
            showPage(page);
    });
});
// Logout
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index.html";
});
// Utilitário de feedback
function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback-message feedback-message--visible feedback-message--${type}`;
    setTimeout(() => {
        element.className = "feedback-message";
    }, 4000);
}
// Formulário de entradas
const incomeForm = document.getElementById("income-form");
const incomeFeedback = document.getElementById("income-feedback");
const incomeBtn = document.getElementById("income-btn");
incomeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const amount = document.getElementById("income-amount").value;
    const date = document.getElementById("income-date").value;
    const description = document.getElementById("income-description").value;
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
    }
    catch {
        showFeedback(incomeFeedback, "Não foi possível conectar ao servidor.", "error");
    }
    finally {
        incomeBtn.disabled = false;
        incomeBtn.textContent = "Registrar entrada";
    }
});
//# sourceMappingURL=dashboard.js.map