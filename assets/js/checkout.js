// Zack Pizza - Checkout page controller (vanilla JS, reads SAMPLE_DATA + Cart)
(function () {
  'use strict';

  var APPENDED_ORDERS_KEY = 'zackpizza.orders.appended';

  // ---------- Helpers ----------
  function qs(sel, root) { return (root || document).querySelector(sel); }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(num) {
    var n = Number(num) || 0;
    return 'RM ' + n.toFixed(2);
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function pad3(n) { n = String(n); while (n.length < 3) n = '0' + n; return n; }

  function formatTime12h(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12;
    if (hh === 0) hh = 12;
    return hh + ':' + pad2(m) + ' ' + ampm;
  }

  function findOutlet(outletId) {
    if (!outletId || !SAMPLE_DATA || !SAMPLE_DATA.outlets) return null;
    for (var i = 0; i < SAMPLE_DATA.outlets.length; i++) {
      if (SAMPLE_DATA.outlets[i].id === outletId) return SAMPLE_DATA.outlets[i];
    }
    return null;
  }

  function getSelectedGatewayId() {
    var checked = document.querySelector('input[name="payment"]:checked');
    return checked ? checked.value : null;
  }

  function showError(msg) {
    var el = qs('#form-error');
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
      el.style.display = '';
    } else {
      el.textContent = '';
      el.hidden = true;
      el.style.display = 'none';
    }
  }

  // ---------- Renderers ----------
  function renderPaymentOptions() {
    var container = qs('#payment-options');
    if (!container) return;
    var gateways = (SAMPLE_DATA && SAMPLE_DATA.paymentGateways) || [];
    var logos = { stripe: '💳', billplz: '🏦', fpx: '🏧', cash: '💵' };
    var html = '';
    for (var i = 0; i < gateways.length; i++) {
      var g = gateways[i];
      var checked = i === 0 ? ' checked' : '';
      var selectedCls = i === 0 ? ' selected' : '';
      var logo = logos[g.id] || '💳';
      html += '<label class="payment-option' + selectedCls + '" data-gateway-id="' + escapeHtml(g.id) + '">'
        + '<input type="radio" name="payment" value="' + escapeHtml(g.id) + '"' + checked + '>'
        + '<span class="payment-logo">' + logo + '</span>'
        + '<span class="payment-label">' + escapeHtml(g.label) + '</span>'
        + (g.testMode ? '<span class="badge badge-soft-red">TEST MODE</span>' : '')
        + '</label>';
    }
    // Cash on pickup (always last, no test mode badge)
    html += '<label class="payment-option" data-gateway-id="cash">'
      + '<input type="radio" name="payment" value="cash">'
      + '<span class="payment-logo">' + logos.cash + '</span>'
      + '<span class="payment-label">Cash on pickup</span>'
      + '</label>';
    container.innerHTML = html;

    // Wire click toggling
    var labels = container.querySelectorAll('.payment-option');
    for (var j = 0; j < labels.length; j++) {
      labels[j].addEventListener('click', onPaymentClick);
    }
  }

  function onPaymentClick(e) {
    var label = e.currentTarget;
    var container = qs('#payment-options');
    if (!container) return;
    var all = container.querySelectorAll('.payment-option');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    label.classList.add('selected');
    var radio = label.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  function renderSummary() {
    var items = Cart.getItems();
    var listEl = qs('#order-summary-items');
    if (listEl) {
      var rows = '';
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var sub = it.price * it.qty;
        rows += '<li class="summary-item">'
          + '<span class="summary-item-name">' + escapeHtml(it.name) + '</span>'
          + '<span class="summary-item-meta">' + it.qty + ' &times; ' + formatPrice(it.price) + '</span>'
          + '<span class="summary-item-subtotal">' + formatPrice(sub) + '</span>'
          + '</li>';
      }
      listEl.innerHTML = rows;
    }

    var total = Cart.getTotal();
    var subEl = qs('#order-summary-subtotal');
    if (subEl) subEl.textContent = formatPrice(total);
    var totEl = qs('#order-summary-total');
    if (totEl) totEl.textContent = formatPrice(total);

    var outlet = findOutlet(Cart.getOutletId());
    var outletEl = qs('#order-summary-outlet');
    if (outletEl) {
      if (outlet) {
        var locName = (outlet.todayLocation && outlet.todayLocation.name) || '';
        outletEl.textContent = outlet.name + (locName ? ' — ' + locName : '');
      } else {
        outletEl.textContent = '';
      }
    }

    var etaEl = qs('#order-summary-eta');
    if (etaEl) {
      var eta = new Date(Date.now() + 20 * 60 * 1000);
      etaEl.textContent = formatTime12h(eta);
    }
  }

  // ---------- Validation ----------
  function validate(name, phone) {
    if (!name || name.trim().length < 2) {
      return 'Please enter your name (at least 2 characters).';
    }
    var digits = (phone || '').replace(/\D/g, '');
    var myRegex = /^(\+?60|0)\d{8,10}$/;
    if (!myRegex.test((phone || '').trim()) && (digits.length < 9 || digits.length > 13)) {
      return 'Please enter a valid Malaysian phone number.';
    }
    if (!getSelectedGatewayId()) {
      return 'Please select a payment method.';
    }
    return null;
  }

  // ---------- Order creation ----------
  function generateOrderId() {
    var now = new Date();
    var yyyy = now.getFullYear();
    var mmdd = pad2(now.getMonth() + 1) + pad2(now.getDate());
    var ms = now.getTime();
    var seq = pad3(ms % 1000);
    return 'ZP-' + yyyy + '-' + mmdd + '-' + seq;
  }

  function appendToLocalStorage(order) {
    try {
      var raw = window.localStorage.getItem(APPENDED_ORDERS_KEY);
      var arr = [];
      if (raw) {
        try { arr = JSON.parse(raw); } catch (e) { arr = []; }
        if (!Array.isArray(arr)) arr = [];
      }
      arr.push(order);
      window.localStorage.setItem(APPENDED_ORDERS_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('[Checkout] failed to mirror order to localStorage', e);
    }
  }

  function placeOrder(name, phone, gatewayId) {
    var now = new Date();
    var orderId = generateOrderId();
    var items = Cart.getItems().map(function (i) {
      return { productId: i.productId, qty: i.qty, price: i.price };
    });
    var order = {
      id: orderId,
      outletId: Cart.getOutletId(),
      customerName: name,
      customerPhone: phone,
      items: items,
      total: Cart.getTotal(),
      paymentMethod: gatewayId,
      paymentStatus: 'paid',
      orderStatus: 'pending',
      pickupETA: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      createdAt: now.toISOString()
    };
    if (SAMPLE_DATA && Array.isArray(SAMPLE_DATA.orders)) {
      SAMPLE_DATA.orders.push(order);
    }
    appendToLocalStorage(order);
    Cart.clear();
    window.location.href = 'confirmation.html?id=' + encodeURIComponent(orderId);
  }

  // ---------- Submit ----------
  function onSubmit(e) {
    e.preventDefault();
    showError(null);

    var nameInput = qs('#input-name');
    var phoneInput = qs('#input-phone');
    var name = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';

    var err = validate(name, phone);
    if (err) { showError(err); return; }

    var gatewayId = getSelectedGatewayId();
    var btn = qs('#btn-pay');
    var spinner = qs('#pay-spinner');
    var originalText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.dataset.originalText = originalText;
      btn.textContent = 'Processing…';
    }
    if (spinner) {
      spinner.hidden = false;
      spinner.style.display = '';
    }

    setTimeout(function () {
      try {
        placeOrder(name, phone, gatewayId);
      } catch (err) {
        console.error('[Checkout] placeOrder failed', err);
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText || 'Pay';
        }
        if (spinner) { spinner.hidden = true; spinner.style.display = 'none'; }
        showError('Something went wrong. Please try again.');
      }
    }, 1500);
  }

  // ---------- Init ----------
  function init() {
    if (typeof Cart === 'undefined') {
      console.error('[Checkout] Cart module missing');
      return;
    }

    // Guard: empty cart
    if (Cart.getCount() === 0) {
      window.location.href = 'cart.html';
      return;
    }

    // Guard: orphaned outlet
    var outletId = Cart.getOutletId();
    if (!findOutlet(outletId)) {
      window.location.href = 'index.html';
      return;
    }

    renderPaymentOptions();
    renderSummary();

    // Hide error initially
    var errEl = qs('#form-error');
    if (errEl) { errEl.hidden = true; errEl.style.display = 'none'; }

    // Hide spinner initially
    var spinner = qs('#pay-spinner');
    if (spinner) { spinner.hidden = true; spinner.style.display = 'none'; }

    var form = qs('#checkout-form');
    if (form) form.addEventListener('submit', onSubmit);

    // Live cart sync (cross-tab)
    if (typeof Cart.onChange === 'function') {
      Cart.onChange(function () {
        // Re-guard if cart was emptied elsewhere
        if (Cart.getCount() === 0) {
          window.location.href = 'cart.html';
          return;
        }
        renderSummary();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
