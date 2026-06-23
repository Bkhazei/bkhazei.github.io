# Bahar Khazei — website

A minimal, modern static site for musician **Bahar Khazei**. Plain HTML + CSS +
a little vanilla JavaScript — no build step, no framework. Edit the files and the
site updates.

## Pages

| File             | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `index.html`     | Home / About — hero, biography, quick facts        |
| `projects.html`  | Music & projects, platform links, optional embeds  |
| `events.html`    | Live shows — upcoming / past (toggle tabs)         |
| `contact.html`   | Contact details + contact form                     |

Shared files:

- `css/style.css` — all styling. Colors, fonts and spacing are CSS variables at
  the top (the `:root { ... }` block) so they're easy to change.
- `js/main.js` — mobile menu, the events upcoming/past toggle, and the footer year.
- `assets/` — images. Drop a real photo in here as `portrait.jpg` for the About page.

## Editing

1. Open any `.html` file in a text editor and replace the placeholder text
   (anything in `[brackets]` or that reads like "Project / Release One").
2. Update links: replace `href="#"` with real URLs (Spotify, Instagram, tickets, etc.).
3. Change the look: edit the variables at the top of `css/style.css`, e.g.
   ```css
   --color-accent: #9a6b4f;   /* change to any color */
   --font-display: "Fraunces", serif;
   ```

### Preview locally

Just open `index.html` in a browser. Or, for a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Hosting on GitHub Pages

This repo is named `bkhazei.github.io`, which GitHub serves automatically from the
root of the `main` branch.

1. Commit and push to `main`.
2. On GitHub: **Settings → Pages → Build and deployment**. Set **Source** to
   "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site goes live at **https://bkhazei.github.io** (first deploy can take a
   minute or two).

## Connecting a custom domain

1. Buy a domain from any registrar (Namecheap, Cloudflare, Google Domains, etc.).
2. On GitHub: **Settings → Pages → Custom domain**, enter the domain (e.g.
   `baharkhazei.com`) and save. GitHub will create a `CNAME` file in this repo.
3. At your registrar's DNS settings, add:
   - For an **apex domain** (`baharkhazei.com`): four `A` records pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - For the **www** subdomain: a `CNAME` record pointing to `bkhazei.github.io`.
4. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is ready.

## Notes / decisions

- **No backend.** GitHub Pages is static, so the contact form needs a third-party
  handler to actually send email. Easiest options: [Formspree](https://formspree.io)
  or [Web3Forms](https://web3forms.com) — set the `<form action="...">` in
  `contact.html`. Until then, the `mailto:` links work everywhere.
- Fonts load from Google Fonts (Fraunces + Inter). Swap them in each page's
  `<head>` and in the CSS variables if you prefer different ones.
