// Writes content/site-content.json to GitHub. Requires the caller to be an authenticated
// Netlify Identity user — Netlify populates context.clientContext.user automatically when
// the request includes a valid Identity JWT in the Authorization header.

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return { statusCode: 401, body: 'Not authenticated' };
  }

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return { statusCode: 500, body: 'Server is missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars.' };
  }
  const branch = GITHUB_BRANCH || 'main';
  const path = 'content/site-content.json';

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'vantyx-admin-dashboard',
  };

  // Need the current file's sha to update it (GitHub requires this to avoid overwriting blind).
  let sha;
  try {
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, { headers });
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }
  } catch (e) {
    // If this fails, we'll attempt a create instead — fine for a first-ever write.
  }

  const contentBase64 = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8').toString('base64');

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Update site content via admin dashboard (${user.email})`,
      content: contentBase64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    return { statusCode: 502, body: `GitHub error: ${errText}` };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
