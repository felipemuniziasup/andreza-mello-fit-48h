/* =========================
   Andreza Mello Fit — app.js
   ========================= */

/* Smooth scroll para âncoras internas */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();

/* Formulário: abre WhatsApp com mensagem formatada (negrito, emojis, quebras de linha) */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('planForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // impede reload e query string

    const data = Object.fromEntries(new FormData(form));

    // Template bonito para o WhatsApp (negrito com *texto*, itálico com _texto_)
    const texto = [
      '📝 *Novo orçamento — Andreza Mello Fit*',
      '------------------------------------',
      `👤 *Nome:* ${data.nome ?? ''}`,
      `📱 *Telefone:* ${data.telefone ?? ''}`,
      `📍 *Endereço:* ${data.endereco ?? ''}`,
      `📦 *Plano:* ${data.plano ?? ''}`,
      data.preferencia ? `🧩 *Preferência:* ${data.preferencia}` : null,
      '',
      '_Enviado pelo site_'
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/5521995837591?text=${encodeURIComponent(texto)}`;

    // Abre em nova aba (não desabilita botão para evitar "pulo" visual)
    window.open(url, '_blank', 'noopener');

    // Opcional: limpa campos (comente se não quiser limpar)
    // form.reset();
  });
});

/* Sutileza: sombra no header ao rolar */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => {
    const scrolled = window.scrollY > 6;
    header.style.boxShadow = scrolled ? '0 6px 20px rgba(0,0,0,.18)' : 'none';
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();
