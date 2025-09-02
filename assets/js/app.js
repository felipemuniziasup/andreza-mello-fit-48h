(function () {
  // Smooth scroll para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // WhatsApp helper
  const numero = '5521995837591'; // ajuste se necessário
  const mkLink = (msg) =>
    `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;

  // Botões
  const setHref = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.href = mkLink(msg);
  };

  setHref('btnWhatsHeader', 'Olá Andreza! Vim pelo site e quero saber do cardápio da semana. 😊');
  setHref('btnWhatsHero',   'Olá Andreza! Quero pedir agora. Pode me enviar as opções de hoje?');
  setHref('btnWhatsMenu',   'Quero receber o cardápio completo desta semana. Obrigado!');
  setHref('btnWhatsAbout',  'Oi Andreza! Gostei do seu trabalho e quero falar com você. 🙂');
  setHref('btnWhatsPlano',  'Olá! Quero conversar sobre o Plano Semanal/Mensal (preferências e metas).');
  setHref('btnWhatsFooter', 'Oi Andreza! Vim pelo site e quero saber mais. 😉');

  // Ano automático no footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
