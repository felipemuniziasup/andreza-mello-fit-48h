(function () {
  // Ano no rodapé
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Scroll suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Base do WhatsApp: mobile x desktop
  function getWhatsAppBaseURL() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
  }

  // Form -> WhatsApp
  const form = document.getElementById('waForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = (document.getElementById('nome')?.value || '').trim();
      const telefone = (document.getElementById('telefone')?.value || '').trim();
      const endereco = (document.getElementById('endereco')?.value || '').trim();
      const plano = (document.getElementById('plano')?.value || '').trim();
      const pref = (document.getElementById('preferencia')?.value || '').trim();

      // Mensagem formatada (sem %0A aparecendo – usamos encodeURIComponent no final)
      let msg =
        '🧾 *Novo orçamento — Andreza Mello Fit*\n' +
        '———————————————\n' +
        '👤 *Nome:* ' + nome + '\n' +
        '📱 *Telefone:* ' + telefone + '\n' +
        '📍 *Endereço:* ' + endereco + '\n' +
        '📦 *Plano:* ' + plano;

      if (pref) {
        msg += '\n🍽️ *Preferência:* ' + pref;
      }
      msg += '\n\n_Enviado pelo site_';

      const encoded = encodeURIComponent(msg);
      const base = getWhatsAppBaseURL();
      const phone = '5521999587591'; // número da Andreza

      const url = `${base}?phone=${phone}&text=${encoded}`;

      // Abrir em nova aba sem alterar layout da página
      window.open(url, '_blank', 'noopener');

      // Feedback discreto (opcional)
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = 'Abrindo WhatsApp…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = prev;
          btn.disabled = false;
        }, 2000);
      }
    });
  }
})();
