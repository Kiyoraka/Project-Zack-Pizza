// Zack Pizza - localStorage-backed cart module (vanilla JS, global Cart)
// Storage keys:
//   zackpizza.cart.items     -> JSON array of { productId, qty }
//   zackpizza.cart.outletId  -> string (outlet id) or empty

(function () {
  'use strict';

  var ITEMS_KEY = 'zackpizza.cart.items';
  var OUTLET_KEY = 'zackpizza.cart.outletId';

  var _listeners = [];
  var _memCart = { items: [], outletId: '' };
  var _useMem = false;
  var _warnedStorage = false;

  // ---------- storage helpers ----------

  function _storageOk() {
    if (_useMem) return false;
    try {
      var t = '__zp_test__';
      window.localStorage.setItem(t, '1');
      window.localStorage.removeItem(t);
      return true;
    } catch (e) {
      if (!_warnedStorage) {
        console.warn('[Cart] localStorage unavailable, using in-memory fallback.', e);
        _warnedStorage = true;
      }
      _useMem = true;
      return false;
    }
  }

  function _readItemsRaw() {
    if (!_storageOk()) return _memCart.items.slice();
    try {
      var raw = window.localStorage.getItem(ITEMS_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (it) {
        return it && typeof it.productId === 'string' && typeof it.qty === 'number';
      });
    } catch (e) {
      console.warn('[Cart] failed to parse items, resetting.', e);
      return [];
    }
  }

  function _writeItemsRaw(items) {
    if (!_storageOk()) {
      _memCart.items = items.slice();
      return;
    }
    try {
      window.localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[Cart] failed to write items.', e);
    }
  }

  function _readOutletRaw() {
    if (!_storageOk()) return _memCart.outletId || '';
    try {
      return window.localStorage.getItem(OUTLET_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function _writeOutletRaw(outletId) {
    if (!_storageOk()) {
      _memCart.outletId = outletId || '';
      return;
    }
    try {
      if (outletId) {
        window.localStorage.setItem(OUTLET_KEY, outletId);
      } else {
        window.localStorage.removeItem(OUTLET_KEY);
      }
    } catch (e) {
      console.warn('[Cart] failed to write outletId.', e);
    }
  }

  // ---------- product/outlet resolution ----------

  function _findProduct(productId) {
    if (typeof SAMPLE_DATA === 'undefined' || !SAMPLE_DATA.products) return null;
    for (var i = 0; i < SAMPLE_DATA.products.length; i++) {
      if (SAMPLE_DATA.products[i].id === productId) return SAMPLE_DATA.products[i];
    }
    return null;
  }

  function _findOutlet(outletId) {
    if (!outletId) return null;
    if (typeof SAMPLE_DATA === 'undefined' || !SAMPLE_DATA.outlets) return null;
    for (var i = 0; i < SAMPLE_DATA.outlets.length; i++) {
      if (SAMPLE_DATA.outlets[i].id === outletId) return SAMPLE_DATA.outlets[i];
    }
    return null;
  }

  function _coerceQty(qty) {
    var n = parseInt(qty, 10);
    if (isNaN(n) || n < 1) return 1;
    return n;
  }

  // ---------- emit ----------

  function _snapshot() {
    var items = getItems();
    var count = 0;
    var subtotal = 0;
    for (var i = 0; i < items.length; i++) {
      count += items[i].qty;
      subtotal += items[i].price * items[i].qty;
    }
    return {
      items: items,
      count: count,
      subtotal: subtotal,
      total: subtotal,
      outletId: _readOutletRaw() || null
    };
  }

  function _emit() {
    var state = _snapshot();
    for (var i = 0; i < _listeners.length; i++) {
      try { _listeners[i](state); } catch (e) { console.warn('[Cart] listener error', e); }
    }
  }

  // ---------- public: mutations ----------

  /** @param {string} productId @param {number} [qty=1] */
  function add(productId, qty) {
    var product = _findProduct(productId);
    if (!product) { console.warn('[Cart] add: unknown productId', productId); return; }
    var n = _coerceQty(qty == null ? 1 : qty);
    var items = _readItemsRaw();
    var found = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].productId === productId) {
        items[i].qty = _coerceQty(items[i].qty + n);
        found = true;
        break;
      }
    }
    if (!found) items.push({ productId: productId, qty: n });
    _writeItemsRaw(items);
    _emit();
  }

  /** @param {string} productId */
  function remove(productId) {
    var items = _readItemsRaw().filter(function (it) { return it.productId !== productId; });
    _writeItemsRaw(items);
    _emit();
  }

  /** @param {string} productId @param {number} qty */
  function updateQty(productId, qty) {
    var n = parseInt(qty, 10);
    if (isNaN(n) || n <= 0) { remove(productId); return; }
    var items = _readItemsRaw();
    var found = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].productId === productId) {
        items[i].qty = _coerceQty(n);
        found = true;
        break;
      }
    }
    if (!found) {
      if (!_findProduct(productId)) {
        console.warn('[Cart] updateQty: unknown productId', productId);
        return;
      }
      items.push({ productId: productId, qty: _coerceQty(n) });
    }
    _writeItemsRaw(items);
    _emit();
  }

  /** @param {string} outletId */
  function setOutlet(outletId) {
    _writeOutletRaw(outletId || '');
    _emit();
  }

  function clear() {
    _writeItemsRaw([]);
    _writeOutletRaw('');
    _emit();
  }

  // ---------- public: reads ----------

  function getItems() {
    var raw = _readItemsRaw();
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var p = _findProduct(raw[i].productId);
      if (!p) continue;
      out.push({
        productId: raw[i].productId,
        qty: _coerceQty(raw[i].qty),
        price: p.price,
        name: p.name
      });
    }
    return out;
  }

  function getCount() {
    var items = getItems();
    var n = 0;
    for (var i = 0; i < items.length; i++) n += items[i].qty;
    return n;
  }

  function getSubtotal() {
    var items = getItems();
    var s = 0;
    for (var i = 0; i < items.length; i++) s += items[i].price * items[i].qty;
    return s;
  }

  function getTotal() {
    return getSubtotal();
  }

  function getOutletId() {
    return _readOutletRaw() || null;
  }

  function getOutlet() {
    return _findOutlet(_readOutletRaw());
  }

  // ---------- public: events ----------

  /** @param {(state: object) => void} callback */
  function onChange(callback) {
    if (typeof callback !== 'function') return function () {};
    _listeners.push(callback);
    return function unsubscribe() {
      var idx = _listeners.indexOf(callback);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  }

  // ---------- cross-tab sync ----------

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('storage', function (e) {
      if (!e || (e.key !== ITEMS_KEY && e.key !== OUTLET_KEY)) return;
      _emit();
    });
  }

  window.Cart = {
    add: add,
    remove: remove,
    updateQty: updateQty,
    setOutlet: setOutlet,
    clear: clear,
    getItems: getItems,
    getCount: getCount,
    getSubtotal: getSubtotal,
    getTotal: getTotal,
    getOutletId: getOutletId,
    getOutlet: getOutlet,
    onChange: onChange
  };
})();
