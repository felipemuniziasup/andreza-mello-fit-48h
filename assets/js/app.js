/* Utilidades */
const $  = (q, ctx = document) => ctx.querySelector(q);
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

/* Preenchimento por querystring */
(() => {
  const params = new URLSearchParams(location.search);
  const map = { nome:'#nome', telefone:'#telefone', endereco:'#endereco', plano:'#planoSel', obs:'#preferencia' };
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

/* ========= WhatsApp ========= */

const PHONE  = "5521995837591";                  // +55 21 99583-7591 (somente dígitos)
const WA_BASE = `https://wa.me/${PHONE}`;

/* Mensagens pré-formatadas por CTA (data-wa) */
(() => {
  const templates = {
    topo_whats: [
      "👋 *Olá, Andreza!* Vim pelo site e quero falar com você.",
      "— Enviado pelo site"
    ],
    ver_cardapio: [
      "🍽️ *Quero receber o cardápio da semana*",
      "Pode me mandar por aqui?",
      "— Enviado pelo site"
    ],
    falar_com_andreza: [
      "👋 *Olá, Andreza!*",
      "Tenho uma dúvida rápida sobre as refeições.",
      "— Enviado pelo site"
    ],
    duvida: [
      "❓ *Dúvida rápida*",
      "Vi seu site e gostaria de mais informações.",
      "— Enviado pelo site"
    ]
  };

  const enc = (lines) => encodeURIComponent(lines.join("\n"));

  $$('.js-wa').forEach(el => {
    el.addEventListener('click', (e) => {
      const key = el.getAttribute('data-wa');
      const lines = templates[key] || ["👋 Olá! Vim pelo site."];
      const extra = el.getAttribute('data-wa-extra');
      const msg = extra ? [...lines, "", extra] : lines;

      const url = `${WA_BASE}?text=${enc(msg)}`;

      // opcional: rastro mínimo em data-cta (apenas no console)
      const where = el.getAttribute('data-cta');
      if (where) console.info("[CTA]", where);

      e.preventDefault();
      window.open(url, "_blank", "noopener");
    });
  });
})();

/* Formulário -> WhatsApp com mensagem formatada */
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

    // feedback suave sem alterar o layout
    const sec = form.closest(".plan");
    if (sec) sec.scrollIntoView({ behavior:"smooth", block:"start" });
  });
})();
