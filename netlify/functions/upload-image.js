// Uploads an image file (sent as base64 from the admin dashboard) into images/uploads/
// in the repo. Same authentication requirement as save-content.js.

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

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const { filename, base64Data } = payload;
  if (!filename || !base64Data) {
    return { statusCode: 400, body: 'Missing filename or base64Data' };
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `images/uploads/${Date.now()}-${safeName}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'vantyx-admin-dashboard',
  };

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Upload image via admin dashboard (${user.email}): ${safeName}`,
      content: base64Data,
      branch,
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    return { statusCode: 502, body: `GitHub error: ${errText}` };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true, path: `/${path}` }) };
};
