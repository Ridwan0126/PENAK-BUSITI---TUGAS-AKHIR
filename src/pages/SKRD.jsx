import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Swal from "sweetalert2";

const GlassSelect = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [value]);

  const selectedLabel =
    options.find((opt) =>
      typeof opt === "object" ? opt.value === value : opt === value,
    )?.label || value;

  return (
    <div className="relative w-full">
      <div onClick={() => setOpen(!open)} className="glass-select">
        <span>{selectedLabel}</span>
        <ChevronDown size={16} />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="glass-dropdown">
            {options.map((opt, index) => {
              const optValue = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;

              return (
                <div
                  key={index}
                  onClick={() => {
                    onChange(optValue);
                    setOpen(false);
                  }}
                  className={`glass-option ${
                    value === optValue ? "active" : ""
                  }`}
                >
                  {optLabel}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* ----------------------------- DUMMY DATA DESEMBER 2025 ------------------------------ */
const DUMMY_SKRD_DEC_2025 = [
  {
    no_penetapan: "SKRD/2025/12/001",
    nama_wr: "Budi Santoso",
    tanggal: "2025-12-05",
    tbp: { no_tbp: "TBP/001" }, // Sudah Bayar (Lunas)
    jatuh_tempo: "2025-12-20",
    masa_dari: "2025-12-01",
    masa_sampai: "2025-12-31",
    ketetapan: 250000,
    volume: 1,
    nama_obyek: "Retribusi Tempat Rekreasi & Olahraga",
    alamat_obyek: "Jl. Pemuda No. 10, Kudus",
    wr: { nama: "Budi Santoso", alamat: "Jl. Melati No. 5, Kudus", nik_npwp: "3319012345670001" }
  },
  {
    no_penetapan: "SKRD/2025/12/002",
    nama_wr: "Siti Aminah",
    tanggal: "2025-12-10",
    tbp: { no_tbp: "TBP/002" }, // Sudah Bayar (Lunas)
    jatuh_tempo: "2025-12-25",
    masa_dari: "2025-12-01",
    masa_sampai: "2025-12-31",
    ketetapan: 150000,
    volume: 1,
    nama_obyek: "Retribusi Parkir Kendaraan Khusus",
    alamat_obyek: "Kawasan Wisata Colo, Kudus",
    wr: { nama: "Siti Aminah", alamat: "Jl. Ahmad Yani No. 12, Kudus", nik_npwp: "3319012345670002" }
  },
  {
    no_penetapan: "SKRD/2025/12/003",
    nama_wr: "CV. Makmur Jaya",
    tanggal: "2025-12-12",
    tbp: { no_tbp: "TBP/003" }, // Sudah Bayar (Lunas)
    jatuh_tempo: "2025-12-27",
    masa_dari: "2025-12-01",
    masa_sampai: "2025-12-31",
    ketetapan: 500000,
    volume: 5,
    nama_obyek: "Penyediaan Fasilitas Umum Daerah",
    alamat_obyek: "Jl. Lingkar Selatan, Kudus",
    wr: { nama: "CV. Makmur Jaya", alamat: "Jl. Diponegoro No. 45, Kudus", nik_npwp: "3319012345670003" }
  },
  {
    no_penetapan: "SKRD/2025/12/004",
    nama_wr: "Ahmad Fauzi",
    tanggal: "2025-12-15",
    tbp: null, // Belum Bayar
    jatuh_tempo: "2025-12-30",
    masa_dari: "2025-12-01",
    masa_sampai: "2025-12-31",
    ketetapan: 300000,
    volume: 2,
    nama_obyek: "Retribusi Penggunaan Kekayaan Daerah",
    alamat_obyek: "Gedung Wanita Kudus",
    wr: { nama: "Ahmad Fauzi", alamat: "Jl. Sunan Kudus No. 8, Kudus", nik_npwp: "3319012345670004" }
  },
  {
    no_penetapan: "SKRD/2025/12/005",
    nama_wr: "Dewi Lestari",
    tanggal: "2025-12-18",
    tbp: null, // Belum Bayar
    jatuh_tempo: "2026-01-02",
    masa_dari: "2025-12-01",
    masa_sampai: "2025-12-31",
    ketetapan: 175000,
    volume: 1,
    nama_obyek: "Retribusi Rumah Potong Hewan",
    alamat_obyek: "Kompleks RPH Kudus",
    wr: { nama: "Dewi Lestari", alamat: "Jl. Kartini No. 22, Kudus", nik_npwp: "3319012345670005" }
  }
];

export default function SKRD() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // Tambahkan di dalam komponen SKRD
  const [dataList, setDataList] = useState([]); // List hasil pencarian
  const [selectedItem, setSelectedItem] = useState(null); // Item yang sedang dibuka detailnya
  const [filter, setFilter] = useState("semua"); // "semua", "bayar", "belum"

  const filteredData = dataList.filter((item) => {
    // Jika item.tbp ada datanya, maka sudah bayar
    const isPaid = item.tbp !== null && item.tbp !== undefined;

    if (filter === "bayar") return isPaid === true;
    if (filter === "belum") return isPaid === false;
    return true;
  });

  const [searchForm, setSearchForm] = useState({
    tahun: 2025,
    bulan: 12,
  });

  const [formData, setFormData] = useState({});

  // SESSION LOGIN
  const session =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wr_session")) || {}
      : {};

  const loginUser = session?.user?.nama || "SUPERADMIN";

  // FORMAT CETAK
  const printDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

  // VALIDASI FORMAT
  // const validateIdObyek = (value) => {
  //   const regex = /^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d\.\d{5}\.\d{2}$/;
  //   return regex.test(value);
  // };

  // AUTO FORMAT
  // const autoFormat = (value) => {
  //   const clean = value.replace(/\D/g, "").slice(0, 18);

  //   const parts = [
  //     clean.slice(0, 2),
  //     clean.slice(2, 4),
  //     clean.slice(4, 6),
  //     clean.slice(6, 8),
  //     clean.slice(8, 9),
  //     clean.slice(9, 14),
  //     clean.slice(14, 16),
  //   ];

  //   return parts.filter(Boolean).join(".");
  // };

  // FORMAT TANGGAL
  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  // FORMAT RUPIAH
  const rupiah = (val) => Number(val || 0).toLocaleString("id-ID");

  // API
  const handleSearchAPI = async () => {
    const { tahun, bulan } = searchForm;
    const id_wr = session?.user?.id;

    setLoading(true);
    try {
      // GANTI URL DI BAWAH INI DENGAN URL API YANG SESUAI
      const res = await fetch(
        `/bapenda/pepakraja/skrd?id_wr=${id_wr}&tahun=${tahun}&bulan=${bulan}`,
        {
          method: "GET",
          headers: {
            token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
            Accept: "application/json",
          },
        },
      );

      const result = await res.json();

      if (result.code === "00" && result.data && result.data.length > 0) {
        setDataList(result.data);
      } else {
        if (Number(tahun) === 2025 && Number(bulan) === 12) {
          setDataList(DUMMY_SKRD_DEC_2025);
          Swal.fire("Informasi", "Menggunakan data dummy Desember 2025 (Data API kosong)", "info");
        } else {
          Swal.fire("Tidak ditemukan", "Data SKRD tidak ditemukan", "warning");
          setDataList([]);
        }
      }
    } catch (error) {
      console.error(error);
      if (Number(searchForm.tahun) === 2025 && Number(searchForm.bulan) === 12) {
        setDataList(DUMMY_SKRD_DEC_2025);
        Swal.fire("Informasi", "Server tidak dijangkau, menampilkan data dummy Desember 2025", "info");
      } else {
        Swal.fire("Error", "Gagal mengambil data dari server", "error");
        setDataList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Muat data dummy otomatis saat pertama kali komponen dirender untuk bulan Desember 2025
  useEffect(() => {
    setDataList(DUMMY_SKRD_DEC_2025);
  }, []);

  // PRINT
  // const handlePrint = () => {
  //   window.print();
  // };
  // Tambahkan fungsi ini
  const openDetail = (item) => {
    const pejabat = item.json_pejabat ? JSON.parse(item.json_pejabat) : {};

    setFormData({
      nomor: item.no_penetapan || "-",
      nomorGrms: item.no_penetapan_grms || "-",
      tanggal: item.tanggal ? formatDate(item.tanggal) : "-",

      // Field Wajib Retribusi
      nama: item.wr?.nama || item.nama_wr || "-",
      alamat: item.wr?.alamat || item.alamat_wr || "-",
      nik: item.wr?.nik_npwp || "-",

      // Field Obyek
      obyek: item.nama_obyek || item.obyek?.obyek_retribusi || "-",
      lokasi: item.alamat_obyek || item.obyek?.alamat || "-",
      satuan:
        item.obyek?.satuan?.deskripsi || item.obyek?.satuan?.satuan || "-",
      jenis: item.obyek?.tariftbl?.penerimaan || "Jasa",

      // Field Keuangan
      total: item.ketetapan || 0,
      jatuhTempo: item.jatuh_tempo ? formatDate(item.jatuh_tempo) : "-",
      masa:
        item.masa_dari && item.masa_sampai
          ? `${formatDate(item.masa_dari)} - ${formatDate(item.masa_sampai)}`
          : "-",
      volumeFull: `${item.volume || 0} ${item.obyek?.satuan?.deskripsi || ""}`,

      // Pejabat
      kepala: pejabat.nama_kepala || "KEPALA UPPD",
      nip: pejabat.nip_kepala || "-",
      kota: pejabat.kota || "KUDUS",
      jabatan: pejabat.jabatan_kepala || "KEPALA UPPD",
      namaOpd: item.opd?.nama || "BADAN PENGELOLA PENDAPATAN DAERAH",
      namaUppd: item.uppd?.nama || "-",
      qr: item.qrcode_link || `SKRD-${item.no_penetapan}`,
    });
    setShowPreviewModal(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("skrd-document").outerHTML;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>SPTRD</title>
        <style>
           html,
        body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        .payment-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payment-table td:first-child {
          width: 25px;
          vertical-align: top;
        }

        .payment-table td {
          padding-bottom: 8px;
          text-align: justify;
        }
        .input-modern {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 12px 14px;
          border-radius: 12px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .btn-action {
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        /* F4 PAPER */
        .skrd-paper {
          width: 100%;
          max-width: 210mm;
          min-height: 330mm;

          padding: 10mm 14mm 15mm 14mm;

          box-sizing: border-box;

          background: white;

          position: relative;

          color: #111827;

          box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);

          overflow: hidden;
        }

        /* HEADER */
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .logo-side {
          width: 80px;
        }

        .logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
          line-height: 1.3;
        }

        .title-side h1 {
          font-size: 18px;
        }

        .title-side h2 {
          font-size: 17px;
        }

        .title-side h3 {
          font-size: 16px;
          margin-top: 4px;
        }

        .model-side {
          width: 90px;
          text-align: right;
          font-size: 12px;
          font-weight: bold;
        }

        .top-code {
          text-align: right;
          margin-top: 2px;
          font-size: 12px;
        }

        .line-top {
          border: none;
          border-top: 1.3px solid #111;
          margin-top: 4px;
        }

        /* TITLE */
        .doc-title {
          text-align: center;
          margin-top: 5px;
        }

        .doc-title h1 {
          font-size: 17px;
          margin: 0;
        }

        .doc-title p {
          margin: 3px 0;
          font-size: 14px;
        }

        /* SECTION */
        .section {
          display: flex;
          margin-top: 2px;
        }

        .section-title {
          width: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .section-content {
          flex: 1;
        }

        .section-content h2 {
          margin: 0 0 8px;
          font-size: 15px;
        }

        /* TABLE */
        .table-detail {
          width: 100%;
          border-collapse: collapse;
        }

        .table-detail td {
          padding: 3px 0;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.5;
        }

        .table-detail td:nth-child(1) {
          width: 220px;
        }

        .table-detail td:nth-child(2) {
          width: 20px;
          text-align: center;
        }

        /* PAYMENT */
        .payment-list {
          margin: 0;
          padding-left: 22px;
          font-size: 14px;
        }

        .payment-list li {
          color: black;
          margin-bottom: 6px;
          line-height: 1.6;
          text-align: justify;
        }

        /* FOOTER */
        .footer-area {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        /* QR */
        .qr-side {
          width: 45%;
        }

        .qr-box {
          width: 100px;
          height: 100px;
          border: 1.5px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: white;
          margin-top: 4px;
        }

        .copy-text {
          margin-top: 10px;
        }

        .copy-text p {
          margin: 2px 0;
          font-size: 11px;
        }

        /* TTD */
        .ttd-side {
          width: 40%;
          text-align: left;
          font-size: 14px;
        }

        .ttd-space {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 5px 0;
        }

        .ttd-image {
          width: 140px;
          object-fit: contain;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        /* BOTTOM */
        .bottom-print {
          position: absolute;
          bottom: 8mm;
          left: 14mm;
          font-size: 10px;
          font-style: italic;
        }

        /* PAGE F4 */
        @page {
          size: 210mm 330mm;
          margin: 0;
        }

        /* PRINT */
        @media print {
          html,
          body {
            width: 210mm;
            height: 330mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #skrd-document,
          #skrd-document * {
            visibility: visible;
          }

          #skrd-document {
            position: absolute;
            left: 0;
            top: 0;

            width: 210mm !important;
            min-height: 330mm !important;

            margin: 0 !important;

            box-shadow: none !important;

            overflow: hidden !important;

            page-break-after: avoid !important;
            break-after: avoid-page !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .footer-area,
          .section,
          .doc-title,
          .header-wrap {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: F4 portrait;
            margin: 0;
          }
        }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  // DOWNLOAD PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById("skrd-document");

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 0,

        filename: `SKRD-${formData.nomor}.pdf`,

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },

        jsPDF: {
          unit: "mm",

          // F4
          format: [330, 210],

          orientation: "portrait",
        },

        pagebreak: {
          mode: ["avoid-all"],
        },
      })
      .from(element)
      .save();
  };

  const bulanList = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const tahunList = Array.from({ length: 5 }, (_, i) => 2023 + i);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* SEARCH */}
      <div className="pt-32 pb-16 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <FileText size={24} />
            Riwayat Ketetapan Retribusi
          </h1>

          <div className="grid md:grid-cols-4 gap-4">
            <GlassSelect
              value={searchForm.tahun}
              options={tahunList}
              onChange={(val) => setSearchForm({ ...searchForm, tahun: val })}
            />

            <GlassSelect
              value={searchForm.bulan}
              options={bulanList}
              onChange={(val) =>
                setSearchForm({
                  ...searchForm,
                  bulan: val,
                })
              }
            />

            <div className="flex">
              <button
                onClick={handleSearchAPI}
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white rounded-xl flex items-center justify-center gap-2 transition-all w-full"
              >
                <Search size={18} />
                {loading ? "Loading..." : "Cari"}
              </button>
              <div className="bg-blue-700 ml-4 hover:bg-blue-800 text-white rounded-xl flex items-center justify-center gap-2 transition-all">
                <a href="/transactions" className="px-3">
                  Bukti Bayar
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-4 mt-4">
          {["semua", "bayar", "belum"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredData.length === 0 ? (
            <div className="col-span-2 text-center py-10 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500">Tidak ada data SKRD yang ditemukan.</p>
            </div>
          ) : (
            filteredData.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.no_penetapan}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {item.nama_wr || item.wr?.nama}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.nama_obyek}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded-full ${
                      item.tbp
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {item.tbp ? "Lunas" : "Belum Bayar"}
                  </span>
                </div>

                <button
                  onClick={() => openDetail(item)}
                  className="w-full py-3 bg-gray-100 hover:bg-black text-gray-900 hover:text-white rounded-2xl font-semibold text-sm transition-all duration-300"
                >
                  Buka Detail
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
          {/* ACTION */}
          <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-lg p-4 flex flex-wrap gap-3 justify-center print:hidden">
            <button
              onClick={handleDownloadPDF}
              className="btn-action bg-blue-700"
            >
              <Download size={18} />
              Download PDF
            </button>

            <button onClick={handlePrint} className="btn-action bg-gray-700">
              <Printer size={18} />
              Print
            </button>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="btn-action bg-red-600"
            >
              <X size={18} />
              Tutup
            </button>
          </div>

          {/* DOCUMENT */}
          <div className="flex justify-center py-12 print:p-0">
            <div id="skrd-document" className="skrd-paper">
              {/* HEADER */}
              <div className="header-wrap">
                <div className="logo-side">
                  <img
                    src="/images/logo-jateng-official.png"
                    alt="Logo"
                    className="logo-img"
                    style={{ width: "70px", height: "70px", objectFit: "contain" }}
                  />
                </div>

                <div className="title-side">
                  <h1>
                    <b>PEMERINTAH PROVINSI JAWA TENGAH</b>
                  </h1>

                  <h2>
                    <b>{formData.namaOpd}</b>
                  </h2>

                  <p className="text-sm">{formData.namaUppd}</p>
                </div>

                <div className="model-side">
                  <span>Model : RD 02</span>
                </div>
              </div>

              <div className="top-code">{formData.nik}</div>

              <hr className="line-top" />

              {/* TITLE */}
              <div className="doc-title">
                <h1>
                  <b>SURAT KETETAPAN RETRIBUSI DAERAH (SKRD)</b>
                </h1>

                <p>
                  <b>Nomor :</b> {formData.nomor}
                </p>

                <p>
                  <b>Tanggal :</b> {formData.tanggal}
                </p>
              </div>

              {/* I */}
              <div className="section">
                <div className="section-title">I.</div>

                <div className="section-content">
                  <h2>WAJIB RETRIBUSI</h2>

                  <table className="table-detail">
                    <tbody className="text-sm">
                      <tr>
                        <td>1. Nama</td>
                        <td>:</td>
                        <td>{formData.nama}</td>
                      </tr>

                      <tr>
                        <td>2. Alamat</td>
                        <td>:</td>
                        <td>{formData.alamat}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* II */}
              <div className="section">
                <div className="section-title">II.</div>

                <div className="section-content">
                  <h2>OBYEK RETRIBUSI</h2>

                  <table className="table-detail">
                    <tbody>
                      <tr>
                        <td>1. Obyek Retribusi</td>
                        <td>:</td>
                        <td>{formData.obyek}</td>
                      </tr>

                      <tr>
                        <td>2. Lokasi</td>
                        <td>:</td>
                        <td>{formData.lokasi}</td>
                      </tr>

                      <tr>
                        <td>3. Satuan</td>
                        <td>:</td>
                        <td>{formData.satuan}</td>
                      </tr>

                      <tr>
                        <td>4. Jenis Retribusi</td>
                        <td>:</td>
                        <td>{formData.jenis}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* III */}
              <div className="section">
                <div className="section-title">III.</div>

                <div className="section-content">
                  <h2>KETETAPAN RETRIBUSI</h2>

                  <table className="table-detail">
                    <tbody>
                      <tr>
                        <td>1. Masa Retribusi</td>
                        <td>:</td>
                        <td>{formData.masa}</td>
                      </tr>

                      <tr>
                        <td>2. Volume</td>
                        <td>:</td>
                        <td>{formData.volumeFull}</td>
                      </tr>

                      <tr>
                        <td>3. Retribusi terhutang</td>
                        <td>:</td>
                        <td>Rp {rupiah(formData.total)}</td>
                      </tr>

                      <tr>
                        <td>4. Jatuh Tempo Pembayaran</td>
                        <td>:</td>
                        <td>{formData.jatuhTempo}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* IV */}
              <div className="section">
                <div className="section-title">IV.</div>

                <div className="section-content">
                  <h2>PEMBAYARAN</h2>

                  <table className="payment-table">
                    <tbody className="text-sm">
                      <tr>
                        <td>1.</td>
                        <td>
                          Pembayaran dilakukan pada rekening Kas Umum Daerah
                          melalui Bendahara Penerimaan dan/atau Bendahara
                          Penerimaan Pembantu pada OPD yang melakukan pemungutan
                          Retribusi Daerah dan/atau UPPD/UPT/Balai di
                          masing-masing OPD.
                        </td>
                      </tr>

                      <tr>
                        <td>2.</td>
                        <td>
                          Jatuh tempo pembayaran adalah 15 (lima belas) hari /
                          {formData.jatuhTempo} terhitung mulai tanggal
                          SKRD/SKRD Jabatan/SKRDKBT diterbitkan.
                        </td>
                      </tr>

                      <tr>
                        <td>3.</td>
                        <td>
                          Keterlambatan pembayaran dapat dikenakan sanksi
                          administratif berupa bunga sebesarnya 1% perbulan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FOOTER */}
              <div className="footer-area">
                {/* QR */}
                <div className="qr-side">
                  <p className="text-sm">( Link Pembayaran )</p>

                  <div className="qr-box">
                    <QRCodeSVG value={formData.qr} size={90} includeMargin />
                  </div>

                  <div className="copy-text">
                    <p>Lembar 1 : Wajib Retribusi</p>
                    <p>Lembar 2 : Seksi/Petugas yang menangani Retribusi</p>
                    <p>Lembar 3 : Arsip Unit Kerja.</p>
                    <p>Informasi : 08123123123</p>
                  </div>
                </div>

                {/* TTD */}
                <div className="ttd-side">
                  <p>
                    {formData.kota}, {formData.tanggal}
                  </p>

                  <p>{formData.jabatan}</p>

                  <div className="ttd-space">
                    {/* <img src="/ttd.png" alt="TTD" className="ttd-image" /> */}
                  </div>

                  <p className="ttd-name">{formData.kepala}</p>

                  <p>NIP. {formData.nip}</p>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="bottom-print">
                dicetak oleh : {loginUser} pada : {printDate}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        .payment-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payment-table td:first-child {
          width: 25px;
          vertical-align: top;
        }

        .payment-table td {
          padding-bottom: 8px;
          text-align: justify;
        }
        .input-modern {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 12px 14px;
          border-radius: 12px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .btn-action {
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
        .input-modern {
          width: 100%;
          padding: 12px 14px;
          border-radius: 14px;

          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          border: 1px solid rgba(255, 255, 255, 0.4);

          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

          color: #111;
          font-size: 14px;

          transition: all 0.25s ease;

          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;

          cursor: pointer;
        }
        .glass-select {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 12px 14px;
          border-radius: 14px;

          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          border: 1px solid rgba(209, 213, 219, 0.6);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);

          cursor: pointer;
          transition: all 0.25s ease;
          color: #111;
          font-size: 14px;
          width: 100%;
        }

        .glass-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .glass-dropdown::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .glass-select:hover {
          background: rgba(255, 255, 255, 1);
        }

        .glass-dropdown {
          position: absolute;
          top: 110%;
          left: 0;
          right: 0;

          margin-top: 8px;
          border-radius: 14px;

          background: #ffffff;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          border: 1px solid rgba(209, 213, 219, 0.8);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);

          z-index: 50;
          max-height: 240px;
          overflow-y: auto;
        }

        .glass-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }

        .glass-option {
          padding: 10px 14px;
          cursor: pointer;
          transition: 0.2s;
          color: #111;
          font-size: 14px;
        }

        .glass-option:hover {
          background: rgba(59, 130, 246, 0.15);
        }

        .glass-option.active {
          background: rgba(59, 130, 246, 0.25);
          font-weight: 600;
        }

        /* hover */
        .input-modern:hover {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
        }

        /* focus ala iOS glow */
        .input-modern:focus {
          outline: none;
          border: 1px solid rgba(59, 130, 246, 0.6);
          box-shadow:
            0 0 0 4px rgba(59, 130, 246, 0.15),
            0 10px 28px rgba(0, 0, 0, 0.1);
        }

        /* F4 PAPER */
        .skrd-paper {
          width: 100%;
          max-width: 210mm;
          min-height: 330mm;

          padding: 10mm 14mm 15mm 14mm;

          box-sizing: border-box;

          background: white;

          position: relative;

          color: #111827;

          box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);

          overflow: hidden;
        }

        /* HEADER */
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .logo-side {
          width: 80px;
        }

        .logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
          line-height: 1.3;
        }

        .title-side h1 {
          font-size: 18px;
        }

        .title-side h2 {
          font-size: 17px;
        }

        .title-side h3 {
          font-size: 16px;
          margin-top: 4px;
        }

        .model-side {
          width: 90px;
          text-align: right;
          font-size: 12px;
          font-weight: bold;
        }

        .top-code {
          text-align: right;
          margin-top: 2px;
          font-size: 12px;
        }

        .line-top {
          border: none;
          border-top: 1.3px solid #111;
          margin-top: 4px;
        }

        /* TITLE */
        .doc-title {
          text-align: center;
          margin-top: 5px;
        }

        .doc-title h1 {
          font-size: 17px;
          margin: 0;
        }

        .doc-title p {
          margin: 3px 0;
          font-size: 14px;
        }

        /* SECTION */
        .section {
          display: flex;
          margin-top: 2px;
        }

        .section-title {
          width: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .section-content {
          flex: 1;
        }

        .section-content h2 {
          margin: 0 0 8px;
          font-size: 15px;
        }

        /* TABLE */
        .table-detail {
          width: 100%;
          border-collapse: collapse;
        }

        .table-detail td {
          padding: 3px 0;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.5;
        }

        .table-detail td:nth-child(1) {
          width: 220px;
        }

        .table-detail td:nth-child(2) {
          width: 20px;
          text-align: center;
        }

        /* PAYMENT */
        .payment-list {
          margin: 0;
          padding-left: 22px;
          font-size: 14px;
        }

        .payment-list li {
          color: black;
          margin-bottom: 6px;
          line-height: 1.6;
          text-align: justify;
        }

        /* FOOTER */
        .footer-area {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        /* QR */
        .qr-side {
          width: 45%;
        }

        .qr-box {
          width: 100px;
          height: 100px;
          border: 1.5px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: white;
          margin-top: 4px;
        }

        .copy-text {
          margin-top: 10px;
        }

        .copy-text p {
          margin: 2px 0;
          font-size: 11px;
        }

        /* TTD */
        .ttd-side {
          width: 40%;
          text-align: left;
          font-size: 14px;
        }

        .ttd-space {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 5px 0;
        }

        .ttd-image {
          width: 140px;
          object-fit: contain;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        /* BOTTOM */
        .bottom-print {
          position: absolute;
          bottom: 8mm;
          left: 14mm;
          font-size: 10px;
          font-style: italic;
        }

        /* PAGE F4 */
        @page {
          size: 210mm 330mm;
          margin: 0;
        }

        /* PRINT */
        @media print {
          html,
          body {
            width: 210mm;
            height: 330mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #skrd-document,
          #skrd-document * {
            visibility: visible;
          }

          #skrd-document {
            position: absolute;
            left: 0;
            top: 0;

            width: 210mm !important;
            min-height: 330mm !important;

            margin: 0 !important;

            box-shadow: none !important;

            overflow: hidden !important;

            page-break-after: avoid !important;
            break-after: avoid-page !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .footer-area,
          .section,
          .doc-title,
          .header-wrap {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: F4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}