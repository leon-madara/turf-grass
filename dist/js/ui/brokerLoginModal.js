// js/ui/brokerLoginModal.js
// Broker Access modal (green glass UI). Redirects to /broker/index.html on success.

(() => {
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const $ = (s, c = document) => c.querySelector(s);

  let modal, form, user, pass;
  const PARTIAL_PATH = '/turf-grass/partials/broker-login.html';

  function open() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => user?.focus(), 40);
  }

  function close() {
    if (!modal) return;
    modal.hidden = true;
    form?.reset();
    clearErrors();
    document.body.style.overflow = '';
  }

  function clearErrors() {
    $$('.bl-error', form).forEach(i => i.classList.remove('bl-error'));
    $$('.bl-errtext', form).forEach(n => n.remove());
  }

  function error(input, msg) {
    input.classList.add('bl-error');
    const div = document.createElement('div');
    div.className = 'bl-errtext';
    div.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    input.after(div);
  }

  function validate() {
    clearErrors();
    let ok = true;
    if (!user.value.trim()) { error(user, 'Username is required'); ok = false; }
    if (!pass.value) { error(pass, 'Password is required'); ok = false; }
    return ok;
  }

  function setLoading(on) {
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = on;
    btn.classList.toggle('is-loading', on);
    if (on) {
      btn.dataset.lbl = btn.textContent;
      btn.textContent = 'Signing in…';
    } else if (btn.dataset.lbl) {
      btn.textContent = btn.dataset.lbl;
      delete btn.dataset.lbl;
    }
  }

  function redirectToDashboard() {
    // Prefer your shared auth module if available
    const Auth = window.AuthState;
    if (Auth?.login) Auth.login({ role: 'broker', name: user.value.trim() });

    window.location.href = '/broker/index.html';
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulated auth; replace with real API
    setTimeout(() => {
      const u = user.value.trim();
      const p = pass.value;
      if (u === 'BROKER' && p === '123') {
        redirectToDashboard();
      } else {
        setLoading(false);
        error(user, 'Use demo BROKER');
        error(pass, 'Use demo 123');
        user.focus();
      }
    }, 700);
  }

  function boot() {
    modal = $('#brokerLogin');
    if (!modal) return; // partial not on this page

    form = $('#bl-form', modal);
    user = $('#bl-user', modal);
    pass = $('#bl-pass', modal);

    // open/close wires
    $('#dealerLoginBtn')?.addEventListener('click', open);
    $$('.bl-close, .bl-overlay', modal).forEach(el => el.addEventListener('click', close));

    // esc to close
    document.addEventListener('keydown', (ev) => {
      if (!modal || modal.hidden) return;
      if (ev.key === 'Escape') close();
    });

    form?.addEventListener('submit', submit);
  }

  // Inject the partial and then wire up
  async function init() {
    try {
      await window.loadHTML('body', PARTIAL_PATH, { position: 'beforeend' });
      // Small delay to ensure DOM is ready
      setTimeout(boot, 10);
    } catch (err) {
      console.error('Failed to load broker login modal:', err);
    }
  }

  // Start immediately
  init();

  // expose for manual control if you like
  window.BrokerLogin = { open, close };
})();
