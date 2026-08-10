// api/bapenda.js
export default async function handler(req, res) {
  // Menentukan URL tujuan (mengganti /api/bapenda dengan path asli API)
  const targetPath = req.url.replace("/api/bapenda", "/penatausahaan/api");
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id${targetPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        token: process.env.TOKEN_API || "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: ["POST", "PUT"].includes(req.method)
        ? JSON.stringify(req.body)
        : null,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ code: "99", message: "Proxy Error: " + error.message });
  }
}
