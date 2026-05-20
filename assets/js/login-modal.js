// Zack Pizza - Login modal (vanilla JS, no backend)
// Shared between index.html and outlet.html headers.
(function () {
  'use strict';

  function qs(id) { return document.getElementById(id); }

  function openModal() {
    var modal = qs('login-modal');
    if (modal) modal.classList.add('open');
    var emailEl = qs('login-email');
    if (emailEl) {
      setTimeout(function () { emailEl.focus(); }, 50);
    }
  }

  function closeModal() {
    var modal = qs('login-modal');
    if (modal) modal.classList.remove('open');
    var err = qs('login-error');
    if (err) { err.textContent = ''; err.hidden = true; }
  }

  function showError(msg) {
    var err = qs('login-error');
    if (!err) return;
    err.textContent = msg;
    err.hidden = false;
  }

  function init() {
    var openBtn = qs('open-login-modal');
    var closeBtn = qs('close-login-modal');
    var modal = qs('login-modal');
    var form = qs('login-form');

    if (openBtn) {
      openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (qs('login-email') || {}).value || '';
        var password = (qs('login-password') || {}).value || '';
        if (!email || !password) {
          showError('Please enter both email and password.');
          return;
        }
        // Demo only - no backend. Show a friendly stub message.
        showError('Sign-in is demo-only for now. Backend auth coming soon.');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
