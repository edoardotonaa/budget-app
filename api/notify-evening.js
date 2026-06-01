// Cron: ogni sera alle 21:00 — Reminder spese
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

const REMINDERS_EN = [
  'Did you log today\'s expenses? 📝',
  'Don\'t forget to update your budget! 💰',
  'Did you track everything today? 🎯',
  'One minute to update Cyrwall — worth it! ✅',
  'Have you logged today\'s expenses? Do it now! 🔔',
  'Update your expenses before bed 🌙',
  'Track every euro — log today\'s expenses! 💪',
];

async function sendNotif(segment, heading, content) {
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${ONESIGNAL_REST_KEY}`,
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      filters: segment,
      headings: { en: heading, it: heading },
      contents: { en: content, it: content },
      url: 'https://cyrwall.com',
    }),
  });
}

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const day = new Date().getDay();
  const msgIT = REMINDERS_IT[day % REMINDERS_IT.length];
  const msgEN = REMINDERS_EN[day % REMINDERS_EN.length];
  try {
    await sendNotif([{ field: 'tag', key: 'lang', relation: '=', value: 'it' }], '💰 Cyrwall', msgIT);
    await sendNotif([{ field: 'tag', key: 'lang', relation: '=', value: 'en' }], '💰 Cyrwall', msgEN);
    await sendNotif([{ field: 'tag', key: 'lang', relation: 'not_exists' }], '💰 Cyrwall', msgIT);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
