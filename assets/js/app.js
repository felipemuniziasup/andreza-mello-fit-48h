(function () {
  // ========= CONFIG =========
  const PHONE = "5521995837591"; // WhatsApp da Andreza (com DDI)

  // helper: abre WhatsApp com mensagem
  function openWA(message) {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    // Toast
    showToast("Abrindo WhatsApp… sua mensagem está quase lá 🍲✅");
    window.open(url, "_blank", "noopener");
  }

  // toast
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("toast--show"), 2500);
  }

  // CTAs com data-wa
  document.querySelectorAll("[data-wa]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const msg = el.getAttribute("data-msg") || "Olá! Quero falar com você.";
      openWA(msg);
    });
  });

  // Smooth anchor (para #menu etc.)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // FAB menu
  const fab = document.querySelector("[data-fab]");
  if (fab) {
    const main = fab.querySelector(".fab__main");
    main.addEventListener("click", () => {
      fab.classList.toggle("fab--open");
    });
    document.addEventListener("click", (e) => {
      if (!fab.contains(e.target)) fab.classList.remove("fab--open");
    });
  }

  // Form Plano -> WhatsApp
  const planForm = document.getElementById("planForm");
  if (planForm) {
    planForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(planForm);
      const nome = (fd.get("nome") || "").trim();
      const tel  = (fd.get("telefone") || "").trim();
      const end  = (fd.get("endereco") || "").trim();
      const plano = fd.get("plano") || "Semanal";
      const obs = (fd.get("obs") || "").trim();

      const msg =
        `Olá, Andreza! Quero um plano *${plano}*.\n` +
        `• Nome: ${nome}\n` +
        `• Telefone: ${tel}\n` +
        `• Endereço: ${end}\n` +
        (obs ? `• Observação: ${obs}\n` : "") +
        `Pode me orientar nos próximos passos?`;

      openWA(msg);
    });
  }
})();
