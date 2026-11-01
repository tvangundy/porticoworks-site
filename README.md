# Portico Works website

Static site for [porticoworks.dev](https://porticoworks.dev)—the studio home for Portico Works—served from the edge public cluster (`task public:deploy-studio` in **portico-public**). `www.porticoworks.dev` redirects to the apex.

The essay on why home data matters lives at [porticonow.com](https://porticonow.com). The product experience lives at [web.porticoworks.dev](https://web.porticoworks.dev).

## Update the site

- Edit page wording and links in `index.html` (and `privacy.html` for the Play Store privacy URL).
- Account / data deletion pages: `delete-me.html`, `delete-my-data.html` (also live at `delete-me.porticoworks.dev` / `delete-my-data.porticoworks.dev` on the public cluster).
- Edit colors and layout in `styles.css` (brand greens/cyans match `logo.png`).
- Brand mark: `logo.png` (header, hero, product card). Tab icons: `favicon-16.png`, `favicon-32.png`, `favicon.png`, `apple-touch-icon.png`.
- Contact address: `hello@porticoworks.dev` (change in HTML files if needed).
- Privacy policy (required for Google Play): [https://porticoworks.dev/privacy](https://porticoworks.dev/privacy).
- Invite deep links (Portico Mobile Camera → app): `.well-known/apple-app-site-association` and `.well-known/assetlinks.json` — keep in sync with **ws-website** / **porticonow-site**.

No build tools or dependencies. Preview with `task preview` (http://localhost:4323). Override the port with `task preview PORT=8080`.

## Publish on the cluster

From **portico-public**, context `edge-public-cluster`:

```bash
STUDIO_PUBLISH=1 task public:deploy-studio
```

That builds this directory as `ghcr.io/tvangundy/porticoworks-site:latest` and applies the `studio` HTTPRoute. TLS is the cluster wildcard certificate (`porticoworks.dev` and `*.porticoworks.dev`). DNS is a proxied Cloudflare A record for `@` and `www` at the edge floating IP (`task portico:dns-apply` in **portico-edge** prod).

GitHub Pages is no longer the origin. The `CNAME` file can stay so a Pages build does not drop the repo's domain note; public DNS must not point at `185.199.108.153` or `tvangundy.github.io`.

## Cloudflare DNS for delete-me / delete-my-data

The zone's nameservers are Cloudflare, so records added at GoDaddy have no effect. These hosts are served by the **edge public cluster** website (same origin as `web`), not GitHub Pages. They are managed by **portico-edge** `PORTICO_DNS_APPLY_CONFIRM=yes task portico:dns-apply` (prod stage), or by hand as proxied **A** records:

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| A | delete-me | 5.161.19.132 | Proxied |
| A | delete-my-data | 5.161.19.132 | Proxied |

(Origin is `workspace.control_plane_ip` in portico-edge `contexts/prod/values.yaml`.) TLS is covered by `*.porticoworks.dev` on the cluster. After DNS and `task public:deploy-website` (with a published image that includes the legal pages), open:

- https://delete-me.porticoworks.dev/
- https://delete-my-data.porticoworks.dev/

Path mirrors on this GitHub Pages site: `/delete-me.html`, `/delete-my-data.html`.

Product hostnames such as `web.porticoworks.dev` are the same Hetzner VIP pattern—not the GitHub Pages IPs above.
