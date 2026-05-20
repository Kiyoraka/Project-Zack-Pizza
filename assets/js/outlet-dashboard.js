// Zack Pizza - Outlet Dashboard (login + orders + products + settings)
// Single file loaded by all 4 outlet-dashboard pages. Vanilla JS IIFE.
(function () {
  'use strict';

  // data.js declares SAMPLE_DATA with const, which does NOT attach to window in modern browsers.
  // Bridge it so the existing window.SAMPLE_DATA checks throughout this file resolve correctly.
  if (typeof SAMPLE_DATA !== 'undefined' && !window.SAMPLE_DATA) {
    window.SAMPLE_DATA = SAMPLE_DATA;
  }

  // ---------- Storage keys ----------
  var KEY_OUTLET_ID = 'zackpizza.currentOutletId';
  var KEY_OVERRIDES_PREFIX = 'zackpizza.outlets.overrides.'; // + outletId
  var KEY_STATUS_OVERRIDES = 'zackpizza.orders.statusOverrides';
  var KEY_APPENDED_ORDERS = 'zackpizza.orders.appended';

  // ---------- Generic helpers ----------
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

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

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return (parsed === null || parsed === undefined) ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function relativeTime(iso) {
    if (!iso) return '';
    var then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    var now = Date.now();
    var diffSec = Math.round((now - then) / 1000);
    var abs = Math.abs(diffSec);
    var suffix = diffSec >= 0 ? ' ago' : ' from now';
    if (abs < 60) return abs + ' sec' + suffix;
    var diffMin = Math.round(abs / 60);
    if (diffMin < 60) return diffMin + ' min' + suffix;
    var diffH = Math.round(abs / 3600);
    if (diffH < 24) return diffH + ' h' + suffix;
    var diffD = Math.round(abs / 86400);
    return diffD + ' d' + suffix;
  }

  // ---------- Outlet helpers ----------
  function getCurrentOutletId() {
    try { return localStorage.getItem(KEY_OUTLET_ID); } catch (e) { return null; }
  }

  function getOutletOverrides(outletId) {
    return readJson(KEY_OVERRIDES_PREFIX + outletId, {}) || {};
  }

  function saveOutletOverrides(outletId, overrides) {
    writeJson(KEY_OVERRIDES_PREFIX + outletId, overrides);
  }

  function getCurrentOutlet() {
    var id = getCurrentOutletId();
    if (!id || !window.SAMPLE_DATA) return null;
    var base = (SAMPLE_DATA.outlets || []).filter(function (o) { return o.id === id; })[0];
    if (!base) return null;
    var ov = getOutletOverrides(id);
    // Deep merge specific fields
    var merged = {};
    for (var k in base) if (base.hasOwnProperty(k)) merged[k] = base[k];
    if (ov.todayLocation) {
      var loc = {};
      var baseLoc = base.todayLocation || {};
      for (var lk in baseLoc) if (baseLoc.hasOwnProperty(lk)) loc[lk] = baseLoc[lk];
      for (var ok in ov.todayLocation) if (ov.todayLocation.hasOwnProperty(ok)) loc[ok] = ov.todayLocation[ok];
      merged.todayLocation = loc;
    }
    if (ov.status) merged.status = ov.status;
    if (ov.contactPhone !== undefined) merged.contactPhone = ov.contactPhone;
    if (ov.outOfStockToday && Object.prototype.toString.call(ov.outOfStockToday) === '[object Array]') {
      merged.outOfStockToday = ov.outOfStockToday.slice();
    } else {
      merged.outOfStockToday = (base.outOfStockToday || []).slice();
    }
    return merged;
  }

  // ---------- Order helpers ----------
  function getStatusOverrides() {
    return readJson(KEY_STATUS_OVERRIDES, {}) || {};
  }

  function setStatusOverride(orderId, status) {
    var map = getStatusOverrides();
    map[orderId] = status;
    writeJson(KEY_STATUS_OVERRIDES, map);
  }

  function getAppendedOrders() {
    var arr = readJson(KEY_APPENDED_ORDERS, []);
    return (Object.prototype.toString.call(arr) === '[object Array]') ? arr : [];
  }

  function getAllOrders() {
    var base = (window.SAMPLE_DATA && SAMPLE_DATA.orders) ? SAMPLE_DATA.orders : [];
    var appended = getAppendedOrders();
    var combined = base.concat(appended);
    var overrides = getStatusOverrides();
    return combined.map(function (o) {
      if (overrides[o.id]) {
        var copy = {};
        for (var k in o) if (o.hasOwnProperty(k)) copy[k] = o[k];
        copy.orderStatus = overrides[o.id];
        return copy;
      }
      return o;
    });
  }

  function getProductById(pid) {
    var prods = (window.SAMPLE_DATA && SAMPLE_DATA.products) ? SAMPLE_DATA.products : [];
    for (var i = 0; i < prods.length; i++) if (prods[i].id === pid) return prods[i];
    return null;
  }

  // ---------- Page guard ----------
  function isLoginPage() { return !!qs('#outlet-login-form'); }

  function pageGuard() {
    if (isLoginPage()) return true;
    if (!getCurrentOutletId()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  // ---------- Logout wiring (shared) ----------
  function wireLogoutButtons() {
    var ids = ['btn-logout', 'btn-logout-mobile'];
    ids.forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', function () {
          try { localStorage.removeItem(KEY_OUTLET_ID); } catch (e) {}
          window.location.href = '../index.html';
        });
      }
    });
  }

  function wireSubtitle(outlet) {
    var el = qs('#outlet-page-subtitle');
    if (!el || !outlet) return;
    var loc = (outlet.todayLocation && outlet.todayLocation.name) || '—';
    el.textContent = outlet.name + ' · ' + loc;
  }

  // =====================================================================
  // 1) LOGIN PAGE
  // =====================================================================
  function initLogin() {
    var form = qs('#outlet-login-form');
    if (!form) return;
    var listEl = qs('#lorry-radio-list');
    var emailInput = qs('#input-email');
    var passwordInput = qs('#input-password');
    var errEl = qs('#login-error');
    var outlets = (window.SAMPLE_DATA && SAMPLE_DATA.outlets) ? SAMPLE_DATA.outlets : [];

    if (listEl) {
      var html = outlets.map(function (o, idx) {
        var locName = (o.todayLocation && o.todayLocation.name) || '';
        return [
          '<label class="payment-option' + (idx === 0 ? ' selected' : '') + '" data-outlet-id="' + escapeHtml(o.id) + '">',
            '<input type="radio" name="outlet" value="' + escapeHtml(o.id) + '"' + (idx === 0 ? ' checked' : '') + ' required>',
            '<span class="payment-logo">🚚</span>',
            '<span class="payment-label">' + escapeHtml(o.name) + '</span>',
            '<span class="text-muted" style="margin-left:auto">' + escapeHtml(locName) + '</span>',
          '</label>'
        ].join('');
      }).join('');
      listEl.innerHTML = html || '<p class="text-muted">No lorries available.</p>';

      // Click-to-select on the whole card
      qsa('.payment-option', listEl).forEach(function (label) {
        label.addEventListener('click', function () {
          qsa('.payment-option', listEl).forEach(function (l) { l.classList.remove('selected'); });
          label.classList.add('selected');
          var radio = label.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        });
      });
    }

    function showError(msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
    function hideError() {
      if (errEl) errEl.style.display = 'none';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError();
      var selected = form.querySelector('input[name="outlet"]:checked');
      if (!selected) {
        showError('Please select a lorry.');
        return;
      }
      var emailVal = (emailInput && emailInput.value) ? emailInput.value.trim().toLowerCase() : '';
      var passwordVal = (passwordInput && passwordInput.value) ? passwordInput.value : '';
      if (emailVal !== 'outlet@gmail.com' || passwordVal !== 'admin123') {
        showError('Invalid credentials. Try outlet@gmail.com / admin123.');
        return;
      }
      try { localStorage.setItem(KEY_OUTLET_ID, selected.value); } catch (err) {}
      window.location.href = 'orders.html';
    });

    // Click-to-fill demo credentials
    var demoFill = qs('#demo-fill');
    if (demoFill) {
      demoFill.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.getAttribute) return;
        var field = t.getAttribute('data-fill-field');
        var val = t.getAttribute('data-fill-value');
        if (field && val) {
          var input = qs('#' + field);
          if (input) {
            input.value = val;
            input.focus();
          }
        }
      });
    }

  }

  // =====================================================================
  // 2) ORDERS PAGE
  // =====================================================================
  var ordersState = { activeStatus: 'pending' };

  function renderOrdersTabsAndList(outlet) {
    var listEl = qs('#orders-list');
    var tabs = qsa('.status-tab', qs('#status-tabs'));
    if (!listEl) return;

    var all = getAllOrders().filter(function (o) { return o.outletId === outlet.id; });

    // Counts
    var counts = { pending: 0, preparing: 0, ready: 0, 'picked-up': 0, cancelled: 0 };
    all.forEach(function (o) {
      if (counts[o.orderStatus] !== undefined) counts[o.orderStatus]++;
    });
    tabs.forEach(function (t) {
      var s = t.getAttribute('data-status');
      var c = t.querySelector('.status-count');
      if (c) c.textContent = (counts[s] || 0);
    });

    // Filter to active status
    var filtered = all.filter(function (o) { return o.orderStatus === ordersState.activeStatus; });

    // Sort newest first
    filtered.sort(function (a, b) {
      var ta = new Date(a.createdAt).getTime() || 0;
      var tb = new Date(b.createdAt).getTime() || 0;
      return tb - ta;
    });

    if (!filtered.length) {
      listEl.innerHTML = '<p class="text-muted" style="padding:24px; text-align:center;">No ' + escapeHtml(ordersState.activeStatus) + ' orders right now.</p>';
      return;
    }

    listEl.innerHTML = filtered.map(orderCardHtml).join('');

    // Wire status-change buttons
    qsa('.btn-status-advance', listEl).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var orderId = btn.getAttribute('data-order-id');
        var next = btn.getAttribute('data-next-status');
        if (!orderId || !next) return;
        setStatusOverride(orderId, next);
        renderOrdersTabsAndList(outlet);
      });
    });
  }

  function nextStatusFor(status) {
    if (status === 'pending') return { next: 'preparing', label: 'Mark as Preparing 👨‍🍳' };
    if (status === 'preparing') return { next: 'ready', label: 'Mark as Ready ✅' };
    if (status === 'ready') return { next: 'picked-up', label: 'Mark as Picked Up 📦' };
    return null;
  }

  function statusBadgeClass(status) {
    if (status === 'pending') return 'badge-pending';
    if (status === 'preparing') return 'badge-preparing';
    if (status === 'ready') return 'badge-ready';
    if (status === 'picked-up') return 'badge-picked-up';
    if (status === 'cancelled') return 'badge-cancelled';
    return 'badge';
  }

  function orderCardHtml(order) {
    var itemsHtml = (order.items || []).map(function (it) {
      var p = getProductById(it.productId);
      var name = p ? p.name : it.productId;
      var line = (it.qty || 1) + ' × ' + name + ' · ' + formatPrice((it.price || 0) * (it.qty || 1));
      return '<li>' + escapeHtml(line) + '</li>';
    }).join('');

    var advance = nextStatusFor(order.orderStatus);
    var ctaHtml = '';
    if (advance) {
      ctaHtml = '<button class="btn btn-primary btn-sm btn-status-advance"' +
        ' data-order-id="' + escapeHtml(order.id) + '"' +
        ' data-next-status="' + escapeHtml(advance.next) + '" type="button">' +
        escapeHtml(advance.label) + '</button>';
    } else if (order.orderStatus === 'picked-up') {
      ctaHtml = '<button class="btn btn-secondary btn-sm" type="button" disabled>Already picked up</button>';
    } else if (order.orderStatus === 'cancelled') {
      ctaHtml = '<span class="text-muted">Cancelled</span>';
    }

    return [
      '<article class="order-card card">',
        '<header class="order-card-header">',
          '<span class="order-id-mono">' + escapeHtml(order.id) + '</span>',
          '<span class="text-muted" style="margin-left:auto">' + escapeHtml(relativeTime(order.createdAt)) + '</span>',
        '</header>',
        '<div class="order-card-body">',
          '<p class="order-customer"><strong>' + escapeHtml(order.customerName || 'Customer') + '</strong>',
          order.customerPhone ? ' · <span class="text-muted">' + escapeHtml(order.customerPhone) + '</span>' : '',
          '</p>',
          '<ul class="order-items">' + itemsHtml + '</ul>',
          '<p class="order-total"><strong>Total: ' + escapeHtml(formatPrice(order.total)) + '</strong></p>',
        '</div>',
        '<footer class="order-card-footer">',
          '<span class="badge ' + statusBadgeClass(order.orderStatus) + '">' + escapeHtml(String(order.orderStatus || '').toUpperCase()) + '</span>',
          '<span style="margin-left:auto">' + ctaHtml + '</span>',
        '</footer>',
      '</article>'
    ].join('');
  }

  function initOrdersPage() {
    if (!qs('#orders-list')) return;
    var outlet = getCurrentOutlet();
    if (!outlet) {
      window.location.href = 'login.html';
      return;
    }
    wireSubtitle(outlet);

    // Tabs
    var tabs = qsa('.status-tab', qs('#status-tabs'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        ordersState.activeStatus = t.getAttribute('data-status') || 'pending';
        renderOrdersTabsAndList(outlet);
      });
    });

    // Refresh
    var refresh = qs('#btn-refresh');
    if (refresh) {
      refresh.addEventListener('click', function () { renderOrdersTabsAndList(outlet); });
    }

    renderOrdersTabsAndList(outlet);
  }

  // =====================================================================
  // 3) PRODUCTS PAGE
  // =====================================================================
  function initProductsPage() {
    var container = qs('#products-by-category');
    if (!container) return;
    var outlet = getCurrentOutlet();
    if (!outlet) {
      window.location.href = 'login.html';
      return;
    }
    wireSubtitle(outlet);

    var products = (window.SAMPLE_DATA && SAMPLE_DATA.products) ? SAMPLE_DATA.products : [];

    // Group by category in first-seen order
    var order = [];
    var byCat = {};
    products.forEach(function (p) {
      var c = p.category || 'Other';
      if (!byCat[c]) { byCat[c] = []; order.push(c); }
      byCat[c].push(p);
    });

    function render() {
      var outOfStock = outlet.outOfStockToday || [];
      var html = order.map(function (cat) {
        var rows = byCat[cat].map(function (p) {
          var unavailable = outOfStock.indexOf(p.id) !== -1;
          var checked = unavailable ? '' : 'checked';
          return [
            '<div class="entity-row">',
              '<div class="entity-thumb" style="width:60px;height:60px;background:linear-gradient(135deg,#fed7aa,#fca5a5);border-radius:8px;flex-shrink:0;"></div>',
              '<div class="entity-info" style="flex:1;min-width:0;">',
                '<p class="entity-name"><strong>' + escapeHtml(p.name) + '</strong></p>',
                '<p class="text-muted entity-desc" style="font-size:13px;">' + escapeHtml(p.description || '') + '</p>',
              '</div>',
              '<div class="entity-price" style="font-weight:600;">' + escapeHtml(formatPrice(p.price)) + '</div>',
              '<label class="toggle-switch" style="display:flex;align-items:center;gap:8px;margin-left:16px;">',
                '<input type="checkbox" class="product-toggle" data-product-id="' + escapeHtml(p.id) + '" ' + checked + '>',
                '<span class="toggle-label text-muted" style="font-size:12px;">Available today</span>',
              '</label>',
            '</div>'
          ].join('');
        }).join('');
        return [
          '<section class="product-category-block" style="margin-bottom:24px;">',
            '<h3 class="category-heading">' + escapeHtml(cat) + '</h3>',
            '<div class="entity-rows">' + rows + '</div>',
          '</section>'
        ].join('');
      }).join('');
      container.innerHTML = html || '<p class="text-muted">No products available.</p>';

      // Wire toggles
      qsa('.product-toggle', container).forEach(function (cb) {
        cb.addEventListener('click', function () {
          var pid = cb.getAttribute('data-product-id');
          var ov = getOutletOverrides(outlet.id);
          var list = (ov.outOfStockToday && Object.prototype.toString.call(ov.outOfStockToday) === '[object Array]')
            ? ov.outOfStockToday.slice()
            : (outlet.outOfStockToday || []).slice();
          var idx = list.indexOf(pid);
          if (cb.checked) {
            // available → remove from out-of-stock
            if (idx !== -1) list.splice(idx, 1);
          } else {
            // unavailable → add to out-of-stock
            if (idx === -1) list.push(pid);
          }
          ov.outOfStockToday = list;
          saveOutletOverrides(outlet.id, ov);
          outlet.outOfStockToday = list;
        });
      });
    }

    render();
  }

  // =====================================================================
  // 4) SETTINGS PAGE
  // =====================================================================
  function initSettingsPage() {
    var form = qs('#settings-form');
    if (!form) return;
    var outlet = getCurrentOutlet();
    if (!outlet) {
      window.location.href = 'login.html';
      return;
    }

    var loc = outlet.todayLocation || {};
    var fieldMap = {
      'set-location-name': loc.name || '',
      'set-address': loc.address || '',
      'set-maps-link': loc.mapsLink || '',
      'set-hours-start': loc.hoursStart || '',
      'set-hours-end': loc.hoursEnd || '',
      'set-contact-phone': outlet.contactPhone || ''
    };
    for (var id in fieldMap) {
      if (fieldMap.hasOwnProperty(id)) {
        var el = document.getElementById(id);
        if (el) el.value = fieldMap[id];
      }
    }

    // Status radios
    var statusRadios = qsa('input[name="status"]', form);
    statusRadios.forEach(function (r) {
      r.checked = (r.value === outlet.status);
    });
    // Sync .selected class on payment-option labels
    qsa('.payment-option', form).forEach(function (label) {
      var input = label.querySelector('input[name="status"]');
      if (input && input.checked) label.classList.add('selected');
      label.addEventListener('click', function () {
        qsa('.payment-option', form).forEach(function (l) { l.classList.remove('selected'); });
        label.classList.add('selected');
        var inp = label.querySelector('input[name="status"]');
        if (inp) inp.checked = true;
      });
    });

    var savedEl = qs('#settings-saved');
    var savedTimer = null;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusInput = form.querySelector('input[name="status"]:checked');
      var ov = getOutletOverrides(outlet.id);
      ov.todayLocation = {
        name: (document.getElementById('set-location-name') || {}).value || '',
        address: (document.getElementById('set-address') || {}).value || '',
        mapsLink: (document.getElementById('set-maps-link') || {}).value || '',
        hoursStart: (document.getElementById('set-hours-start') || {}).value || '',
        hoursEnd: (document.getElementById('set-hours-end') || {}).value || ''
      };
      ov.status = statusInput ? statusInput.value : 'active';
      ov.contactPhone = (document.getElementById('set-contact-phone') || {}).value || '';
      saveOutletOverrides(outlet.id, ov);

      if (savedEl) {
        savedEl.style.display = 'block';
        if (savedTimer) clearTimeout(savedTimer);
        savedTimer = setTimeout(function () {
          savedEl.style.display = 'none';
        }, 2000);
      }
    });
  }

  // =====================================================================
  // Bootstrap
  // =====================================================================
  function bootstrap() {
    if (!pageGuard()) return;
    wireLogoutButtons();

    if (isLoginPage()) {
      initLogin();
      return;
    }

    initOrdersPage();
    initProductsPage();
    initSettingsPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
