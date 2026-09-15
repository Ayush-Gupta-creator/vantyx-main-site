# Custom Admin Dashboard — Setup Guide

This replaces the Decap CMS setup entirely. Do these steps in order.

## 1. Remove the old Decap files

In your GitHub repo, delete `admin/config.yml` — it's not used anymore. Keep the `admin/` folder itself; `admin/index.html` gets replaced with the new branded version below.

## 2. Create a GitHub Personal Access Token

This token lives only on Netlify's servers, never in the browser.

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Give it a name like `vantyx-admin-dashboard`.
3. Under **Repository access**, choose **Only select repositories** and pick your VANTYX repo.
4. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**. Leave everything else as No access.
5. Generate the token and **copy it immediately** — it's shown once.

## 3. Add environment variables in Netlify

Go to **Site configuration → Environment variables** on your Netlify site, and add:

| Key | Value |
|---|---|
| `GITHUB_TOKEN` | the token from step 2 |
| `GITHUB_OWNER` | your GitHub username (e.g. `Ayush-Gupta-creator`) |
| `GITHUB_REPO` | your repo name (confirm the exact name in your repo's GitHub URL) |
| `GITHUB_BRANCH` | `main` (or whatever your default branch is called) |

## 4. Deploy these files

Replace/add the following in your repo, preserving the folder structure exactly:

```
index.html          (replace — hero/testimonials/team are now dynamic)
script.js            (replace)
style.css            (unchanged, but included for completeness)
content/site-content.json   (replace — now includes hero, testimonials, team, contact)
admin/index.html     (replace — this is the new custom dashboard)
netlify/functions/save-content.js    (new)
netlify/functions/upload-image.js    (new)
netlify.toml          (new — tells Netlify where the functions live)
```

Delete `admin/config.yml` if it's still there — no longer needed.

## 5. Verify it works

1. Visit `https://vantyx-studio.netlify.app/admin/` — you should see a dark, gold-branded login screen, not the old generic one.
2. Log in with your existing Netlify Identity account (same one from before — nothing changes there).
3. You should land on a dashboard with tabs: Hero, Pricing, FAQ, Testimonials, Team, Contact.
4. Try editing something small (e.g. a FAQ answer), click **Save & Publish**, and watch for the "Saved ✓" message.
5. Check your GitHub repo's commit history — you should see a new commit like "Update site content via admin dashboard (your@email.com)".
6. Give Netlify about a minute to rebuild, then refresh the live site to confirm the change appears.

## 6. Testing team photo upload

1. Go to the **Team** tab, choose a photo file for a team member.
2. Wait for "Photo uploaded" to appear.
3. Click **Save & Publish**.
4. Check your repo for a new file under `images/uploads/` — confirms the upload function worked.

## If something fails

- **"Not authenticated" error when saving:** your Netlify Identity login expired — log out and back in.
- **"GitHub error" in the save status:** double-check the four environment variables in step 3, especially `GITHUB_REPO` (must match exactly, case-sensitive) and that the token has Contents read/write access to that specific repo.
- **Functions not found (404 on save):** confirm `netlify.toml` deployed correctly and that Netlify's deploy log shows it detected the two functions in `netlify/functions/`.

## What's genuinely secure here, and why

- Your GitHub token never reaches the browser — it lives only in Netlify's environment variables, read only inside the serverless functions.
- Every write request is checked against `context.clientContext.user`, which Netlify populates automatically only when a valid, non-expired Identity JWT is presented — there's no password check written in JavaScript for an attacker to read.
- The dashboard itself has no content until you log in — an unauthenticated visitor can view the login screen but can't reach any editing UI or trigger a save.
