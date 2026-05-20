// Zack Pizza - Admin Dashboard (login + analytics + outlets + products + settings)
// Single file loaded by all 5 admin-dashboard pages. Vanilla JS IIFE.
(function () {
  'use strict';

  // ---------- Storage keys ----------
  var KEY_AUTH = 'zackpizza.adminAuth';
  var KEY_OUTLETS = 'zackpizza.outlets.mirror';
  var KEY_PRODUCTS = 'zackpizza.products.mirror';
  var KEY_BRAND = 'zackpizza.brand.mirror';
  var KEY_GATEWAYS = 'zackpizza.paymentGateways.mirror';
  var KEY_APPENDED_ORDERS = 'zackpizza.orders.appended';

  var DAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  function formatDate(d) {
    var date = (d instanceof Date) ? d : new Date(d);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
  }

  function formatDayShort(d) {
    var date = (d instanceof Date) ? d : new Date(d);
    return DAYS_FULL[date.getDay()];
  }

  function loadMirror(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return (parsed === null || parsed === undefined) ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function saveMirror(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }

  function safeSampleData() {
    return (typeof SAMPLE_DATA !== 'undefined' && SAMPLE_DATA) ? SAMPLE_DATA : { outlets: [], products: [], orders: [], salesHistory: [], brand: {} };
  }

  function getOutlets() {
    var sd = safeSampleData();
    return loadMirror(KEY_OUTLETS, sd.outlets || []);
  }
  function getProducts() {
    var sd = safeSampleData();
    return loadMirror(KEY_PRODUCTS, sd.products || []);
  }
  function getBrand() {
    var sd = safeSampleData();
    return loadMirror(KEY_BRAND, sd.brand || {});
  }
  function getGateways() {
    var defaults = {
      stripe: { enabled: true, config: { pub: '', sec: '', mode: 'test' } },
      billplz: { enabled: true, config: { api: '', coll: '' } },
      fpx: { enabled: true, config: { merchant: '' } },
      cash: { enabled: false, config: {} }
    };
    return loadMirror(KEY_GATEWAYS, defaults);
  }

  function getAppendedOrders() {
    return loadMirror(KEY_APPENDED_ORDERS, []) || [];
  }

  function getAllOrders() {
    var sd = safeSampleData();
    var base = (sd.orders || []).slice();
    var appended = getAppendedOrders();
    return base.concat(appended);
  }

  // ---------- Auth ----------
  function isLoggedIn() {
    return localStorage.getItem(KEY_AUTH) === 'true';
  }

  function setLoggedIn(val) {
    if (val) localStorage.setItem(KEY_AUTH, 'true');
    else localStorage.removeItem(KEY_AUTH);
  }

  function guardOrRedirect() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function wireLogout() {
    var ids = ['btn-logout', 'btn-logout-mobile'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          setLoggedIn(false);
          window.location.href = 'login.html';
        });
      }
    }
  }

  // ---------- Modal helpers ----------
  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
  }

  function closeAnyOpenModal() {
    qsa('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
  }

  function wireModalDismissers() {
    // Click outside content closes
    qsa('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });
    // X buttons
    qsa('.modal-close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var overlay = btn.closest('.modal-overlay');
        if (overlay) closeModal(overlay.id);
      });
    });
    // Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) closeAnyOpenModal();
    });
  }

  // ---------- LOGIN PAGE ----------
  function initLogin() {
    var form = qs('#admin-login-form');
    if (!form) return false;

    // If already logged in, go straight to analytics
    if (isLoggedIn()) {
      window.location.href = 'analytics.html';
      return true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailVal = (qs('#input-email') || {}).value || '';
      var p = (qs('#input-password') || {}).value || '';
      var err = qs('#login-error');
      if (emailVal.trim().toLowerCase() === 'admin@gmail.com' && p === 'admin123') {
        setLoggedIn(true);
        window.location.href = 'analytics.html';
      } else {
        if (err) {
          err.textContent = 'Invalid credentials. Try admin@gmail.com / admin123.';
          err.style.display = '';
        }
      }
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

    return true;
  }

  // ---------- ANALYTICS PAGE ----------
  function initAnalytics() {
    var chart = qs('#bar-chart');
    if (!chart) return false;
    if (!guardOrRedirect()) return true;

    var orders = getAllOrders();
    var outlets = getOutlets();
    var sd = safeSampleData();
    var salesHistory = (sd.salesHistory || []).slice();
    var products = getProducts();

    var now = new Date();
    var todayStr = now.toDateString();
    var yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    var yesterdayStr = yesterday.toDateString();

    // Today's orders + revenue (live orders)
    var todaysOrders = orders.filter(function (o) {
      try { return new Date(o.createdAt).toDateString() === todayStr; }
      catch (e) { return false; }
    });
    var todaysRevenue = todaysOrders.reduce(function (s, o) { return s + (Number(o.total) || 0); }, 0);

    // Yesterday baseline from salesHistory (sum across outlets for matching date)
    function isoFromDateObj(date) {
      var y = date.getFullYear();
      var m = String(date.getMonth() + 1).padStart(2, '0');
      var d = String(date.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + d;
    }
    var yIso = isoFromDateObj(yesterday);
    var yesterdayRevenue = 0;
    var yesterdayOrderCount = 0;
    salesHistory.forEach(function (row) {
      if (row.date === yIso) {
        yesterdayRevenue += Number(row.totalRevenue) || 0;
        yesterdayOrderCount += Number(row.orderCount) || 0;
      }
    });

    // KPIs
    var elRevToday = qs('#kpi-revenue-today');
    var elRevDelta = qs('#kpi-revenue-delta');
    var elOrdToday = qs('#kpi-orders-today');
    var elOrdDelta = qs('#kpi-orders-delta');
    var elActive = qs('#kpi-active-lorries');
    var elLorMeta = qs('#kpi-lorries-meta');

    if (elRevToday) elRevToday.textContent = formatPrice(todaysRevenue);
    if (elOrdToday) elOrdToday.textContent = String(todaysOrders.length);

    if (elRevDelta) elRevDelta.innerHTML = buildDeltaHtml(todaysRevenue, yesterdayRevenue);
    if (elOrdDelta) elOrdDelta.innerHTML = buildDeltaHtml(todaysOrders.length, yesterdayOrderCount);

    var activeCount = outlets.filter(function (o) { return o.status === 'active'; }).length;
    var totalCount = outlets.length;
    if (elActive) elActive.textContent = activeCount + ' / ' + totalCount;
    if (elLorMeta) {
      var closed = totalCount - activeCount;
      elLorMeta.textContent = closed === 0 ? 'All open today' : (closed + ' closed today');
    }

    // Bar chart - last 7 days
    var dayBuckets = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      var iso = isoFromDateObj(d);
      var revenue = 0;
      salesHistory.forEach(function (row) {
        if (row.date === iso) revenue += Number(row.totalRevenue) || 0;
      });
      dayBuckets.push({ date: d, iso: iso, revenue: revenue });
    }
    var maxRev = dayBuckets.reduce(function (m, b) { return b.revenue > m ? b.revenue : m; }, 0);
    var chartHtml = dayBuckets.map(function (b) {
      var pct = maxRev > 0 ? Math.round((b.revenue / maxRev) * 100) : 0;
      var title = formatDate(b.date) + ': RM ' + b.revenue.toFixed(2);
      return '<div class="bar-column">' +
        '<div class="bar-fill" style="height: ' + pct + '%" title="' + escapeHtml(title) + '"></div>' +
        '<span class="bar-label">' + escapeHtml(formatDayShort(b.date)) + '</span>' +
        '</div>';
    }).join('');
    chart.innerHTML = chartHtml;

    // Per-outlet table
    var tbody = qs('#perf-table-body');
    if (tbody) {
      var isoSet = {};
      dayBuckets.forEach(function (b) { isoSet[b.iso] = true; });

      var productNameMap = {};
      products.forEach(function (p) { productNameMap[p.id] = p.name; });

      var rowsHtml = outlets.map(function (o) {
        var rev = 0;
        var ordCt = 0;
        var topCount = {};
        salesHistory.forEach(function (row) {
          if (row.outletId === o.id && isoSet[row.date]) {
            rev += Number(row.totalRevenue) || 0;
            ordCt += Number(row.orderCount) || 0;
            if (row.topProductId) {
              topCount[row.topProductId] = (topCount[row.topProductId] || 0) + 1;
            }
          }
        });
        var topId = '';
        var topMax = 0;
        Object.keys(topCount).forEach(function (k) {
          if (topCount[k] > topMax) { topMax = topCount[k]; topId = k; }
        });
        var topName = productNameMap[topId] || '—';

        return '<tr>' +
          '<td><strong>' + escapeHtml(o.name || '') + '</strong></td>' +
          '<td>' + escapeHtml(formatPrice(rev)) + '</td>' +
          '<td>' + ordCt + '</td>' +
          '<td>' + escapeHtml(topName) + '</td>' +
          '<td><div class="sparkline" aria-hidden="true"></div></td>' +
          '</tr>';
      }).join('');
      tbody.innerHTML = rowsHtml || '<tr><td colspan="5" class="text-muted">No outlets.</td></tr>';
    }

    return true;
  }

  function buildDeltaHtml(current, baseline) {
    if (!baseline || baseline === 0) return '—';
    var diff = current - baseline;
    var pct = Math.round((diff / baseline) * 100);
    var arrow = diff >= 0 ? '▲' : '▼';
    var cls = diff >= 0 ? 'kpi-delta-up' : 'kpi-delta-down';
    var sign = pct > 0 ? '+' : '';
    return '<span class="' + cls + '">' + arrow + ' ' + sign + pct + '%</span>';
  }

  // ---------- OUTLETS PAGE ----------
  function initOutlets() {
    var listEl = qs('#outlets-list');
    if (!listEl) return false;
    if (!guardOrRedirect()) return true;

    function renderList() {
      var outlets = getOutlets();
      if (!outlets.length) {
        listEl.innerHTML = '<p class="text-muted">No lorries yet. Click + Add Lorry.</p>';
        return;
      }
      listEl.innerHTML = outlets.map(function (o) {
        var crew = (o.crew && o.crew.length) ? o.crew.join(', ') : '—';
        var statusClass = o.status === 'active' ? 'badge-soft-green' : 'badge-soft-red';
        var statusText = o.status === 'active' ? 'Active' : 'Closed today';
        var loc = (o.todayLocation && o.todayLocation.name) ? o.todayLocation.name : '—';
        return '<div class="entity-row" data-id="' + escapeHtml(o.id) + '">' +
          '<div class="entity-thumb">🚚</div>' +
          '<div class="entity-meta">' +
            '<p class="entity-name">' + escapeHtml(o.name || '') + '</p>' +
            '<p class="text-muted" style="font-size:13px">Crew: ' + escapeHtml(crew) + ' · 📍 ' + escapeHtml(loc) + '</p>' +
          '</div>' +
          '<span class="badge ' + statusClass + '">' + statusText + '</span>' +
          '<div class="entity-actions">' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="edit">Edit</button>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="delete">Delete</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function renderScheduleEditor(weekSchedule) {
      var holder = qs('#outlet-schedule');
      if (!holder) return;
      var byDay = {};
      (weekSchedule || []).forEach(function (s) { byDay[s.day] = s.location; });
      holder.innerHTML = SCHEDULE_DAYS.map(function (day) {
        var val = byDay[day] || '';
        return '<div class="schedule-row" style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">' +
          '<span style="width:48px; font-weight:600">' + day + '</span>' +
          '<input class="input" type="text" data-day="' + day + '" value="' + escapeHtml(val) + '" placeholder="Location">' +
        '</div>';
      }).join('');
    }

    function openOutletModal(mode, outlet) {
      var titleEl = qs('#outlet-modal-title');
      if (titleEl) titleEl.textContent = mode === 'add' ? 'Add Lorry' : 'Edit Lorry';

      var idField = qs('#outlet-form-id');
      var nameField = qs('#outlet-name');
      var crewField = qs('#outlet-crew');
      var statusField = qs('#outlet-status');

      if (idField) idField.value = outlet.id || '';
      if (nameField) nameField.value = outlet.name || '';
      if (crewField) crewField.value = (outlet.crew && outlet.crew.length) ? outlet.crew.join(', ') : '';
      if (statusField) statusField.value = outlet.status || 'active';

      renderScheduleEditor(outlet.weekSchedule || SCHEDULE_DAYS.map(function (d) { return { day: d, location: '' }; }));

      openModal('outlet-modal');
    }

    function generateNewOutletId() {
      var outlets = getOutlets();
      var max = 0;
      outlets.forEach(function (o) {
        var m = /lorry-(\d+)/.exec(o.id || '');
        if (m) {
          var n = parseInt(m[1], 10);
          if (n > max) max = n;
        }
      });
      return 'lorry-' + (max + 1);
    }

    listEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;
      var row = btn.closest('.entity-row');
      if (!row) return;
      var id = row.getAttribute('data-id');
      var action = btn.getAttribute('data-action');
      var outlets = getOutlets();
      var outlet = outlets.filter(function (o) { return o.id === id; })[0];
      if (!outlet) return;

      if (action === 'edit') {
        openOutletModal('edit', outlet);
      } else if (action === 'delete') {
        if (window.confirm('Delete ' + (outlet.name || 'this lorry') + '?')) {
          var updated = outlets.filter(function (o) { return o.id !== id; });
          saveMirror(KEY_OUTLETS, updated);
          renderList();
        }
      }
    });

    var addBtn = qs('#btn-add-outlet');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        openOutletModal('add', {
          id: generateNewOutletId(),
          name: '',
          crew: [],
          status: 'active',
          weekSchedule: SCHEDULE_DAYS.map(function (d) { return { day: d, location: '' }; }),
          todayLocation: { name: '', address: '', mapsLink: '', hoursStart: '17:00', hoursEnd: '23:00' },
          outOfStockToday: []
        });
      });
    }

    var form = qs('#outlet-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = (qs('#outlet-form-id') || {}).value || '';
        var name = (qs('#outlet-name') || {}).value || '';
        var crewRaw = (qs('#outlet-crew') || {}).value || '';
        var crew = crewRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var status = (qs('#outlet-status') || {}).value || 'active';
        var weekSchedule = qsa('#outlet-schedule input[data-day]').map(function (inp) {
          return { day: inp.getAttribute('data-day'), location: inp.value || '' };
        });

        var outlets = getOutlets();
        var existing = outlets.filter(function (o) { return o.id === id; })[0];
        if (existing) {
          existing.name = name;
          existing.crew = crew;
          existing.status = status;
          existing.weekSchedule = weekSchedule;
          // Try to keep todayLocation name in sync with today's schedule entry if available
          var todayDay = SCHEDULE_DAYS[(new Date().getDay() + 6) % 7]; // Mon=0
          var todayEntry = weekSchedule.filter(function (s) { return s.day === todayDay; })[0];
          if (todayEntry && todayEntry.location) {
            existing.todayLocation = existing.todayLocation || {};
            existing.todayLocation.name = todayEntry.location;
          }
        } else {
          outlets.push({
            id: id || generateNewOutletId(),
            name: name,
            crew: crew,
            status: status,
            weekSchedule: weekSchedule,
            todayLocation: { name: '', address: '', mapsLink: '', hoursStart: '17:00', hoursEnd: '23:00' },
            outOfStockToday: []
          });
        }
        saveMirror(KEY_OUTLETS, outlets);
        closeModal('outlet-modal');
        renderList();
      });
    }

    renderList();
    return true;
  }

  // ---------- PRODUCTS PAGE ----------
  function initProducts() {
    var tbody = qs('#products-table-body');
    if (!tbody) return false;
    if (!guardOrRedirect()) return true;

    var activeCategory = 'All';

    function renderChips() {
      var chipsEl = qs('#category-filter-chips');
      if (!chipsEl) return;
      var products = getProducts();
      var cats = {};
      products.forEach(function (p) { if (p.category) cats[p.category] = true; });
      var catList = ['All'].concat(Object.keys(cats));
      chipsEl.innerHTML = catList.map(function (c) {
        var cls = c === activeCategory ? 'category-tab active' : 'category-tab';
        return '<button type="button" class="' + cls + '" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
      }).join('');
    }

    function renderTable() {
      var products = getProducts();
      var filtered = activeCategory === 'All' ? products : products.filter(function (p) { return p.category === activeCategory; });
      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No products in this category.</td></tr>';
        return;
      }
      tbody.innerHTML = filtered.map(function (p) {
        var statusClass = p.available ? 'badge-soft-green' : 'badge-soft-red';
        var statusText = p.available ? 'Active' : 'Hidden';
        return '<tr data-id="' + escapeHtml(p.id) + '">' +
          '<td><div class="entity-thumb" style="width:40px;height:40px;font-size:20px">🍕</div></td>' +
          '<td><strong>' + escapeHtml(p.name || '') + '</strong><br><span class="text-muted" style="font-size:12px">' + escapeHtml(p.description || '') + '</span></td>' +
          '<td><span class="badge badge-soft">' + escapeHtml(p.category || '') + '</span></td>' +
          '<td>' + escapeHtml(formatPrice(p.price)) + '</td>' +
          '<td><span class="badge ' + statusClass + '">' + statusText + '</span></td>' +
          '<td>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="edit">Edit</button> ' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="delete">Delete</button>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    function generateNewProductId() {
      var products = getProducts();
      var max = 0;
      products.forEach(function (p) {
        var m = /prod-(\d+)/.exec(p.id || '');
        if (m) {
          var n = parseInt(m[1], 10);
          if (n > max) max = n;
        }
      });
      return 'prod-' + String(max + 1).padStart(3, '0');
    }

    function openProductModal(mode, product) {
      var titleEl = qs('#product-modal-title');
      if (titleEl) titleEl.textContent = mode === 'add' ? 'Add Product' : 'Edit Product';

      var idField = qs('#product-form-id');
      var nameField = qs('#product-name');
      var descField = qs('#product-description');
      var catField = qs('#product-category');
      var priceField = qs('#product-price');
      var imageField = qs('#product-image');
      var availField = qs('#product-available');

      if (idField) idField.value = product.id || '';
      if (nameField) nameField.value = product.name || '';
      if (descField) descField.value = product.description || '';
      if (catField) catField.value = product.category || 'Classic';
      if (priceField) priceField.value = (product.price != null) ? product.price : '';
      if (imageField) imageField.value = product.image || '';
      if (availField) availField.checked = product.available !== false;

      openModal('product-modal');
    }

    var chipsEl = qs('#category-filter-chips');
    if (chipsEl) {
      chipsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-cat]');
        if (!btn) return;
        activeCategory = btn.getAttribute('data-cat') || 'All';
        renderChips();
        renderTable();
      });
    }

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;
      var row = btn.closest('tr');
      if (!row) return;
      var id = row.getAttribute('data-id');
      var action = btn.getAttribute('data-action');
      var products = getProducts();
      var product = products.filter(function (p) { return p.id === id; })[0];
      if (!product) return;

      if (action === 'edit') {
        openProductModal('edit', product);
      } else if (action === 'delete') {
        if (window.confirm('Delete ' + (product.name || 'this product') + '?')) {
          var updated = products.filter(function (p) { return p.id !== id; });
          saveMirror(KEY_PRODUCTS, updated);
          renderTable();
          renderChips();
        }
      }
    });

    var addBtn = qs('#btn-add-product');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        openProductModal('add', {
          id: generateNewProductId(),
          name: '',
          description: '',
          category: 'Classic',
          price: 0,
          image: '',
          available: true
        });
      });
    }

    var form = qs('#product-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = (qs('#product-form-id') || {}).value || '';
        var name = (qs('#product-name') || {}).value || '';
        var description = (qs('#product-description') || {}).value || '';
        var category = (qs('#product-category') || {}).value || 'Classic';
        var price = parseFloat((qs('#product-price') || {}).value || '0') || 0;
        var image = (qs('#product-image') || {}).value || '';
        var available = !!((qs('#product-available') || {}).checked);

        var products = getProducts();
        var existing = products.filter(function (p) { return p.id === id; })[0];
        if (existing) {
          existing.name = name;
          existing.description = description;
          existing.category = category;
          existing.price = price;
          existing.image = image;
          existing.available = available;
        } else {
          products.push({
            id: id || generateNewProductId(),
            name: name,
            description: description,
            category: category,
            price: price,
            image: image,
            available: available
          });
        }
        saveMirror(KEY_PRODUCTS, products);
        closeModal('product-modal');
        renderChips();
        renderTable();
      });
    }

    renderChips();
    renderTable();
    return true;
  }

  // ---------- SETTINGS PAGE ----------
  function initSettings() {
    var form = qs('#admin-settings-form');
    if (!form) return false;
    if (!guardOrRedirect()) return true;

    // Tab switcher
    var tabs = form.querySelectorAll('.settings-tab');
    var panels = form.querySelectorAll('.settings-panel');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener('click', function () {
        var target = this.getAttribute('data-panel');
        for (var i = 0; i < tabs.length; i++) {
          var isActive = tabs[i].getAttribute('data-panel') === target;
          tabs[i].classList.toggle('active', isActive);
          tabs[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
        }
        for (var j = 0; j < panels.length; j++) {
          panels[j].classList.toggle('active', panels[j].getAttribute('data-panel') === target);
        }
      });
    }

    var brand = getBrand();
    var gateways = getGateways();

    // Pre-fill brand
    function setVal(id, val) {
      var el = qs(id);
      if (el && el.type !== 'file') el.value = (val == null ? '' : val);
    }
    setVal('#brand-name', brand.name);
    setVal('#brand-tagline', brand.tagline);
    setVal('#brand-phone', brand.contact && brand.contact.phone);
    setVal('#brand-email', brand.contact && brand.contact.email);
    setVal('#brand-instagram', brand.contact && brand.contact.instagram);

    // Pre-fill gateway toggles
    function setChecked(id, val) {
      var el = qs(id);
      if (el) el.checked = !!val;
    }
    setChecked('#gw-stripe-enabled', gateways.stripe && gateways.stripe.enabled);
    setChecked('#gw-billplz-enabled', gateways.billplz && gateways.billplz.enabled);
    setChecked('#gw-fpx-enabled', gateways.fpx && gateways.fpx.enabled);
    setChecked('#gw-cash-enabled', gateways.cash && gateways.cash.enabled);

    // Pre-fill gateway config fields
    var stripeCfg = (gateways.stripe && gateways.stripe.config) || {};
    setVal('#stripe-pub', stripeCfg.pub);
    setVal('#stripe-sec', stripeCfg.sec);
    var stripeMode = stripeCfg.mode || 'test';
    qsa('input[name=stripe-mode]').forEach(function (r) {
      r.checked = (r.value === stripeMode);
    });

    var billplzCfg = (gateways.billplz && gateways.billplz.config) || {};
    setVal('#billplz-api', billplzCfg.api);
    setVal('#billplz-coll', billplzCfg.coll);

    var fpxCfg = (gateways.fpx && gateways.fpx.config) || {};
    setVal('#fpx-merchant', fpxCfg.merchant);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var updatedBrand = {
        name: (qs('#brand-name') || {}).value || '',
        tagline: (qs('#brand-tagline') || {}).value || '',
        logo: (brand.logo) || 'assets/img/logo.svg',
        contact: {
          phone: (qs('#brand-phone') || {}).value || '',
          email: (qs('#brand-email') || {}).value || '',
          instagram: (qs('#brand-instagram') || {}).value || ''
        }
      };
      saveMirror(KEY_BRAND, updatedBrand);

      var stripeModeVal = 'test';
      qsa('input[name=stripe-mode]').forEach(function (r) {
        if (r.checked) stripeModeVal = r.value;
      });

      var updatedGateways = {
        stripe: {
          enabled: !!((qs('#gw-stripe-enabled') || {}).checked),
          config: {
            pub: (qs('#stripe-pub') || {}).value || '',
            sec: (qs('#stripe-sec') || {}).value || '',
            mode: stripeModeVal
          }
        },
        billplz: {
          enabled: !!((qs('#gw-billplz-enabled') || {}).checked),
          config: {
            api: (qs('#billplz-api') || {}).value || '',
            coll: (qs('#billplz-coll') || {}).value || ''
          }
        },
        fpx: {
          enabled: !!((qs('#gw-fpx-enabled') || {}).checked),
          config: {
            merchant: (qs('#fpx-merchant') || {}).value || ''
          }
        },
        cash: {
          enabled: !!((qs('#gw-cash-enabled') || {}).checked),
          config: {}
        }
      };
      saveMirror(KEY_GATEWAYS, updatedGateways);

      var savedMsg = qs('#admin-settings-saved');
      if (savedMsg) {
        savedMsg.style.display = '';
        setTimeout(function () { savedMsg.style.display = 'none'; }, 2000);
      }
    });
    return true;
  }

  // ---------- Bootstrap ----------
  function boot() {
    // Login is special: it must not enforce the guard
    if (initLogin()) {
      wireModalDismissers();
      return;
    }

    // All other pages require auth
    if (!guardOrRedirect()) return;

    wireLogout();
    wireModalDismissers();

    initAnalytics();
    initOutlets();
    initProducts();
    initSettings();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
