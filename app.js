document.querySelectorAll('a[href="#inscricao"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null,'','#inscricao');
    document.querySelector('#inscricao').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
    document.querySelector('#nome-inicio').focus({preventScroll:true});
  });
});
document.querySelectorAll('.lead-form').forEach(form => {
  const phone=form.querySelector('input[type="tel"]');
  phone.addEventListener('input',()=>phone.setCustomValidity(''));
  form.addEventListener('submit',event=>{
    const digits=phone.value.replace(/\D/g,'');
    if(digits.length<10 || digits.length>15){
      event.preventDefault(); phone.setCustomValidity('Informe seu WhatsApp com DDD.'); phone.reportValidity(); return;
    }
    form.querySelector('button[type="submit"]').disabled=true;
  });
});
window.addEventListener('pageshow',()=>document.querySelectorAll('.lead-form button').forEach(button=>button.disabled=false));
