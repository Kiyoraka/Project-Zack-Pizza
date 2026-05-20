# 🍕 Zack Pizza — Mobile Pizza-on-Lorry Demo

**Fresh pizza, hot wheels.**

A clickable hardcoded vanilla prototype for a Kelantan-based mobile pizza-lorry fleet. Built as a TNEX prospect demo — zero backend, zero framework, zero build step. Just double-click `index.html`.

---

## What It Is

A 16-page customer + staff + admin demo for a fictional pizza food-truck business operating 9 lorries across Kelantan, Malaysia. Customers find a lorry, browse the menu, order with pickup; outlet staff manage orders + stock; admin oversees analytics + outlets + products + payment gateways.

## Tech Stack

- **Frontend**: Vanilla HTML5 + CSS3 + JavaScript ES6 (no framework, no build step)
- **Data**: Single `SAMPLE_DATA` global in `assets/js/data.js` as source of truth
- **State**: `localStorage` for cart, current outlet, admin auth, status overrides, override mirrors
- **Fonts**: Google Fonts (Inter) via `@import`
- **Images**: 8 Midjourney v7 photoreal pizza shots in `assets/img/products/`
- **Backend**: ❌ None — fully client-side simulated

## Quick Start

```bash
# Option 1: Double-click index.html

# Option 2: VS Code Live Server (port 5501 by default)
# Right-click index.html → "Open with Live Server"

# Option 3: Any static file server
python -m http.server 8080
# then visit http://localhost:8080
```

## 👤 3 Personas

### 1. Customer (`index.html` → `outlet.html` → `cart.html` → `checkout.html` → `confirmation.html`)
- Landing page: hero + "Find your lorry today" search + Today's Menu + "Where's Pizza Today?" (today-hero with 9 location cards) + collapsible 7-day week drawer + All Our Lorries
- Pick a lorry → outlet page → browse menu by category → add to cart → cart drawer → checkout (Stripe / Billplz / FPX / Cash) → confirmation
- Login modal in header (demo-only stub) with quick-access buttons to dashboards

### 2. Outlet Staff (`outlet-dashboard/`)
- 4-page dashboard: **Main** (KPI overview) / **Orders** (Pending → Preparing → Ready → Picked Up Today → History tabs) / **Products** (Classic/Signature category tabs, real images, per-product stock count) / **Settings** (today's location + hours + crew)
- Login: `outlet@gmail.com` / `admin123` + pick a lorry

### 3. Admin (`admin-dashboard/`)
- 5-page dashboard: **Main** (cross-lorry KPI overview) / **Analytics** (7-day revenue chart + per-outlet performance) / **Outlets** (lorry CRUD + 7-day schedule editor) / **Products** (catalog CRUD + image upload) / **Settings** (brand + 4 payment gateway configs)
- Login: `admin@gmail.com` / `admin123`

## 🎨 Theme

Brand colors (CSS custom properties in `assets/css/global.css`):
- **Primary red**: `#E63946` — buttons, accents, brand
- **Accent yellow**: `#FFD60A` — badges, highlights
- **Hero gradient**: red → yellow diagonal
- **Surface cream**: `#FFFBF5` — soft warm background

Design system: pill buttons, card-with-shadow surfaces, soft borders, focus-visible a11y ring. Modern + warm + Malaysian food-truck vibe.

## 📁 Structure

```
.
├── index.html                  # Customer landing
├── outlet.html                 # Per-lorry ordering page
├── cart.html, checkout.html, confirmation.html
├── admin-dashboard/            # 5 admin pages (main/analytics/outlets/products/settings + login)
├── outlet-dashboard/           # 4 outlet pages (main/orders/products/settings + login)
├── assets/
│   ├── css/                    # global / customer / dashboard (each with mobile sibling)
│   ├── js/                     # data.js, landing.js, outlet.js, cart.js, checkout.js, etc.
│   └── img/products/           # 8 pizza photos
└── README.md
```

CSS architecture: paired desktop + mobile files (`global.css` + `global-mobile.css`, etc.) loaded together. Mobile breakpoint `@media (max-width: 768px)` swaps sidebar → bottom-nav, tables → cards, drawer → bottom-sheet, lorry-grid → carousel.

## 🛣️ Routes & URLs

- `/index.html` — customer landing
- `/outlet.html?id=lorry-1` — per-lorry shareable URL (9 lorry IDs: `lorry-1` through `lorry-9`)
- `/cart.html` — full cart page
- `/checkout.html` — payment form
- `/confirmation.html?id=ZP-2026-...` — order confirmation lookup
- `/admin-dashboard/main.html` — admin home
- `/outlet-dashboard/main.html` — outlet home

## 🔑 Demo Credentials

| Surface | Email | Password |
|---------|-------|----------|
| Admin Dashboard | `admin@gmail.com` | `admin123` |
| Outlet Dashboard | `outlet@gmail.com` | `admin123` (+ pick any lorry) |

Both login pages have click-to-fill demo pills next to the password field. Customer site has demo access buttons in the login modal that skip the dashboard login pages entirely.

## 📍 Lorry Locations (Kelantan)

| Lorry | Brand | Today's Location |
|-------|-------|------------------|
| Lorry 1 | The Cheese Wagon | Pasar Siti Khadijah |
| Lorry 2 | Spice Express | Wakaf Che Yeh |
| Lorry 3 | Veggie Voyager | Stadium Sultan Muhammad IV |
| Lorry 4 | Crust Cruiser | Medan MPKB |
| Lorry 5 | Saucy Roamer | Pengkalan Chepa |
| Lorry 6 | Pantai Pizza | Pantai Irama, Bachok |
| Lorry 7 | Sungai Wagon | Kuala Krai |
| Lorry 8 | Border Bites | Rantau Panjang |
| Lorry 9 | Highland Crust | Gua Musang |

## 🍕 Menu (8 Pizzas)

Classic: Margherita Classic, Pepperoni Pile-Up, Hawaiian Sunset, Quattro Formaggi
Signature: Sambal Chicken Fire, Rendang Royale, Truffle Mushroom Melt, Ayam Percik Pizza

## 📊 Status

**98% feature-complete** (clickable demo). Remaining: real backend wiring, production deployment, optional closed-today lorry illustrations.

## 📝 License

Proprietary — built for TNEX Malaysia Sdn Bhd prospect demonstration.
