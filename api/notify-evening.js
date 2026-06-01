// Cron: ogni sera alle 21:00 IT — Reminder spese
const ONESIGNAL_APP_ID = '216fe708-f2a2-45f1-b85d-8c5449ce3db3';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

const REMINDERS_IT = [
  'Hai registrato le spese di oggi? 📝',
  'Non dimenticare di aggiornare il tuo budget! 💰',
  'Hai tenuto traccia di tutto oggi? 🎯',
  'Un minuto per aggiornare Cyrwall — ne vale la pena! ✅',
  'Le spese di oggi sono registrate? Fallo adesso! 🔔',
  'Aggiorna le tue spese prima di dormire 🌙',
  'Tieni traccia di ogni euro — registra le spese di oggi! 💪',
];

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const day = new Date().getDay();
  const msg = REMINDERS_IT[day % REMINDERS_IT.length];

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['All'],
        headings: { en: '💰 Cyrwall', it: '💰 Cyrwall' },
        contents: { en: msg, it: msg },
        url: 'https://cyrwall.com',
      }),
    });
    const data = await response.json();
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
