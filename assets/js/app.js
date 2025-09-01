const waNumber = "+55 21 99999-0000"; // TODO: trocar pelo número real

function waLink(txt){
  return `https://wa.me/${waNumber.replace(/\D/g,'')}?text=${encodeURIComponent(txt)}`
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('[data-cta]').forEach(el=>{
    el.addEventListener('click', ()=>{
      window.open(waLink('Olá! Tenho interesse no cardápio.'), '_blank');
    });
  });
});
