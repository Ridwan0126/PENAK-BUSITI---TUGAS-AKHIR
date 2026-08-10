export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      code: "405",
      message: "Method Not Allowed",
    });
  }

  try {
    const response = await fetch(
      "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      code: "500",
      message: "Internal Server Error",
    });
  }
}
