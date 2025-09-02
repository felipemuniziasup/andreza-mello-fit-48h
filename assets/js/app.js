/* ========= Utils ========= */
const $  = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

/* ========= Config WhatsApp ========= */
const WA_PHONE = "5521995837591"; // +55 21 99583-7591 (somente dígitos)
const WA_BASE  = `https://wa.me/${WA_PHONE}`;

/* Monta URL com texto já codificado */
const buildWaUrl = (text) => `${WA_BASE}?text=${encodeURIComponent(text || "")}`;

/* ========= Ano no rodapé ========= */
(() => {
  const y = $("#y");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ========= Smooth scroll para âncoras ========= */
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

/* ========= Prefill por querystring (nome, telefone, endereco, plano, obs) ========= */
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

/* ========= Templates de mensagem (CTAs) =========
   Sem traços; com emojis, linhas em branco e tom premium.
*/
const TEMPLATES = {
  sobre: (origem) => [
    "🧑‍🍳 *Contato — Andreza Mello Fit*",
    "",
    "Olá, Andreza! Vim pelo site e gostaria de conversar com você.",
    "Pode me chamar quando puder, por favor? Obrigado(a)! 🙌",
    "",
    origem ? `🔖 _Origem: ${origem}_` : ""
  ].filter(Boolean).join("\n"),

  cardapio: (origem) => [
    "📋 *Cardápio da Semana — Andreza Mello Fit*",
    "",
    "Quero receber o cardápio desta semana com os valores.",
    "Pode me enviar por aqui, por favor? 🙏",
    "",
    origem ? `🔖 _Origem: ${origem}_` : ""
  ].filter(Boolean).join("\n"),

  duvida: (origem) => [
    "💬 *Atendimento — Andreza Mello Fit*",
    "",
    "Olá! Vim pelo site e tenho algumas dúvidas.",
    "Pode me ajudar quando puder? 🙂",
    "",
    origem ? `🔖 _Origem: ${origem}_` : ""
  ].filter(Boolean).join("\n"),

  default: (origem) => [
    "👋 *Olá, vim pelo site da Andreza Mello Fit.*",
    "Gostaria de mais informações, por favor.",
    "",
    origem ? `🔖 _Origem: ${origem}_` : ""
  ].filter(Boolean).join("\n")
};

/* ========= CTAs -> WhatsApp com mensagem personalizada e rastreio =========
   - Qualquer <a> que aponte para wa.me/WA_PHONE será interceptado.
   - Suporte a class="js-wa" + data-wa="sobre|cardapio|duvida|custom"
   - data-msg permite texto custom; data-cta adiciona rastreio "Origem".
*/
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
      if (href.includes("?text=")) return; // já tem mensagem no link

      e.preventDefault();

      const kind   = (a.getAttribute("data-wa") || "").toLowerCase();
      const custom = a.getAttribute("data-msg");
      const origem = a.getAttribute("data-cta") || inferSource(a);

      let msg;
      if (kind === "custom" && custom) {
        msg = `${custom}\n\n${origem ? `🔖 _Origem: ${origem}_` : ""}`.trim();
      } else if (kind && TEMPLATES[kind]) {
        msg = TEMPLATES[kind](origem);
      } else {
        // Heurística leve pelo texto do botão
        const label = (a.textContent || "").toLowerCase();
        if (label.includes("cardápio")) msg = TEMPLATES.cardapio(origem);
        else if (label.includes("falar") || label.includes("andreza")) msg = TEMPLATES.sobre(origem);
        else msg = TEMPLATES.default(origem);
      }

      const url = buildWaUrl(msg);
      try { window.open(url, "_blank", "noopener"); }
      catch { location.href = url; }
    }, { passive: false });
  });

  // Tenta inferir de onde é o link (fallback para rastreio)
  function inferSource(a) {
    const sec = a.closest("section");
    if (!sec) return "";
    if (sec.id === "cardapio") return "Cardápio";
    if (sec.id === "planos") return "Formulário";
    if (sec.id === "sobre") return "Sobre a Chef";
    return (a.closest("header") && "Header") || (a.closest("footer") && "Footer") || "";
  }
})();

/* ========= Form -> WhatsApp (mensagem formatada + origem) ========= */
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
    linhas.push("", "🔖 _Origem: Formulário (Planos)_", "_Enviado pelo site_");

    const url = buildWaUrl(linhas.join("\n"));

    try { window.open(url, "_blank", "noopener"); }
    catch { location.href = url; }

    const sec = form.closest(".plan");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
