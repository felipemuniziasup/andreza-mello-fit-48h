// scroll suave para âncoras internas
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();

// revelar elementos ao rolar (microinterações)
(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ano dinâmico
document.getElementById('yy').textContent = new Date().getFullYear();

// Formulário → envia mensagem pronta no WhatsApp
(() => {
  const form = document.getElementById('planForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    const texto = [
      'Olá Andreza! Vim pelo site e quero um orçamento.',
      `• Nome: ${data.nome}`,
      `• Telefone: ${data.telefone}`,
      `• Endereço: ${data.endereco}`,
      `• Plano: ${data.plano}`,
      data.preferencia ? `• Preferência: ${data.preferencia}` : null,
    ].filter(Boolean).join('%0A');

    const url = `https://wa.me/5521995837591?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
})();
