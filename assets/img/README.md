# Image Assets

Three SVG placeholders ship with the demo:

| File | Purpose |
|------|---------|
| `logo.svg` | Brand logo - red/yellow gradient pizza slice on cream background |
| `lorry.svg` | Generic food-truck illustration in brand colors |
| `placeholder-product.svg` | 400x240 product card placeholder (red/yellow soft gradient + emoji + brand line) |

Per-product images referenced in `assets/js/data.js` (e.g. `assets/img/products/margherita.jpg`) intentionally do not exist - the demo uses CSS gradient fallbacks via `background: linear-gradient(135deg, var(--color-primary-soft), var(--color-accent-soft));` on `.menu-item-image` and `.cart-item-thumb` so missing images degrade gracefully.

To replace with real photos: drop matching JPGs into `assets/img/products/` using the filenames in data.js. No code changes required.
