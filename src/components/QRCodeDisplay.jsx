import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer } from "lucide-react";

export default function QRCodeDisplay({ data, skrdNumber }) {
  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>SKRD ${skrdNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .qr-container { text-align: center; }
            h2 { color: #2d3748; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Kode Pembayaran Non Tunai</h2>
            <p style="font-weight: bold; font-size: 18px;">${skrdNumber}</p>
            <img id="qr-image" style="width: 300px; height: 300px;" />
          </div>
          <script>
            const canvas = document.querySelector('canvas');
            const img = document.getElementById('qr-image');
            img.src = canvas.toDataURL('image/png');
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleDownload = () => {
    const element = document.getElementById(`qr-${skrdNumber}`);
    const canvas = element.querySelector("canvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `SKRD-${skrdNumber}-QR.png`;
    link.click();
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex flex-col items-center gap-6">
          {/* QR Code */}
          <div
            id={`qr-${skrdNumber}`}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <QRCodeCanvas
              value={data}
              size={256}
              level="H"
              includeMargin={true}
              fgColor="#1e40af"
              bgColor="#ffffff"
            />
          </div>

          {/* SKRD Number */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Nomor SKRD</p>
            <p className="text-2xl font-bold text-blue-600">{skrdNumber}</p>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg p-4 w-full">
            <h3 className="font-semibold text-gray-800 mb-3">
              Cara Pembayaran:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">
                  1.
                </span>
                <span>
                  Buka aplikasi pembayaran digital (GCash, GoPay, OVO, DANA,
                  etc)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">
                  2.
                </span>
                <span>Pilih fitur Scan QRIS atau Scan QR Code</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">
                  3.
                </span>
                <span>Scan QR Code di atas</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">
                  4.
                </span>
                <span>
                  Lakukan pembayaran sesuai dengan jumlah yang tertera
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">
                  5.
                </span>
                <span>Selesai! Anda akan menerima bukti pembayaran</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full flex-col sm:flex-row">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-smooth active:scale-95"
            >
              <Download className="w-5 h-5" />
              Unduh QR Code
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-smooth active:scale-95"
            >
              <Printer className="w-5 h-5" />
              Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
