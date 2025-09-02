/* =========================
   Andreza Mello Fit – app.js
   ========================= */

// 📞 WhatsApp da Andreza (DDI+DDD+número, só dígitos)
const PHONE = "5521995837591";

// Mensagens base reutilizáveis
const MSGS = {
  oi: "Olá, Andreza! Vi seu site e quero falar com você. 😊",
  pedir: "Olá, Andreza! Gostei do cardápio e quero fazer um pedido. 🍽️",
  cardapio: "Olá, Andreza! Pode me enviar o cardápio atualizado, por favor? 🧾",
  planos: "Olá, Andreza! Quero conversar sobre um plano semanal/mensal. 📅"
};

/* Utilitário: toast simples (não bloqueia a UI) */
function showToast(text = "Tudo certo!") {
  try {
    const t = document.createElement("div");
    t.textContent = text;
    t.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
      "background:#111827;color:#fff;padding:10px 14px;border-radius:10px;" +
      "font:500 14px/1.2 system-ui,Segoe UI,Roboto,Helvetica,Arial;letter-spacing:.2px;" +
      "box-shadow:0 10px 25px rgba(0,0,0,.25);z-index:9999;opacity:.98";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  } catch (_) {}
}

/* Abre WhatsApp em nova aba, com fallback */
function openWA(message) {
  try {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    showToast("Abrindo WhatsApp…");
    // Preferir janela/aba nova (evita travas de histórico)
    const w = window.open(url, "_blank", "noopener,noreferrer");
    // Fallback se o bloqueador impedir pop-up
    if (!w) location.href = url;
  } catch (err) {
    console.error("Erro ao abrir WhatsApp:", err);
    alert("Não foi possível abrir o WhatsApp. Tente novamente.");
  }
}

/* Atribui um clique seguro a qualquer seletor */
function bindClick(selector, handler) {
  try {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", (e) => {
        try {
          e.preventDefault();
          handler(el, e);
        } catch (err) {
          console.error("Erro no handler:", err);
        }
      });
    });
  } catch (err) {
    console.error("Erro ao bindar seletor:", selector, err);
  }
}

/* 1) Âncoras internas com scroll suave */
(function smoothAnchors() {
  try {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const el = id && document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", id);
        }
      });
    });
  } catch (err) {
    console.error("Smooth anchors error:", err);
  }
})();

/* 2) CTAs de WhatsApp declarativos
      Ex.: <a data-wa="pedir">Peça agora</a>
           <a data-wa="cardapio">Ver cardápio</a>
           <a data-wa="planos">Quero conversar</a> */
(function bindWAButtons() {
  bindClick('[data-wa="oi"]', () => openWA(MSGS.oi));
  bindClick('[data-wa="pedir"]', () => openWA(MSGS.pedir));
  bindClick('[data-wa="cardapio"]', () => openWA(MSGS.cardapio));
  bindClick('[data-wa="planos"]', () => openWA(MSGS.planos));
})();

/* 3) Botões/links com data-wa-text dinâmico
      Ex.: <a data-wa-text="Quero Tilápia com mix de legumes">Falar no WhatsApp</a> */
bindClick("[data-wa-text]", (el) => {
  const txt = el.getAttribute("data-wa-text") || MSGS.oi;
  openWA(txt);
});

/* 4) Formulário de Plano (opcional)
      Se existir um <form id="planoForm"> no HTML, enviamos direto ao WhatsApp.
      Campos suportados (use qualquer subset):
        [name="nome"], [name="telefone"], [name="endereco"],
        [name="periodo"] => "semanal" | "mensal"
        [name="observacoes"] (opcional) */
(function planosFormToWA() {
  try {
    const form = document.getElementById("planoForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);

      const nome = (fd.get("nome") || "").toString().trim();
      const telefone = (fd.get("telefone") || "").toString().trim();
      const endereco = (fd.get("endereco") || "").toString().trim();
      const periodo = (fd.get("periodo") || "semanal").toString().trim();
      const observacoes = (fd.get("observacoes") || "").toString().trim();

      // Monta mensagem curta e direta
      let msg =
        "👋 Olá, Andreza! Quero um plano " +
        (periodo || "semanal") +
        ".%0A%0A";

      if (nome) msg += `• Nome: ${nome}%0A`;
      if (telefone) msg += `• Telefone: ${telefone}%0A`;
      if (endereco) msg += `• Endereço: ${endereco}%0A`;
      if (observacoes) msg += `%0A• Obs.: ${observacoes}%0A`;

      msg += "%0AObrigado(a)!";

      openWA(decodeURIComponent(msg));
      showToast("Dados prontos no WhatsApp ✅");
      // Opcional: reset depois
      // form.reset();
    });
  } catch (err) {
    console.error("Plano form error:", err);
  }
})();

/* 5) Melhor UX para links externos do WhatsApp “padrão”
      Se houver <a href*="wa.me"> sem data-wa, ainda interceptamos para try/catch */
(function guardRawWaLinks() {
  try {
    document.querySelectorAll('a[href*="wa.me"]').forEach((a) => {
      // já tratamos data-wa / data-wa-text acima
      if (a.hasAttribute("data-wa") || a.hasAttribute("data-wa-text")) return;

      a.addEventListener("click", (e) => {
        try {
          e.preventDefault();
          const href = a.getAttribute("href") || "";
          const u = new URL(href, location.href);
          const txt = u.searchParams.get("text") || MSGS.oi;
          openWA(txt);
        } catch (err) {
          // Se algo falhar, deixa ir pelo href normal
          console.warn("Fallback para href original do WhatsApp.");
          window.open(a.href, "_blank", "noopener,noreferrer");
        }
      });
    });
  } catch (err) {
    console.error("Guard raw WhatsApp links error:", err);
  }
})();
