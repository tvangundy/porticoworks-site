# Portico Works website

A simple static site for [porticoworks.dev](https://porticoworks.dev), hosted with GitHub Pages.

## Update the site

- Edit page wording and links in `index.html`.
- Edit colors and layout in `styles.css`.
- The contact address is currently `hello@porticoworks.dev`; replace it in `index.html` if another address should be used.

No build tools or dependencies are required. Open `index.html` in a browser to preview changes.

## Publish on GitHub Pages

1. Create a public repository named `porticoworks-site` in the `tvangundy` GitHub account.
2. Add these files to the repository's `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/(root)`, then save.
6. Under **Custom domain**, enter `porticoworks.dev` and save. Keep the included `CNAME` file in the repository.
7. After the DNS records below are active and GitHub offers the option, enable **Enforce HTTPS**.

## GoDaddy DNS for porticoworks.dev

In GoDaddy, open **My Products → Domains → porticoworks.dev → DNS**. Remove any existing domain-forwarding rule and any conflicting `A` or `CNAME` records for `@` or `www`, then add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | tvangundy.github.io | 1 hour |

Do not add a wildcard (`*`) record. DNS changes can take up to 24 hours to propagate. Keep unrelated records—especially MX and TXT records used for email—unchanged.

## Suggested first publication

After signing in to GitHub from this computer, the repository can be created and published with GitHub Desktop or GitHub's website. The files are intentionally plain HTML and CSS so publishing from the `main` branch is all that is needed.
