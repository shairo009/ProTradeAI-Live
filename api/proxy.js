export default async function handler(req, res) {
  const { symbol, interval, limit = 100 } = req.query;

  if (!symbol || !interval) {
    return res.status(400).json({ error: 'Missing symbol or interval' });
  }

  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Binance API error' });
    }

    const data = await response.json();

    // Transform to same format as original: {t, o, h, l, c, v}
    const candles = data.map(k => ({
      t: +k[0],
      o: +k[1],
      h: +k[2],
      l: +k[3],
      c: +k[4],
      v: +k[5]
    }));

    return res.status(200).json(candles);
  } catch (error) {
    return res.status(500).json({ error: 'Proxy error' });
  }
}