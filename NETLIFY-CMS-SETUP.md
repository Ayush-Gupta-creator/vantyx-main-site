# Setting Up Your Admin Dashboard (Real Security, Not a Fake Lock)

## Why this isn't "just add a password box"

Your site is static HTML/CSS/JS with no server. Any password check written in `script.js` would be visible to anyone who opens their browser's dev tools and reads the file — it's not a real lock, just a curtain. Since "Ayush" is already publicly shown on your Team section, that specific word would be an especially bad choice for a fake client-side password.

What you're actually getting instead: a **real login system** (Netlify Identity) where a password is checked by Netlify's own servers, properly hashed and secured — the same category of auth system real companies use, not something hand-rolled in JavaScript. When you log in successfully, edits you make get saved directly into your site's code and published automatically.

---

## Step 1 — Enable Identity on your Netlify site

1. Log into [app.netlify.com](https://app.netlify.com) and open your `vantyx-studio` site.
2. Go to **Site configuration → Identity** → click **Enable Identity**.
3. Under **Registration preferences**, set it to **Invite only** (so random people can't sign themselves up).

## Step 2 — Enable Git Gateway

1. Still under Identity settings, scroll to **Services → Git Gateway** → click **Enable Git Gateway**.
2. This lets the admin dashboard commit content changes directly to your site's repository without you needing a separate GitHub login.

## Step 3 — Invite yourself

1. Go to the **Identity** tab in your Netlify dashboard → **Invite users**.
2. Enter your own email address.
3. You'll get an email with a link — click it, and you'll be prompted to **set a real password**. Use a proper one here (a passphrase like `three-random-words-42!` is both stronger and easier to remember than a short word+number combo). This password lives in Netlify's system, not in any file on your site.

## Step 4 — Deploy these files

Add the following to your site's repository (same place `index.html`, `style.css`, and `script.js` already live), then push/deploy as normal:

```
/admin/index.html
/admin/config.yml
/content/site-content.json
```

Also replace your existing `index.html` and `script.js` with the updated versions from this conversation — they've been changed to load pricing and FAQ content from `content/site-content.json` instead of having it hardcoded.

## Step 5 — Log in and edit

1. Visit `https://vantyx-studio.netlify.app/admin/`.
2. Log in with the email + password from Step 3.
3. You'll see two editable sections: **FAQ** (add/edit/remove questions) and **Pricing** (edit any vertical's tier volumes, prices, subtext, or features).
4. Click **Publish** after editing — this commits the change to your site's code. Netlify automatically rebuilds and redeploys, usually live within a minute or two.

---

## What this does and doesn't cover

- **Covers:** pricing tiers and FAQ content, since those are what you've been actively editing this conversation.
- **Doesn't yet cover:** hero text, testimonials, team bios, WhatsApp number, etc. — these are still hardcoded in `index.html`. The same pattern (move it into `site-content.json`, add a field in `config.yml`) extends to any of these if you want them editable too — happy to add more fields following this same approach.
- **The FAQ's SEO metadata** (the `FAQPage` structured data block in `index.html`'s `<head>`) is separate and stays static — search engines read that one, and keeping it in perfect sync with your live-edited FAQ would need a build step this simple setup doesn't have. Worth manually updating it occasionally if your FAQ changes significantly.

## On the password, one more time

Netlify will ask you to set your real password directly — I'd genuinely encourage against using "Ayush" for it, precisely because it's already public on your own site. This is your call to make, but it's the one part of this whole setup where a weak choice would matter.
