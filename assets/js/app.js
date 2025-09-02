/* ================= Utilidades ================= */
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

/* Ano no rodapé */
(() => {
  const el = $("#y");
  if (el) el.textContent = new Date().getFullYear();
})();

/* Smooth scroll para âncoras */
(() => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
})();

/* Preenchimento por querystring (nome, telefone, endereco, plano, obs) */
(() => {
  const params = new URLSearchParams(location.search);
  const map = {
    nome:'#nome',
    telefone:'#telefone',
    endereco:'#endereco',
    plano:'#planoSel',
    obs:'#preferencia'
  };
  Object.entries(map).forEach(([k, sel]) => {
    const v = params.get(k);
    const el = $(sel);
    if (!v || !el) return;
    if (el.tagName === 'SELECT') {
      [...el.options].forEach(o => {
        if (o.value.toLowerCase() === v.toLowerCase()) o.selected = true;
      });
    } else {
      el.value = decodeURIComponent(v);
    }
  });
})();

/* ================= WhatsApp ================= */
const PHONE = "5521995837591"; // +55 21 99583-7591
const WA_BASE = `https://wa.me/${PHONE}`;

/* Modelos de mensagens por chave (data-wa) */
const WA_TEMPLATES = {
  // As que você já usa
  duvida: [
    "👋 *Olá, Andreza!*",
    "Vim pelo site e gostaria de tirar uma dúvida rapidinho.",
    "— _Enviado pelo site_"
  ],
  cardapio: [
    "🍽️ *Quero receber o cardápio da semana*",
    "— _Enviado pelo site_"
  ],
  sobre: [
    "👋 *Olá, Andreza!*",
    "Vim pelo site e quero falar com você.",
    "— _Enviado pelo site_"
  ],

  // Reservas para futuro/compatibilidade
  inicio_pedir: [
    "🧾 *Quero fazer um pedido*",
    "— _Enviado pelo site_"
  ],
  ver_cardapio: [
    "🍽️ *Quero receber o cardápio da semana*",
    "— _Enviado pelo site_"
  ],
  falar_com_andreza: [
    "👋 *Olá Andreza!*",
    "Quero tirar uma dúvida rapidinho.",
    "— _Enviado pelo site_"
  ],
  topo_whats: [
    "👋 *Olá Andreza!* Vim pelo site e quero falar com você.",
    "— _Enviado pelo site_"
  ]
};

const encodeMsg = (lines) => encodeURIComponent(lines.join("\n"));

/* Intercepta todas as CTAs com .js-wa + data-wa */
(() => {
  $$('.js-wa[data-wa]').forEach(el => {
    el.addEventListener('click', (e) => {
      const key = el.getAttribute('data-wa');
      const extra = el.getAttribute('data-wa-extra');
      const ctaId = el.getAttribute('data-cta'); // só para rastrear internamente/console

      let lines = WA_TEMPLATES[key] || ["👋 Olá! Vim pelo site.", "— _Enviado pelo site_"];
      if (extra) lines = [...lines, "", extra];

      const url = `${WA_BASE}?text=${encodeMsg(lines)}`;
      e.preventDefault();
      window.open(url, "_blank", "noopener");

      if (ctaId) {
        // simples debug local (se quiser enviar para analytics no futuro)
        console.debug("[CTA]", ctaId, "→", key);
      }
    });
  });
})();

/* Formulário → WhatsApp com mensagem bonita */
(() => {
  const form = $("#waForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = $("#nome")?.value?.trim() || "";
    const tel  = $("#telefone")?.value?.trim() || "";
    const end  = $("#endereco")?.value?.trim() || "";
    const plano= $("#planoSel")?.value || "Semanal";
    const pref = $("#preferencia")?.value?.trim() || "";

    const linhas = [
      "🧾 *Novo orçamento — Andreza Mello Fit*",
      "----------------------------------------",
      `👤 *Nome:* ${nome}`,
      `📞 *Telefone:* ${tel}`,
      `📍 *Endereço:* ${end}`,
      `📦 *Plano:* ${plano}`
    ];
    if (pref) linhas.push(`📝 *Preferência:* ${pref}`);
    linhas.push("", "_Enviado pelo site_");

    const url = `${WA_BASE}?text=${encodeURIComponent(linhas.join("\n"))}`;
    window.open(url, "_blank", "noopener");

    const sec = form.closest(".plan");
    if (sec) sec.scrollIntoView({ behavior:"smooth", block:"start" });
  });
})();
