const GAS_URL = 'https://script.google.com/macros/s/AKfycbzH2z96CgX1m4SQo8tD6nLPMo78mwvEd_JypngRnvPEslNunI52mJgZRlxl8AUmbZ1e/exec';

module.exports = async function handler(req, res) {
  try {
    let upstream;

    if (req.method === 'GET') {
      const url = new URL(GAS_URL);
      url.searchParams.set('action', 'list');
      url.searchParams.set('_', Date.now().toString());
      upstream = await fetch(url.toString(), { redirect: 'follow' });
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      upstream = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
        redirect: 'follow'
      });
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const text = await upstream.text();
    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: `Apps Script HTTP ${upstream.status}`, details: text.slice(0, 300) });
    }

    try {
      const data = JSON.parse(text);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(data);
    } catch (_) {
      return res.status(502).json({ ok: false, error: 'Apps Script returned non-JSON response', details: text.slice(0, 300) });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Proxy error' });
  }
};
