/* Utilidades simples */
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

/* Ano no rodapé */
(() => {
  const y = new Date().getFullYear();
  const el = $("#y");
  if (el) el.textContent = y;
})();

/* Smooth scroll para âncoras internas */
(() => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
})();

/* Preenchimento automático por querystring (nome, telefone, endereco, plano, obs) */
(() => {
  const params = new URLSearchParams(location.search);
  const map = {
    nome: "#nome",
    telefone: "#telefone",
    endereco: "#endereco",
    plano: "#planoSel",
    obs: "#preferencia"
  };
  Object.entries(map).forEach(([k, sel]) => {
    const v = params.get(k);
    const el = $(sel);
    if (v && el) {
      if (el.tagName === 'SELECT') {
        Array.from(el.options).forEach(o => { if (o.value.toLowerCase() === v.toLowerCase()) o.selected = true; });
      } else {
        el.value = decodeURIComponent(v);
      }
    }
  });
})();

/* Form WhatsApp — mensagem bonita com ícones (sem alterar layout) */
(() => {
  const form = $("#waForm");
  if (!form) return;

  const endpoint = "https://wa.me/55219995837591"; // ajuste se precisar

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = $("#nome")?.value?.trim() || "";
    const tel  = $("#telefone")?.value?.trim() || "";
    const end  = $("#endereco")?.value?.trim() || "";
    const plano= $("#planoSel")?.value || "Semanal";
    const pref = $("#preferencia")?.value?.trim() || "";

    // Mensagem formatada (Markdown do WhatsApp + emojis)
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

    const msg = encodeURIComponent(linhas.join("\n"));
    const url = `${endpoint}?text=${msg}`;

    // Abre o WhatsApp em nova aba/janela
    window.open(url, "_blank", "noopener");

    // Não mexe no DOM do formulário -> evita "mudar de forma"
    // Porém, podemos focar o topo da seção para feedback visual
    const sec = form.closest(".plan");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
