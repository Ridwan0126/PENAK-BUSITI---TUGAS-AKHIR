// File: api/proxy-bapenda.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const targetUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/lupa-password";

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        // Kita "memalsukan" header agar WAF Bapenda mengira request berasal dari internal mereka
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghubungi server tujuan" });
  }
}
