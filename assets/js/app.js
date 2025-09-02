// Configurações de WhatsApp centralizadas
const WA_NUMBER = "5521995837591"; // <<< coloque o número da Andreza aqui (somente dígitos)
const WA_BASE   = "https://wa.me/";

function openWhatsappMessage(message) {
  const url = `${WA_BASE}${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* Mensagens bonitas e legíveis (funciona bem no WhatsApp Web e Mobile) */
function msgCardapio() {
  return (
    "📋 *Cardápio da semana — Andreza Mello Fit*\n" +
    "——————————————\n" +
    "Olá, Andreza! Vim pelo site e quero receber o cardápio desta semana.\n\n" +
    "Pode me enviar por aqui, por favor? 😊"
  );
}

function msgContatoSimples() {
  return (
    "👋 *Falar com a Andreza — Mello Fit*\n" +
    "——————————————\n" +
    "Olá, Andreza! Vim pelo site e gostaria de tirar uma dúvida rápida."
  );
}

function msgOrcamento({ nome, telefone, endereco, plano, preferencia }) {
  return (
    "📝 *Novo orçamento — Andreza Mello Fit*\n" +
    "——————————————\n" +
    `👤 *Nome:* ${nome}\n` +
    `📱 *Telefone:* ${telefone}\n` +
    `📍 *Endereço:* ${endereco}\n` +
    `📦 *Plano:* ${plano}` +
    (preferencia ? `\n🍽️ *Preferência:* ${preferencia}` : "") +
    "\n\n_Enviado pelo site_"
  );
}

/* HEADER CTA */
document.getElementById("ctaHeaderWhats")?.addEventListener("click", (e) => {
  e.preventDefault();
  openWhatsappMessage(msgContatoSimples());
});

/* SOBRE CTA */
document.getElementById("ctaSobreWhats")?.addEventListener("click", (e) => {
  e.preventDefault();
  openWhatsappMessage(msgContatoSimples());
});

/* CARDÁPIO CTA */
document.getElementById("ctaCardapioWhats")?.addEventListener("click", (e) => {
  e.preventDefault();
  openWhatsappMessage(msgCardapio());
});

/* FOOTER CTA */
document.getElementById("ctaFooterWhats")?.addEventListener("click", (e) => {
  e.preventDefault();
  openWhatsappMessage(msgContatoSimples());
});

/* FORM — envio direto pro WhatsApp sem quebrar layout */
const form = document.getElementById("planoForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      nome: (data.get("nome") || "").toString().trim(),
      telefone: (data.get("telefone") || "").toString().trim(),
      endereco: (data.get("endereco") || "").toString().trim(),
      plano: (data.get("planoTipo") || "Semanal").toString(),
      preferencia: (data.get("preferencia") || "").toString().trim(),
    };

    // simples validação extra
    if (!payload.nome || !payload.telefone || !payload.endereco) {
      alert("Preencha nome, telefone e endereço para enviar no WhatsApp 😊");
      return;
    }

    openWhatsappMessage(msgOrcamento(payload));

    // NÃO alteramos estilos/DOM. Apenas limpamos os campos (mantém estabilidade visual)
    form.reset();
  });
}

/* Rolagem suave para âncoras */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#" || id.length <= 1) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
