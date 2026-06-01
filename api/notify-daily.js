// Cron: ogni mattina alle 9:00 — Sfida del giorno
const ONESIGNAL_APP_ID = '216fe708-f2a2-45f1-b85d-8c5449ce3db3';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

const DAILY_IT = [
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

const DAILY_EN = [
  { ico: '🍕', title: 'No restaurants today' },
  { ico: '☕', title: 'No café today' },
  { ico: '🛍️', title: 'Zero non-essential purchases' },
  { ico: '🚗', title: 'Spend less than €5 on transport' },
  { ico: '💸', title: 'Spend less than €20 total' },
  { ico: '🍔', title: 'Cook every meal today' },
  { ico: '📱', title: 'No new subscriptions today' },
  { ico: '🏦', title: 'Save €10 today' },
  { ico: '🎯', title: 'Only one expense today' },
  { ico: '⚡', title: 'Spend less than €3 on bills' },
  { ico: '🎬', title: 'No paid entertainment today' },
  { ico: '🛒', title: 'Grocery max €15' },
  { ico: '💰', title: 'Record every single expense' },
  { ico: '🚶', title: 'On foot only today' },
  { ico: '🧘', title: 'Zero discretionary spending' },
];

function getDailyChallenge(arr) {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return arr[dayOfYear % arr.length];
}

async function sendNotif(segment, heading, content) {
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
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
  return response.json();
}

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const chIT = getDailyChallenge(DAILY_IT);
    const chEN = getDailyChallenge(DAILY_EN);
    // Italian users
    await sendNotif(
      [{ field: 'tag', key: 'lang', relation: '=', value: 'it' }],
      '🎲 Sfida del giorno',
      `${chIT.ico} ${chIT.title}`
    );
    // English users
    await sendNotif(
      [{ field: 'tag', key: 'lang', relation: '=', value: 'en' }],
      '🎲 Daily Challenge',
      `${chEN.ico} ${chEN.title}`
    );
    // Users without tag (default Italian)
    await sendNotif(
      [{ field: 'tag', key: 'lang', relation: 'not_exists' }],
      '🎲 Sfida del giorno',
      `${chIT.ico} ${chIT.title}`
    );
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
