// Zack Pizza - Outlet (lorry) page renderer (vanilla JS, reads SAMPLE_DATA + window.Cart)
(function () {
  'use strict';

  // ---------- Helpers ----------
  function qs(id) { return document.getElementById(id); }

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

  function getQueryParam(name) {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get(name);
    } catch (e) {
      var match = window.location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    }
  }

  function findOutlet(id) {
    if (!id || !SAMPLE_DATA || !SAMPLE_DATA.outlets) return null;
    for (var i = 0; i < SAMPLE_DATA.outlets.length; i++) {
      if (SAMPLE_DATA.outlets[i].id === id) return SAMPLE_DATA.outlets[i];
    }
    return null;
  }

  function findProduct(id) {
    if (!id || !SAMPLE_DATA || !SAMPLE_DATA.products) return null;
    for (var i = 0; i < SAMPLE_DATA.products.length; i++) {
      if (SAMPLE_DATA.products[i].id === id) return SAMPLE_DATA.products[i];
    }
    return null;
  }

  // ---------- Error state ----------
  function renderNotFound() {
    var nameEl = qs('outlet-name');
    if (nameEl) nameEl.textContent = SAMPLE_DATA && SAMPLE_DATA.brand ? SAMPLE_DATA.brand.name : 'Zack Pizza';
    var addrEl = qs('outlet-address'); if (addrEl) addrEl.textContent = '';
    var hoursEl = qs('outlet-hours'); if (hoursEl) hoursEl.textContent = '';
    var statusEl = qs('outlet-status'); if (statusEl) statusEl.textContent = '';
    var crewEl = qs('outlet-crew'); if (crewEl) crewEl.innerHTML = '';
    var mapsEl = qs('outlet-maps'); if (mapsEl) mapsEl.style.display = 'none';
    var grid = qs('outlet-menu-grid');
    if (grid) {
      grid.innerHTML = '<div class="empty-state" style="padding:48px 16px; text-align:center;">' +
        'Lorry not found. <a href="index.html">Back to all lorries</a></div>';
    }
    var tabs = qs('category-tabs'); if (tabs) tabs.innerHTML = '';
  }

  // ---------- Hero ----------
  function renderHero(outlet) {
    var loc = outlet.todayLocation || {};
    var nameEl = qs('outlet-name');
    if (nameEl) nameEl.textContent = outlet.name;

    var addrEl = qs('outlet-address');
    if (addrEl) addrEl.textContent = (loc.name || '') + ' · ' + (loc.address || '');

    var isActive = outlet.status === 'active';

    var hoursEl = qs('outlet-hours');
    if (hoursEl) {
      var label = isActive ? 'Today' : 'Today (closed)';
      hoursEl.innerHTML = '🕐 ' + escapeHtml(label) + ' ' +
        escapeHtml(loc.hoursStart || '--:--') + ' – ' + escapeHtml(loc.hoursEnd || '--:--');
    }

    var statusEl = qs('outlet-status');
    if (statusEl) {
      statusEl.textContent = isActive ? 'ACTIVE NOW' : 'CLOSED TODAY';
      statusEl.className = isActive ? 'badge badge-active' : 'badge badge-cancelled';
    }

    var crewEl = qs('outlet-crew');
    if (crewEl) {
      var chips = (outlet.crew || []).map(function (c) {
        return '<span class="crew-chip">👨‍🍳 ' + escapeHtml(c) + '</span>';
      }).join('');
      crewEl.innerHTML = chips;
    }

    var mapsEl = qs('outlet-maps');
    if (mapsEl) {
      mapsEl.href = loc.mapsLink || '#';
      mapsEl.style.display = '';
    }
  }

  // ---------- Category tabs + menu ----------
  function groupByCategory(products) {
    var groups = {};
    var order = [];
    products.forEach(function (p) {
      if (!groups[p.category]) {
        groups[p.category] = [];
        order.push(p.category);
      }
      groups[p.category].push(p);
    });
    return { order: order, groups: groups };
  }

  function renderCategoryTabs(order) {
    var tabs = qs('category-tabs');
    if (!tabs) return;
    var html = order.map(function (cat, i) {
      return '<button class="category-tab' + (i === 0 ? ' active' : '') +
        '" data-cat="' + escapeHtml(cat) + '" type="button">' + escapeHtml(cat) + '</button>';
    }).join('');
    tabs.innerHTML = html;

    tabs.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.category-tab');
      if (!btn) return;
      var cat = btn.getAttribute('data-cat');
      var siblings = tabs.querySelectorAll('.category-tab');
      for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('active');
      btn.classList.add('active');
      filterMenuByCategory(cat);
    });
  }

  function filterMenuByCategory(cat) {
    var grid = qs('outlet-menu-grid');
    if (!grid) return;
    var sections = grid.querySelectorAll('.menu-category');
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (!cat || sec.getAttribute('data-cat') === cat) {
        sec.style.display = '';
      } else {
        sec.style.display = 'none';
      }
    }
  }

  function menuItemHtml(product, outlet) {
    var soft = 'linear-gradient(135deg, #ffd7d2, #ffe9b0)';
    var imageStyle = product.image
      ? 'background-image:url(\'' + escapeHtml(product.image) + '\'); background-size:cover; background-position:center;'
      : 'background:' + soft + ';';

    var soldOut = (outlet.outOfStockToday || []).indexOf(product.id) !== -1
      || product.available === false;
    var closed = outlet.status === 'closed-today';

    var action;
    if (soldOut) {
      action = '<span class="badge badge-cancelled">Sold out today</span>';
    } else {
      var disabledAttr = closed ? ' disabled' : '';
      action = '<button class="btn btn-primary btn-sm btn-add" data-product-id="' +
        escapeHtml(product.id) + '" type="button"' + disabledAttr + '>+ Add</button>';
    }

    var classes = 'menu-item' + (soldOut ? ' out-of-stock' : '');

    return [
      '<div class="' + classes + '" data-product-id="' + escapeHtml(product.id) + '">',
        '<div class="menu-item-image" style="' + imageStyle + '"></div>',
        '<div class="menu-item-body">',
          '<h3 class="menu-item-name">' + escapeHtml(product.name) + '</h3>',
          '<p class="menu-item-description text-muted">' + escapeHtml(product.description || '') + '</p>',
          '<div class="menu-item-meta">',
            '<span class="menu-item-price">' + formatPrice(product.price) + '</span>',
            action,
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderMenu(outlet) {
    var grid = qs('outlet-menu-grid');
    if (!grid) return;
    var products = (SAMPLE_DATA.products || []);
    var grouped = groupByCategory(products);

    var closedBanner = outlet.status === 'closed-today'
      ? '<div class="closed-banner badge badge-cancelled" style="display:block; text-align:center; padding:12px; margin-bottom:16px;">Lorry closed today</div>'
      : '';

    var sectionsHtml = grouped.order.map(function (cat) {
      var items = grouped.groups[cat].map(function (p) {
        return menuItemHtml(p, outlet);
      }).join('');
      return [
        '<section class="menu-category" data-cat="' + escapeHtml(cat) + '">',
          '<h3 class="category-heading" data-cat="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</h3>',
          '<div class="menu-grid">' + items + '</div>',
        '</section>'
      ].join('');
    }).join('');

    grid.innerHTML = closedBanner + sectionsHtml;

    // Show only first category by default
    if (grouped.order.length) filterMenuByCategory(grouped.order[0]);

    return grouped;
  }

  // ---------- Add to cart wiring ----------
  function wireAddButtons(outlet) {
    var grid = qs('outlet-menu-grid');
    if (!grid) return;

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.btn-add');
      if (!btn || btn.disabled) return;
      var productId = btn.getAttribute('data-product-id');
      if (!productId) return;

      var product = findProduct(productId);
      if (!product) return;

      var currentOutletId = window.Cart.getOutletId();
      if (!currentOutletId) {
        window.Cart.setOutlet(outlet.id);
      } else if (currentOutletId !== outlet.id) {
        var prev = (function () {
          for (var i = 0; i < SAMPLE_DATA.outlets.length; i++) {
            if (SAMPLE_DATA.outlets[i].id === currentOutletId) return SAMPLE_DATA.outlets[i];
          }
          return null;
        })();
        var prevName = prev ? prev.name : 'another lorry';
        var ok = window.confirm('Your cart has items from ' + prevName +
          '. Clear it and switch to ' + outlet.name + '?');
        if (!ok) return;
        window.Cart.clear();
        window.Cart.setOutlet(outlet.id);
      }

      window.Cart.add(productId, 1);

      var originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = originalText;
        if (outlet.status !== 'closed-today') btn.disabled = false;
      }, 800);
    });
  }

  // ---------- Drawer ----------
  function cartDrawerItemHtml(item) {
    var product = findProduct(item.productId) || {};
    var soft = 'linear-gradient(135deg, #ffd7d2, #ffe9b0)';
    var imageStyle = product.image
      ? 'background-image:url(\'' + escapeHtml(product.image) + '\'); background-size:cover; background-position:center;'
      : 'background:' + soft + ';';
    var lineTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);

    return [
      '<div class="cart-drawer-item" data-product-id="' + escapeHtml(item.productId) + '">',
        '<div class="cart-drawer-thumb" style="' + imageStyle + '"></div>',
        '<div class="cart-drawer-info">',
          '<div class="cart-drawer-name">' + escapeHtml(item.name) + '</div>',
          '<div class="cart-drawer-qty">',
            '<button class="qty-btn" type="button" data-action="decrement" data-product-id="' + escapeHtml(item.productId) + '" aria-label="Decrease">-</button>',
            '<span class="qty-value">' + escapeHtml(String(item.qty)) + '</span>',
            '<button class="qty-btn" type="button" data-action="increment" data-product-id="' + escapeHtml(item.productId) + '" aria-label="Increase">+</button>',
          '</div>',
        '</div>',
        '<div class="cart-drawer-side">',
          '<div class="cart-drawer-line-total">' + formatPrice(lineTotal) + '</div>',
          '<button class="cart-drawer-remove" type="button" data-action="remove" data-product-id="' + escapeHtml(item.productId) + '" aria-label="Remove">×</button>',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderDrawer() {
    var body = qs('cart-drawer-body');
    var items = window.Cart.getItems();
    var subtotalEl = qs('drawer-subtotal');
    var totalEl = qs('drawer-total');
    var checkoutBtn = qs('drawer-checkout');

    if (!items.length) {
      if (body) {
        body.innerHTML = '<div class="empty-state" style="padding:32px 16px; text-align:center;">' +
          'Your cart is empty. Add something delicious!</div>';
      }
      if (subtotalEl) subtotalEl.textContent = formatPrice(0);
      if (totalEl) totalEl.textContent = formatPrice(0);
      if (checkoutBtn) {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
      }
      return;
    }

    if (body) {
      body.innerHTML = items.map(cartDrawerItemHtml).join('');
    }
    if (subtotalEl) subtotalEl.textContent = formatPrice(window.Cart.getSubtotal());
    if (totalEl) totalEl.textContent = formatPrice(window.Cart.getTotal());
    if (checkoutBtn) {
      checkoutBtn.classList.remove('disabled');
      checkoutBtn.removeAttribute('aria-disabled');
      checkoutBtn.style.opacity = '';
      checkoutBtn.style.pointerEvents = '';
    }
  }

  function wireDrawerDelegation() {
    var body = qs('cart-drawer-body');
    if (!body) return;
    body.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      var productId = btn.getAttribute('data-product-id');
      if (!productId) return;

      var items = window.Cart.getItems();
      var current = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId === productId) { current = items[i]; break; }
      }

      if (action === 'increment') {
        window.Cart.updateQty(productId, (current ? current.qty : 0) + 1);
      } else if (action === 'decrement') {
        window.Cart.updateQty(productId, (current ? current.qty : 1) - 1);
      } else if (action === 'remove') {
        window.Cart.remove(productId);
      }
    });
  }

  function wireDrawerOpenClose() {
    var drawer = qs('cart-drawer');
    var openBtn = qs('open-cart-drawer');
    var closeBtn = qs('close-cart-drawer');

    if (openBtn && drawer) {
      openBtn.addEventListener('click', function () { drawer.classList.add('open'); });
    }
    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', function () { drawer.classList.remove('open'); });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer) drawer.classList.remove('open');
    });
  }

  // ---------- Mobile + header ----------
  function renderMobileBar() {
    var bar = qs('mobile-cart-bar');
    var count = window.Cart.getCount();
    var countEl = qs('mobile-cart-count');
    var totalEl = qs('mobile-cart-total');

    if (countEl) countEl.textContent = String(count);
    if (totalEl) totalEl.textContent = formatPrice(window.Cart.getTotal());
    if (bar) bar.style.display = count > 0 ? 'flex' : 'none';
  }

  function wireMobileBar() {
    var bar = qs('mobile-cart-bar');
    if (!bar) return;
    bar.addEventListener('click', function () { window.location.href = 'cart.html'; });
  }

  function renderHeaderAndNavBadge() {
    var count = window.Cart.getCount();
    var headerEl = qs('header-cart-count');
    if (headerEl) headerEl.textContent = String(count);

    var navBadge = qs('cart-count-badge');
    if (navBadge) {
      if (count > 0) {
        navBadge.textContent = String(count);
        navBadge.style.display = '';
      } else {
        navBadge.style.display = 'none';
      }
    }
  }

  function renderAll() {
    renderDrawer();
    renderMobileBar();
    renderHeaderAndNavBadge();
  }

  // ---------- Boot ----------
  function init() {
    if (typeof SAMPLE_DATA === 'undefined') {
      console.error('SAMPLE_DATA missing — ensure data.js is loaded before outlet.js');
      return;
    }
    if (!window.Cart) {
      console.error('Cart missing — ensure cart.js is loaded before outlet.js');
      return;
    }

    var outletId = getQueryParam('id');
    var outlet = findOutlet(outletId);

    if (!outlet) {
      renderNotFound();
      wireDrawerOpenClose();
      wireDrawerDelegation();
      wireMobileBar();
      window.Cart.onChange(renderAll);
      renderAll();
      return;
    }

    renderHero(outlet);
    var grouped = groupByCategory(SAMPLE_DATA.products || []);
    renderCategoryTabs(grouped.order);
    renderMenu(outlet);
    wireAddButtons(outlet);

    wireDrawerOpenClose();
    wireDrawerDelegation();
    wireMobileBar();

    window.Cart.onChange(renderAll);
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
