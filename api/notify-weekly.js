// Cron: ogni lunedì alle 10:00 — Recap settimanale
const ONESIGNAL_APP_ID = '216fe708-f2a2-45f1-b85d-8c5449ce3db3';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

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
  try {
    await sendNotif(
      [{ field: 'tag', key: 'lang', relation: '=', value: 'it' }],
      '📊 Recap settimanale',
      'Inizia una nuova settimana! Controlla le spese della scorsa settimana e imposta i tuoi obiettivi 🎯'
    );
    await sendNotif(
      [{ field: 'tag', key: 'lang', relation: '=', value: 'en' }],
      '📊 Weekly Recap',
      'A new week starts! Check your spending from last week and set your goals 🎯'
    );
    await sendNotif(
      [{ field: 'tag', key: 'lang', relation: 'not_exists' }],
      '📊 Recap settimanale',
      'Inizia una nuova settimana! Controlla le spese della scorsa settimana e imposta i tuoi obiettivi 🎯'
    );
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
