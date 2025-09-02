/* =========================
   Andreza Mello Fit — app.js
   ========================= */

/* Smooth scroll para âncoras internas */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
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

/* Formulário: abre WhatsApp com mensagem construída, sem recarregar a página */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('planForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // impede query string / reload

    const data = Object.fromEntries(new FormData(form));

    const texto = [
      'Olá Andreza! Vim pelo site e quero um orçamento:',
      `• Nome: ${data.nome ?? ''}`,
      `• Telefone: ${data.telefone ?? ''}`,
      `• Endereço: ${data.endereco ?? ''}`,
      `• Plano: ${data.plano ?? ''}`,
      data.preferencia ? `• Preferência: ${data.preferencia}` : null,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/5521995837591?text=${encodeURIComponent(texto)}`;

    // abre em nova aba sem bloquear (melhor UX no mobile/desktop)
    window.open(url, '_blank', 'noopener');

    // feedback rápido de envio
    form.querySelector('button[type="submit"]').disabled = true;
    setTimeout(() => (form.querySelector('button[type="submit"]').disabled = false), 1500);
  });
});

/* Sutileza: sombra no header ao rolar */
(function(){
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => {
    const scrolled = window.scrollY > 6;
    header.style.boxShadow = scrolled ? '0 6px 20px rgba(0,0,0,.18)' : 'none';
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();
