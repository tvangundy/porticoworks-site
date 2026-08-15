# Portico Works website

Static site for [porticoworks.dev](https://porticoworks.dev)—the studio home for Portico Works—hosted with GitHub Pages.

The product experience lives at [web.porticoworks.dev](https://web.porticoworks.dev).

## Update the site

- Edit page wording and links in `index.html` (and `privacy.html` for the Play Store privacy URL).
- Edit colors and layout in `styles.css` (brand greens/cyans match `logo.png`).
- Brand mark: `logo.png` (header, hero, product card). Tab icons: `favicon-16.png`, `favicon-32.png`, `favicon.png`, `apple-touch-icon.png`.
- Contact address: `hello@porticoworks.dev` (change in `index.html` / `privacy.html` if needed).
- Privacy policy (required for Google Play): [https://porticoworks.dev/privacy](https://porticoworks.dev/privacy).

No build tools or dependencies. Open `index.html` in a browser to preview.

## Publish on GitHub Pages

1. Repository: `tvangundy/porticoworks-site`, branch `main`.
2. **Settings → Pages** → Deploy from a branch → `main` / `/(root)`.
3. **Custom domain:** `porticoworks.dev` (keep the `CNAME` file in the repo).
4. After DNS is healthy, enable **Enforce HTTPS**.

## GoDaddy DNS for porticoworks.dev

In GoDaddy: **My Products → Domains → porticoworks.dev → DNS**. Remove domain-forwarding and conflicting `@` / `www` A or CNAME records, then add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | tvangundy.github.io | 1 hour |

Do not add a wildcard (`*`) record. Leave MX and TXT (email) alone. Propagation can take up to 24 hours.

Product hostnames such as `web.porticoworks.dev` are separate A records (Hetzner / cluster VIP)—not these GitHub Pages IPs.
