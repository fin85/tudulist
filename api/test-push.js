const webpush = require('web-push');

const PUBLIC_KEY = 'BJufjcw108ZxDOiuHbrHgUioNEXQ3ZDANiLfkGDtfxAwt1uK9m3qB0F43qWEVlGul6AXXir-pUUwNFG5Of0SaQo';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!privateKey) {
    return res.status(500).json({ ok: false, error: 'VAPID_PRIVATE_KEY is not configured' });
  }

  const subscription = req.body && req.body.subscription;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ ok: false, error: 'Push subscription is required' });
  }

  try {
    webpush.setVapidDetails('mailto:tudulist@example.com', PUBLIC_KEY, privateKey);
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'ТудуЛист',
        body: 'Тестовый push работает 🎉',
        url: '/'
      })
    );
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'Push send failed',
      statusCode: error.statusCode || null
    });
  }
};
