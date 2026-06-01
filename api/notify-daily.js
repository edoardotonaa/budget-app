// Cron: ogni mattina alle 9:00 — Sfida del giorno
const ONESIGNAL_APP_ID = '216fe708-f2a2-45f1-b85d-8c5449ce3db3';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

const DAILY_CHALLENGES = [
  { ico: '🍕', title: 'Niente ristoranti oggi' },
  { ico: '☕', title: 'Niente bar oggi' },
  { ico: '🛍️', title: 'Zero acquisti non essenziali' },
  { ico: '🚗', title: 'Spendi meno di €5 in trasporti' },
  { ico: '💸', title: 'Spendi meno di €20 in totale' },
  { ico: '🍔', title: 'Cucina tutti i pasti' },
  { ico: '📱', title: 'Niente abbonamenti oggi' },
  { ico: '🏦', title: 'Risparmia €10 oggi' },
  { ico: '🎯', title: 'Una sola spesa oggi' },
  { ico: '⚡', title: 'Spendi meno di €3 in bollette' },
  { ico: '🎬', title: 'Niente svago a pagamento' },
  { ico: '🛒', title: 'Spesa massimo €15' },
  { ico: '💰', title: 'Registra ogni singola spesa' },
  { ico: '🚶', title: 'Usa solo i piedi oggi' },
  { ico: '🧘', title: 'Giornata da €0 discrezionali' },
];

function getDailyChallenge() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

export default async function handler(req, res) {
  // Verifica cron secret per sicurezza
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ch = getDailyChallenge();

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
        headings: { en: '🎲 Daily Challenge', it: '🎲 Sfida del giorno' },
        contents: { en: `${ch.ico} ${ch.title}`, it: `${ch.ico} ${ch.title}` },
        url: 'https://cyrwall.com',
      }),
    });
    const data = await response.json();
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
