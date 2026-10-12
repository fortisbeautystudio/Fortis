document.documentElement.classList.add('js');

const WHATSAPP = '34663104413';

// Menú móvil
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('is-open', !open);
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }
});

// Borde de la navegación al hacer scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Conversación del hero: se reproduce una vez al cargar
requestAnimationFrame(() => document.querySelector('.chat').classList.add('is-playing'));

// Calculadora de pérdidas
const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const $ = (id) => document.getElementById(id);
const SEMANAS_MES = 4.3;
const DIAS_LABORABLES = 24;

function updateCalc() {
  const ticket = Number($('ticket').value);
  const noshow = Number($('noshow').value);
  const hours = Number($('hours').value);

  $('ticket-out').textContent = euros.format(ticket);
  $('noshow-out').textContent = noshow;
  $('hours-out').textContent = `${String(hours).replace('.', ',')} h`;

  $('loss').textContent = euros.format(Math.round(ticket * noshow * SEMANAS_MES));
  const monthHours = Math.round(hours * DIAS_LABORABLES);
  $('time').textContent = `${monthHours} ${monthHours === 1 ? 'hora' : 'horas'}`;

  const half = Math.round(ticket * noshow * SEMANAS_MES / 2);
  $('cover').textContent = half > 0
    ? `Recuperar solo la mitad de esas citas serían ${euros.format(half)} más cada mes.`
    : 'Sin no-shows, el ahorro está en las horas que dejas de pasar en WhatsApp.';
}
['ticket', 'noshow', 'hours'].forEach((id) => $(id).addEventListener('input', updateCalc));
updateCalc();

// Formulario: abre WhatsApp con el mensaje preparado
const form = $('lead-form');
const error = $('form-error');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const missing = [];
  form.querySelectorAll('[required]').forEach((field) => {
    const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
    field.setAttribute('aria-invalid', String(empty));
    if (empty) missing.push(field);
  });
  if (missing.length) {
    error.textContent = 'Completa tu nombre, el nombre del salón y tu teléfono, y acepta el uso de tus datos para poder enviarlo.';
    error.hidden = false;
    missing[0].focus();
    return;
  }
  error.hidden = true;

  const lines = [
    `Hola Fortis Studio, soy ${data.get('nombre').trim()}, del salón ${data.get('salon').trim()}.`,
    `Quiero mi diagnóstico gratis. Lo que me gustaría resolver primero: ${data.get('plan')}.`,
    `Mi teléfono: ${data.get('telefono').trim()}.`,
  ];
  const msg = data.get('mensaje').trim();
  if (msg) lines.push(`Lo que más tiempo me quita: ${msg}`);

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});

$('year').textContent = new Date().getFullYear();
