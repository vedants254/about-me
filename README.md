# about-me

Personal site for Vedant Shelkar — a single-page, dependency-free static site.
No build step, no framework, no `package.json`.

## Structure

```
index.html          the whole site (header, about, work, projects, skills, extra, education)
404.html            not-found page, served automatically by Vercel
favicon.svg         monogram favicon
css/style.css       base layer
css/clean.css       type-system + density layer, loaded after style.css
js/main.js          canvas backdrop, dock nav + scrollspy, ⌘K palette, filters, disclosure
img/logos/          organisation marks used in the work timeline
me.jpeg             header photo
vercel.json         cache + security headers
work.html  projects.html  stack.html  extracurriculars.html  contact.html
                    redirect stubs kept so previously shared links still resolve
                    (each one bounces to index.html#<section>)
```

## Deploying on Vercel

The repo needs no configuration in the Vercel dashboard — it is detected as a
static site and served from the repository root.

1. Go to [vercel.com/new](https://vercel.com/new) and import `vedants254/about-me`.
2. Leave every build setting untouched:
   - **Framework Preset:** Other
   - **Build Command:** empty
   - **Output Directory:** empty (serves the repo root)
   - **Install Command:** empty
3. Click **Deploy**.

Every push to `main` then redeploys automatically, and pull requests get their own
preview URL.

### Custom domain

The site is set up for **vedantshelkar.space** — `canonical`, `og:url`,
`og:image`, `robots.txt` and `sitemap.xml` all point there already.

To attach it: Vercel project → **Settings → Domains → Add** `vedantshelkar.space`,
then set the DNS records Vercel shows you at your registrar:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Vercel issues the TLS certificate automatically once DNS resolves. Verify the
exact values in the dashboard — Vercel occasionally changes the apex IP.

If the domain ever changes, update those five references (three `<meta>`/`<link>`
tags in `index.html`, plus `robots.txt` and `sitemap.xml`).

## Local preview

Open `index.html` directly in a browser, or serve the folder to get
absolute-path behaviour identical to production:

```bash
npx serve .
# or
python -m http.server 8000
```

## Cache busting

`css/*` and `js/*` are served with a one-year immutable cache, so they are
versioned by query string in `index.html`:

```html
<link rel="stylesheet" href="css/style.css?v=25" />
<script src="js/main.js?v=25"></script>
```

**Bump `?v=` on every CSS or JS change**, or returning visitors keep the old file.
