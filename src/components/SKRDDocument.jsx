import { useState } from "react";
import { X, Download, Printer, Plus, Eye, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function SKRDPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [skrdData, setSkrdData] = useState({
    uppd: "UPPD Kabupaten Banyumas",
    kode: "3341028001374301",
    kota: "BANYUMAS",

    skrdNumber: "05.28.00.02.21.02.25.12.09687",
    tanggal: "20 Juni 2025",

    wajibNama: "SARYONO SARNO",
    wajibAlamat:
      "JL CENDRAWASIH RT 004/RW 008 GRENDENG, PURWOKERTO UTARA, BANYUMAS",

    obyekRetribusi: "Fotocopy Samsat Purwokerto 1",
    lokasi: "Jl. Prof M. Yamin No 7",
    satuan: "per bulan",

    jenisRetribusi:
      "Retribusi Penyediaan Tempat Kegiatan Usaha berupa Pasar, Grosir, Pertokoan, dan Tempat Kegiatan Usaha Lainnya",

    masaAwal: "01 Juni 2025",
    masaAkhir: "30 Juni 2025",

    volume: "1 per bulan",

    retribusi: 650000,

    jatuhTempo: "04 Juli 2025",

    kepalaUPPD: "ATY UJIATI, SH, M.Si",

    nip: "196709221989032006",

    paymentLink: "https://qris.id/payment/SKRD-0001",
  });

  const handleChange = (e) => {
    setSkrdData({
      ...skrdData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("skrd-document");

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 5,
      filename: `SKRD-${skrdData.skrdNumber}.pdf`,
      image: {
        type: "jpeg",
        quality: 1,
      },
      html2canvas: {
        scale: 3,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    const printContents = document.getElementById("skrd-document").innerHTML;

    const printWindow = window.open("", "", "width=900,height=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>SKRD</title>

          <style>
            body{
              font-family:'Times New Roman';
              padding:20px;
              color:black;
            }

            table{
              width:100%;
            }

            @media print{
              body{
                margin:0;
              }
            }
          </style>
        </head>

        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">
              Surat Ketetapan Retribusi Daerah (SKRD)
            </h1>

            <p className="text-gray-600 mt-2">
              Kelola dokumen SKRD dan transaksi pembayaran
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 flex items-center gap-2"
          >
            <Plus size={18} />
            Buat SKRD
          </button>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white border mt-6 p-6 flex justify-between items-center">
        <div>
          <div className="flex gap-3 items-center">
            <h2 className="font-bold text-2xl">{skrdData.skrdNumber}</h2>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Terbit
            </span>
          </div>

          <p className="mt-2 text-gray-700">
            SKRD untuk obyek retribusi {skrdData.obyekRetribusi}
          </p>

          <div className="grid grid-cols-3 gap-10 mt-6">
            <div>
              <p className="text-sm text-gray-500">Periode</p>

              <p className="font-semibold">
                {skrdData.masaAwal} - {skrdData.masaAkhir}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Bayar</p>

              <p className="font-semibold">
                Rp {Number(skrdData.retribusi).toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Jatuh Tempo</p>

              <p className="font-semibold">{skrdData.jatuhTempo}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPreview(true)}
          className="bg-blue-600 text-white px-5 py-3 flex items-center gap-2"
        >
          <Eye size={18} />
          Lihat
        </button>
      </div>

      {/* MODAL CREATE */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white w-full max-w-5xl p-8 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-3xl font-bold mb-8">Form Buat SKRD</h2>

            <div className="grid grid-cols-2 gap-5">
              {Object.keys(skrdData).map((key) => (
                <div key={key}>
                  <label className="block mb-2 font-semibold capitalize">
                    {key}
                  </label>

                  <input
                    type="text"
                    name={key}
                    value={skrdData[key]}
                    onChange={handleChange}
                    className="w-full border p-3"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="border px-5 py-3"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowPreview(true);
                }}
                className="bg-blue-600 text-white px-5 py-3"
              >
                Simpan & Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 z-50 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* ACTION */}
            <div className="flex justify-end gap-3 mb-5">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-5 py-3 flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>

              <button
                onClick={handlePrint}
                className="bg-gray-700 text-white px-5 py-3 flex items-center gap-2"
              >
                <Printer size={18} />
                Print
              </button>

              <button
                onClick={() => setShowPreview(false)}
                className="bg-red-600 text-white px-5 py-3"
              >
                Tutup
              </button>
            </div>

            {/* DOCUMENT */}
            <div
              id="skrd-document"
              className="bg-white mx-auto"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "25mm",
                fontFamily: "Times New Roman",
                color: "black",
                lineHeight: "1.5",
              }}
            >
              {/* HEADER */}
              <div className="text-center border-b pb-4">
                <h1 className="font-bold text-[18px]">
                  PEMERINTAH PROVINSI JAWA TENGAH
                </h1>

                <h2 className="font-bold text-[16px]">
                  BADAN PENGELOLA PENDAPATAN DAERAH
                </h2>

                <p>{skrdData.uppd}</p>

                <p>{skrdData.kode}</p>

                <h2 className="font-bold text-[22px] mt-4">
                  SURAT KETETAPAN RETRIBUSI DAERAH (SKRD)
                </h2>
              </div>

              {/* NOMOR */}
              <div className="mt-5">
                <p>Nomor : {skrdData.skrdNumber}</p>

                <p>Tanggal : {skrdData.tanggal}</p>
              </div>

              {/* I */}
              <div className="mt-6">
                <p className="font-bold">I. WAJIB RETRIBUSI</p>

                <div className="ml-6 mt-2 space-y-2">
                  <p>1. Nama : {skrdData.wajibNama}</p>

                  <p>2. Alamat : {skrdData.wajibAlamat}</p>
                </div>
              </div>

              {/* II */}
              <div className="mt-6">
                <p className="font-bold">II. OBYEK RETRIBUSI</p>

                <div className="ml-6 mt-2 space-y-2">
                  <p>1. Obyek Retribusi : {skrdData.obyekRetribusi}</p>

                  <p>2. Lokasi : {skrdData.lokasi}</p>

                  <p>3. Satuan : {skrdData.satuan}</p>

                  <p>4. Jenis Retribusi : {skrdData.jenisRetribusi}</p>
                </div>
              </div>

              {/* III */}
              <div className="mt-6">
                <p className="font-bold">III. KETETAPAN RETRIBUSI</p>

                <div className="ml-6 mt-2 space-y-2">
                  <p>
                    1. Masa Retribusi : {skrdData.masaAwal} -{" "}
                    {skrdData.masaAkhir}
                  </p>

                  <p>2. Volume : {skrdData.volume}</p>

                  <p>
                    3. Retribusi terhutang : Rp{" "}
                    {Number(skrdData.retribusi).toLocaleString("id-ID")}
                  </p>

                  <p>4. Jatuh Tempo Pembayaran : {skrdData.jatuhTempo}</p>
                </div>
              </div>

              {/* IV */}
              <div className="mt-6">
                <p className="font-bold">IV. PEMBAYARAN</p>

                <div className="ml-6 mt-2 text-justify space-y-3">
                  <p>
                    1. Pembayaran dilakukan pada rekening Kas Umum Daerah
                    melalui Bendahara Penerimaan dan/atau Bendahara Penerimaan
                    Pembantu pada OPD yang melakukan pemungutan Retribusi
                    Daerah.
                  </p>

                  <p>
                    2. Jatuh tempo pembayaran adalah 15 (lima belas) hari sejak
                    SKRD diterbitkan.
                  </p>

                  <p>
                    3. Keterlambatan pembayaran dapat dikenakan sanksi
                    administratif berupa bunga sebesar 1% per bulan.
                  </p>
                </div>
              </div>

              {/* QR & TTD */}
              <div className="mt-10 flex justify-between items-end">
                <div>
                  <p>( Link Pembayaran )</p>

                  <div className="mt-3 border p-3 inline-block">
                    <QRCodeCanvas value={skrdData.paymentLink} size={120} />
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <QrCode size={16} />
                    Pembayaran Non Tunai
                  </div>
                </div>

                <div className="text-center">
                  <p>
                    {skrdData.kota}, {skrdData.tanggal}
                  </p>

                  <p className="font-bold mt-2">KEPALA UPPD</p>

                  <div className="h-24"></div>

                  <p className="font-bold underline">{skrdData.kepalaUPPD}</p>

                  <p>NIP. {skrdData.nip}</p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-12 text-sm">
                <p>Lembar 1 : Wajib Retribusi</p>

                <p>Lembar 2 : Seksi/Petugas yang menangani Retribusi</p>

                <p>Lembar 3 : Arsip Unit Kerja</p>

                <p className="mt-4">Informasi : 08123123123</p>

                <div className="mt-8 text-right text-xs">
                  dicetak oleh : SUPERADMIN pada : 11-05-2026 / 10:53:58
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
