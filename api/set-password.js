// api/setpassword.js
export default async function handler(req, res) {
  const targetUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";
  const apiKey = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";

  try {
    // Teruskan request dari frontend ke server Bapenda
    const response = await fetch(
      targetUrl + (req.url.includes("?") ? `?${req.url.split("?")[1]}` : ""),
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          token: apiKey,
          Accept: "application/json",
        },
        body: req.method === "POST" ? JSON.stringify(req.body) : null,
      },
    );

    const data = await response.json();

    // Kirim balik respon dari Bapenda ke Frontend Anda
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ code: "99", message: "Gagal terhubung ke API Bapenda" });
  }
}
