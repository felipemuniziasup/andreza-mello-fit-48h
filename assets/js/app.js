/* ========= Utils ========= */
const $  = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

/* ========= Config WhatsApp ========= */
const WA_PHONE = "5521995837591"; // +55 21 99583-7591
const WA_BASE  = `https://wa.me/${WA_PHONE}`;
const buildWaUrl = (text) => `${WA_BASE}?text=${encodeURIComponent(text || "")}`;

/* ========= Ano no rodapé ========= */
(() => {
  const y = $("#y");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ========= Smooth scroll ========= */
(() => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
})();

/* ========= Prefill querystring ========= */
(() => {
  const qs = new URLSearchParams(location.search);
  const map = { nome:"#nome", telefone:"#telefone", endereco:"#endereco", plano:"#planoSel", obs:"#preferencia" };
  Object.entries(map).forEach(([k, sel]) => {
    const v = qs.get(k);
    const el = $(sel);
    if (!v || !el) return;
    if (el.tagName === "SELECT") {
      Array.from(el.options).forEach(o => {
        if (o.value.toLowerCase() === v.toLowerCase()) o.selected = true;
      });
    } else {
      el.value = decodeURIComponent(v);
    }
  });
})();

/* ========= Templates bonitos (sem “origem”) ========= */
const TEMPLATES = {
  sobre: () => [
    "🧑‍🍳 *Contato — Andreza Mello Fit*",
    "",
    "Olá, Andreza! Vim pelo site e gostaria de conversar com você.",
    "Pode me chamar quando puder, por favor? Obrigado(a)! 🙌"
  ].join("\n"),

  cardapio: () => [
    "📋 *Cardápio da Semana — Andreza Mello Fit*",
    "",
    "Quero receber o cardápio desta semana com os valores.",
    "Pode me enviar por aqui, por favor? 🙏"
  ].join("\n"),

  duvida: () => [
    "💬 *Atendimento — Andreza Mello Fit*",
    "",
    "Olá! Vim pelo site e tenho algumas dúvidas.",
    "Pode me ajudar quando puder? 🙂"
  ].join("\n"),

  default: () => [
    "👋 *Olá, vim pelo site da Andreza Mello Fit.*",
    "Gostaria de mais informações, por favor."
  ].join("\n")
};

/* ========= CTAs -> WhatsApp com mensagens bonitas ========= */
(() => {
  const sel = [
    `a[href*="wa.me/${WA_PHONE}"]`,
    `a[href*="api.whatsapp.com"][href*="${WA_PHONE}"]`,
    "a.js-wa"
  ].join(",");

  const links = $$(sel);
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (href.includes("?text=")) return;

      e.preventDefault();

      const kind   = (a.getAttribute("data-wa") || "").toLowerCase();
      const custom = a.getAttribute("data-msg");

      let msg;
      if (kind === "custom" && custom) {
        msg = custom;
      } else if (kind && TEMPLATES[kind]) {
        msg = TEMPLATES[kind]();
      } else {
        const label = (a.textContent || "").toLowerCase();
        if (label.includes("cardápio")) msg = TEMPLATES.cardapio();
        else if (label.includes("falar") || label.includes("andreza")) msg = TEMPLATES.sobre();
        else msg = TEMPLATES.default();
      }

      const url = buildWaUrl(msg);
      try { window.open(url, "_blank", "noopener"); }
      catch { location.href = url; }
    }, { passive: false });
  });
})();

/* ========= Form -> WhatsApp (mensagem formatada e limpa) ========= */
(() => {
  const form = $("#waForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome  = $("#nome")?.value?.trim() || "";
    const tel   = $("#telefone")?.value?.trim() || "";
    const end   = $("#endereco")?.value?.trim() || "";
    const plano = $("#planoSel")?.value || "Semanal";
    const pref  = $("#preferencia")?.value?.trim() || "";

    const linhas = [
      "🧾 *Novo orçamento — Andreza Mello Fit*",
      "",
      `👤 *Nome:* ${nome}`,
      `📞 *Telefone:* ${tel}`,
      `📍 *Endereço:* ${end}`,
      `📦 *Plano:* ${plano}`,
    ];
    if (pref) linhas.push(`📝 *Preferência:* ${pref}`);
    linhas.push("", "_Enviado pelo site_");

    const url = buildWaUrl(linhas.join("\n"));
    try { window.open(url, "_blank", "noopener"); }
    catch { location.href = url; }
  });
})();
