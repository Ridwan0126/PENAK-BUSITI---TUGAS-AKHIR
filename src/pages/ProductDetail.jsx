import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  CheckCircle,
  Loader,
  Download,
  Printer,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCartStore } from "../stores/cartStore";
import { retributiAPI_Endpoints } from "../services/api";
import Swal from "sweetalert2";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Inisialisasi navigate
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showNotif, setShowNotif] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [showInfo, setShowInfo] = useState(false); // State untuk popup cara pengajuan

  const [showShareModal, setShowShareModal] = useState(false);
  const currentUrl = window.location.href; // Mengambil URL lengkap saat ini

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await retributiAPI_Endpoints.getProduct(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const images = [
    product?.foto,
    product?.foto_2,
    product?.foto_3,
    product?.foto_4,
  ].filter(Boolean);

  const finalImages =
    images.length > 0
      ? images
      : [
          "/images/footer.svg",
          "/images/footer.svg",
          "/images/footer.svg",
        ];

  const latLong = product?.lat_long;

  let lat = null;
  let lng = null;

  if (typeof latLong === "string" && latLong.includes(",")) {
    const split = latLong.split(",").map((v) => v.trim());

    lat = parseFloat(split[0]);
    lng = parseFloat(split[1]);
  }

  const session =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wr_session")) || {}
      : {};

  const wr = session?.user || {};

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const today = formatDate(new Date());

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.obyek_retribusi,
          text: `Lihat detail obyek retribusi: ${product.obyek_retribusi}`,
          url: window.location.href, // Ini akan mengambil URL real website Anda
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Jika tidak support (misal di desktop), tampilkan modal kustom
      setShowShareModal(true);
    }
  };

  const handleSPTRD = () => {
    if (product?.is_laku) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Obyek retribusi ini sudah disewa/digunakan.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!wr?.nama) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk membuat perjanjian.",
        confirmButtonText: "Login",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!product) return;

    setFormData({
      nomor: `SPTRD-${Date.now()}`,
      tanggal: today,

      nama: wr?.nama || "-",
      alamat: wr?.alamat || "-",
      nik: wr?.nik_npwp || "-",
      npwrd: wr?.npwrd || "-",
      telepon: wr?.telepon || "-",
      email: wr?.email || "-",

      jenis: product?.golongan?.golongan || "Jasa",
      rincian: product?.obyek_retribusi || "Sewa",
      pelayanan:
        product?.jenis?.jenis_retribusi || product?.tariftbl?.penerimaan || "-",

      obyek: product?.obyek_retribusi || "-", // 🔥 tambahin ini (dipakai di preview)

      lokasi: product?.alamat || "-", // 🔥 penting buat preview

      opd: product?.opd?.nama || "-",
      uppd: product?.uppd?.nama || "-",

      keterangan: product?.keterangan || "-",

      dasarPengenaan: product?.dasar_pengenaan || "-",
      dasarPenetapan: product?.dasar_penetapan || "-",
      pksawal: product?.pks_awal_kontrak,
      pksakhir: product?.pks_akhir_kontrak,

      tarif: product?.tariftbl?.tarif || 0,
      satuan: product?.tariftbl?.satuan?.satuan || "-",

      jenisRetribusi: product?.jenis?.jenis_retribusi || "-",

      qr: JSON.stringify({
        wr: wr?.npwrd,
        obyek: product?.id,
      }),
    });

    setShowPreview(true);
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("sptrd-document");

    html2pdf().from(element).save(`SPTRD-${formData.nomor}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin w-10 h-10 text-green-600" />
      </div>
    );
  }
  const handlePrint = () => {
    const printContent = document.getElementById("sptrd-document").outerHTML;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>SPTRD</title>
        <style>
           .btn-action {
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .sptrd-paper {
          width: 210mm;
          min-height: 330mm;
          background: white;
          padding: 12mm;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .header-wrap {
          display: flex;
          justify-content: space-between;
        }

        .logo-img {
          width: 70px;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
        }

        .doc-title {
          text-align: center;
          margin-top: 20px;
        }

        .line-top {
          margin-top: 10px;
        }

        .section {
          display: flex;
          margin-top: 18px;
        }

        .section-title {
          width: 30px;
          font-weight: bold;
        }

        .section-content {
          flex: 1;
        }

        .table-detail {
          width: 100%;
        }

        .table-detail td {
          padding: 4px 0;
          vertical-align: top;
        }

        .table-detail td:first-child {
          width: 220px;
        }

        .footer-area {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }

        .ttd-side {
          text-align: center;
          width: 40%;
        }

        .ttd-space {
          height: 90px;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        .bottom-print {
          position: absolute;
          bottom: 10mm;
          left: 12mm;
          font-size: 11px;
        }

        @page {
          size: 210mm 330mm;
          margin: 0;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          #sptrd-document,
          #sptrd-document * {
            visibility: visible;
          }

          #sptrd-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 330mm;
            box-shadow: none;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
        .sptrd-paper-jtg {
        box-sizing: border-box;
          width: 210mm;
          min-height: 330mm;
          background: white;
          padding: 18mm;
          font-family: "Times New Roman", serif;
          font-size: 12px;
          color: #000;
        }

        .top-format {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .header-jtg {
          display: flex;
          align-items: flex-start;
        }

        .logo-jtg {
          width: 70px;
          margin-right: 15px;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .header-center h2 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }

        .header-center h3 {
          margin: 3px 0;
          font-size: 15px;
        }

        .dots-line {
          border-bottom: 1px dotted #000;
          margin-top: 8px;
        }

        .header-line {
          border-bottom: 4px solid #000;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .title-jtg {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .tujuan-box {
          width: 250px;
          margin-left: auto;
          text-align: left;
          margin-bottom: 20px;
          font-size: 15px;
        }

        .tujuan-box p {
          margin: 2px 0;
          font-size: 15px;
        }

        .intro-text {
          margin-bottom: 12px;
          font-size: 14px;
        }

        .section-jtg {
          margin-bottom: 15px;
        }

        .section-title-jtg {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 15px;
        }

        .table-jtg {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .table-jtg td {
          padding: 2px 0;
          vertical-align: top;
        }

        .table-jtg td:first-child {
          width: 220px;
        }

        .table-jtg td:nth-child(2) {
          width: 20px;
        }

        .lampiran-jtg p {
          margin: 3px 0;
          font-size: 15px;
        }

        .pernyataan-jtg {
          text-align: justify;
          margin-top: 15px;
          line-height: 1.5;
          font-size: 15px;
        }

        .signature-jtg {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 15px;
        }

        .signature-right {
          text-align: left;
          width: 200px;
        }

        .ttd-space-jtg {
          height: 10px;
        }

        .footer-note {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        .qr-mini {
          text-align: right;
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
  const rupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka || 0);
  };

  const handleBerminat = () => {
    if (product?.no_wa_pengelola && product.no_wa_pengelola.trim() !== "") {
      const phone = product.no_wa_pengelola.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Halo, saya ingin menanyakan bantuan terkait kendala pada aset dengan ID: ${product.id} (${product.obyek_retribusi}).`,
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    } else {
      // KIRM ID MELALUI STATE
      navigate("/wanotfound", {
        state: { idAset: product.id, namaObyek: product.obyek_retribusi },
      });
    }
  };

  return (
    <div className="bg-[#F2F2F7] min-h-screen pt-[80px]">
      <Header />

      <div className="w-full max-w-7xl mx-auto px-4 pt-[30px]">
        {" "}
        <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg group">
          {/* 1. Tombol Back (Lebih Kontras dengan Shadow) */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 z-30 flex items-center gap-1.5 py-2 px-4 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all active:scale-95 shadow-xl border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Kembali</span>
          </button>

          {/* 2. Tombol Navigasi Kiri */}
          {activeImage > 0 && (
            <button
              onClick={() => setActiveImage((prev) => prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all active:scale-90 shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* 3. Tombol Navigasi Kanan */}
          {activeImage < finalImages.length - 1 && (
            <button
              onClick={() => setActiveImage((prev) => prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all active:scale-90 shadow-2xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image Container */}
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={activeImage}
              src={finalImages[activeImage]}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -100)
                  setActiveImage((prev) =>
                    Math.min(prev + 1, finalImages.length - 1),
                  );
                if (offset.x > 100)
                  setActiveImage((prev) => Math.max(prev - 1, 0));
              }}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
            />
          </AnimatePresence>

          {/* Judul */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
              {product.obyek_retribusi}
            </h1>
          </div>
        </div>
        {/* THUMBNAILS */}
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {finalImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 w-20 h-20 m-2 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                activeImage === index
                  ? "border-blue-500 scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* INFO CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  {product.obyek_retribusi}
                </h2>
                <div className="mt-4">
                  <p className="font-semibold">
                    ID Barang / Jasa : {product.id_gen_obyek}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mt-4 mb-2">Keterangan</h4>
                  {product?.keterangan ? (
                    <p className="text-sm text-gray-700">
                      {product.keterangan}
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-400">-</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-green-100"
                >
                  <Share2 />
                </button>
              </div>
            </div>

            {/* LOCATION */}
            <p className="font-semibold mt-4 mb-2">Lokasi</p>
            <div className="flex gap-3 text-gray-600">
              <MapPin />
              <span>{product.alamat}</span>
            </div>

            {/* PRICE */}
            <div className="mt-6 font-semibold">
              <p className="">Tarif</p>
              {/* <h3 className="text-3xl font-bold text-green-600">
                Rp{" "}
                {parseInt(product.tariftbl?.tarif || 0).toLocaleString("id-ID")}
              </h3> */}
              <div className="flex">
                <h3 className="font-semibold flex-auto text-green-600">
                  Rp{" "}
                  {parseInt(product.tariftbl?.tarif || 0).toLocaleString(
                    "id-ID",
                  )}
                </h3>
                <p>{product.tariftbl?.satuan?.satuan}</p>
              </div>
            </div>
          </div>

          {/* DETAIL */}
          {/* FULL DATA SECTION */}
          <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="text-xl font-bold">Informasi Lengkap</h3>

            {/* STATUS */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.status === 1
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.status === 1 ? "Aktif" : "Tidak Aktif"}
              </span>

              {product.is_laku ? (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                  Tersewa
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  Tersedia
                </span>
              )}
            </div>

            {/* BASIC */}
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Barang / Jasa</p>
                <p className="font-semibold">{product.judul_penawaran}</p>
              </div>

              <div>
                <p className="text-gray-500">Jenis Retribusi</p>
                <p className="font-semibold">
                  {product.jenis?.jenis_retribusi}
                </p>
              </div>

              {/* <div>
                <p className="text-gray-500">Dasar Pengenaan</p>
                <p className="font-semibold">{product.dasar_pengenaan}</p>
              </div>

              <div>
                <p className="text-gray-500">Dasar Penetapan</p>
                <p className="font-semibold">{product.dasar_penetapan}</p>
              </div> */}
            </div>

            {/* LOKASI */}
            <div>
              <h4 className="font-semibold mb-3">Lokasi</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Alamat</p>
                  <p className="font-semibold">{product.alamat}</p>
                </div>

                <div>
                  <p className="text-gray-500">Kecamatan</p>
                  <p className="font-semibold">
                    {product.kecamatan?.kecamatan}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Kota / Kabupaten</p>
                  <p className="font-semibold">{product.kota?.kab_kota}</p>
                </div>

                <div>
                  <div>
                    <p className="text-gray-500">Koordinat</p>
                    <p className="font-semibold">
                      {lat && lng ? `${lat}, ${lng}` : "Tidak ada koordinat"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TARIF */}
            <div>
              <h4 className="font-semibold mb-3">Tarif</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Tarif</p>
                  <p className="font-semibold text-green-600">
                    Rp{" "}
                    {parseInt(product.tariftbl?.tarif || 0).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Satuan</p>
                  <p className="font-semibold">
                    {product.tariftbl?.satuan?.satuan}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Volume</p>
                  <p className="font-semibold">
                    {product.potensi_retribusi?.volume}
                  </p>
                </div>
              </div>
            </div>

            {/* INSTANSI */}
            <div>
              <h4 className="font-semibold mb-3">Instansi Pengelola</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">OPD</p>
                  <p className="font-semibold">{product.opd?.nama}</p>
                </div>

                <div>
                  <p className="text-gray-500">UPPD / Balai / Pengelola</p>
                  <p className="font-semibold">{product.uppd?.nama}</p>
                </div>

                <div>
                  <p className="text-gray-500">WhatsApp</p>
                  {product?.no_wa_pengelola ? (
                    // Ubah bagian ini di JSX Anda
                    <a
                      href={`https://wa.me/${product.no_wa_pengelola.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo, saya ingin menanyakan bantuan terkait kendala pada aset ID: ${product.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-green-600 hover:underline cursor-pointer"
                    >
                      {product.no_wa_pengelola}
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-400">-</p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500">Telepon</p>{" "}
                  {product?.no_wa_pengelola ? (
                    <a
                      href={`tel:${product.no_telp_pengelola.replace(/[^0-9]/g, "")}`}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      {product.no_telp_pengelola}
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-400">-</p>
                  )}
                </div>

                {/* Tambahkan bagian ini untuk WA & Telp */}
              </div>
            </div>

            {/* METADATA */}
            {/* <div>
              <h4 className="font-semibold mb-3">Data Teknis</h4>
              <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600">
                <p>ID Obyek: {product.id}</p>
                <p>ID OPD: {product.id_opd}</p>
                <p>ID UPPD: {product.id_uppd}</p>
                <p>ID Jenis: {product.id_jenis_retribusi}</p>
                <p>ID Gen Obyek: {product.id_gen_obyek}</p>
              </div>
            </div> */}

            {/* KETERANGAN */}
            {/* {product.keterangan && (
              <div>
                <h4 className="font-semibold mb-2">Keterangan</h4>
                <p className="text-sm text-gray-700">{product.keterangan}</p>
              </div>
            )} */}
          </div>
        </motion.div>

        {/* RIGHT - STICKY */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-24 h-fit"
        >
          <div className="bg-white rounded-2xl p-6 shadow-xl border">
            {/* <p className="text-sm text-gray-500 mb-2">Total</p>

            <h2 className="text-3xl font-bold text-green-600 mb-6">
              Rp
              {(
                parseInt(product.tariftbl?.tarif || 0) * quantity
              ).toLocaleString("id-ID")}
            </h2> */}

            {/* CTA */}
            {product?.is_laku ? (
              <>
                <button
                  disabled
                  className="w-full py-4 rounded-xl bg-gray-400 text-white font-bold text-lg cursor-not-allowed"
                >
                  Tersewa
                </button>

                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm font-semibold text-red-700">
                    ⚠️ Obyek retribusi ini sedang digunakan/disewa dan tidak
                    dapat dibuatkan SPTRD.
                  </p>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm font-semibold text-red-700">
                    Sewa : {product.pks_awal_kontrak}
                  </p>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm font-semibold text-red-700">
                    Selesai : {product.pks_akhir_kontrak}
                  </p>
                </div>
              </>
            ) : (
              <button
                onClick={handleBerminat}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold text-lg hover:scale-105 transition"
              >
                Berminat
              </button>
            )}

            {showNotif && (
              <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                SPTRD berhasil dibuat
              </div>
            )}
          </div>
          {/* MAP CARD */}
          {lat && lng && (
            <div className="bg-white rounded-2xl p-4 shadow-xl border mt-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Lokasi Obyek Retribusi</h3>
              </div>

              <iframe
                src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                className="w-full h-64 rounded-xl border"
                loading="lazy"
              />

              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-green-600 text-sm font-semibold hover:underline"
              >
                📍 Buka di Google Maps
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {showPreview && formData && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
          <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg p-4 flex justify-center gap-3 print:hidden">
            <button
              onClick={() => setShowInfo(true)}
              className="btn-action bg-yellow-600 hover:bg-yellow-700"
            >
              Cara Pengajuan
            </button>

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
              onClick={() => setShowPreview(false)}
              className="btn-action bg-red-600"
            >
              <X size={18} />
              Tutup
            </button>
          </div>

          <div className="flex justify-center py-10 print:p-0">
            <div id="sptrd-document" className="sptrd-paper-jtg">
              {/* HEADER */}

              <div className="header-jtg">
                <img
                  src="/images/logo-jateng-official.png"
                  alt="logo"
                  className="logo-jtg"
                />

                <div className="header-center">
                  <h2 className="text-xl">PEMERINTAH PROVINSI JAWA TENGAH</h2>
                  <h3>{formData.opd}</h3>
                  <div className="">{formData.uppd}</div>
                </div>
              </div>

              <div className="header-line"></div>

              <h1 className="title-jtg">
                SURAT PEMBERITAHUAN RETRIBUSI DAERAH (SPTRD)
              </h1>

              {/* TUJUAN */}
              <div className="tujuan-box">
                <p>Kepada Yth:</p>
                <p>Kepala {formData.opd}</p>
                <p>Di</p>
                <p>TEMPAT</p>
              </div>

              <p className="intro-text">
                Yang bertanda tangan dibawah ini, kami:
              </p>

              {/* I IDENTITAS */}
              <div className="section-jtg">
                <div className="section-title-jtg">
                  I. Identitas Wajib Retribusi :
                </div>

                <table className="table-jtg">
                  <tbody>
                    <tr>
                      <td>Nama</td>
                      <td>:</td>
                      <td>{formData.nama}</td>
                    </tr>

                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{formData.alamat}</td>
                    </tr>

                    <tr>
                      <td>Nomor Induk Kependudukan</td>
                      <td>:</td>
                      <td>{formData.nik}</td>
                    </tr>

                    <tr>
                      <td>Nomor Induk Berusaha</td>
                      <td>:</td>
                      <td>{formData.npwrd}</td>
                    </tr>

                    <tr>
                      <td>Nomor Telepon</td>
                      <td>:</td>
                      <td>{formData.telepon}</td>
                    </tr>

                    <tr>
                      <td>Alamat Surat Elektronik</td>
                      <td>:</td>
                      <td>{formData.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* II PELAYANAN */}
              <div className="section-jtg">
                <div className="section-title-jtg">
                  II. Pelayanan Retribusi yang dimohon:
                </div>

                <table className="table-jtg">
                  <tbody>
                    <tr>
                      <td>Jenis Retribusi</td>
                      <td>:</td>
                      <td>{formData.jenis}</td>
                    </tr>

                    <tr>
                      <td>Objek Retribusi</td>
                      <td>:</td>
                      <td>{formData.pelayanan}</td>
                    </tr>

                    <tr>
                      <td>Rincian Objek Retribusi</td>
                      <td>:</td>
                      <td>{formData.rincian}</td>
                    </tr>

                    <tr>
                      <td>Detail Rincian Objek</td>
                      <td>:</td>
                      <td>{formData.obyek}</td>
                    </tr>

                    <tr>
                      <td>Uraian Deskripsi / Volume</td>
                      <td>:</td>
                      <td>{formData.keterangan}</td>
                    </tr>

                    <tr>
                      <td>Lokasi</td>
                      <td>:</td>
                      <td>{formData.lokasi}</td>
                    </tr>

                    <tr>
                      <td>Tarif</td>
                      <td>:</td>
                      <td>Rp {rupiah(formData.tarif)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* III JANGKA WAKTU */}
              <div className="section-jtg">
                <div className="section-title-jtg">
                  III. Jangka waktu Retribusi :
                </div>

                <div className="lampiran-jtg">
                  <p>Sebagai bahan pertimbangan, berikut kami lampirkan :</p>

                  <p>a. Fotokopi KTP;</p>
                  <p>b. Fotokopi NIB bagi Wajib Retribusi Badan Usaha;</p>
                  <p>
                    c. Surat Kuasa bagi Wajib Retribusi yang tidak
                    menandatangani SPTRD sendiri.
                  </p>
                </div>
              </div>

              {/* PERNYATAAN */}
              <div className="pernyataan-jtg">
                <p>
                  Apabila permohonan dikabulkan kami sanggup membayar Retribusi
                  serta menanggung sanksi administratif atas keterlambatan
                  pembayaran Retribusi sesuai ketentuan peraturan
                  perundang-undangan yang berlaku atas kuasa saya.
                </p>

                <p>
                  Saya menyatakan bahwa yang kami beritahukan tersebut beserta
                  lampirannya benar, lengkap dan jelas.
                </p>
              </div>

              {/* FOOTER */}
              <div className="signature-jtg">
                <div></div>

                <div className="signature-right">
                  <p>Tempat, {formData.tanggal}</p>

                  <p>Wajib Retribusi / Kuasa</p>

                  <div className="ttd-space-jtg"></div>

                  <p>.........................................</p>
                </div>
              </div>

              <div className="footer-note">
                <span>*Coret yang tidak perlu</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Tahapan Pengajuan</h3>
              <button onClick={() => setShowInfo(false)}>
                <X size={20} />
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                Datang ke pengelola terkait dan menyerahkan dokumen perjanjian.
              </li>
              <li>
                Petugas akan menginput data dan melakukan verifikasi perjanjian
                kerja sama.
              </li>
              <li>Anda mendapatkan tanda bukti pembayaran (TBP).</li>
              <li>
                Tanda bukti pembayaran bisa Anda cek atau unduh dari aplikasi.
              </li>
            </ol>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Bagikan Produk</h3>
            <div className="flex gap-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                className="flex-1 text-center bg-green-500 text-white p-2 rounded-lg"
              >
                WA
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                className="flex-1 text-center bg-blue-600 text-white p-2 rounded-lg"
              >
                FB
              </a>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full text-gray-500"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <Footer />
      <style jsx>{`
        .btn-action {
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .sptrd-paper {
          width: 210mm;
          min-height: 330mm;
          background: white;
          padding: 12mm;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .header-wrap {
          display: flex;
          justify-content: space-between;
        }

        .logo-img {
          width: 70px;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
        }

        .doc-title {
          text-align: center;
          margin-top: 20px;
        }

        .line-top {
          margin-top: 10px;
        }

        .section {
          display: flex;
          margin-top: 18px;
        }

        .section-title {
          width: 30px;
          font-weight: bold;
        }

        .section-content {
          flex: 1;
        }

        .table-detail {
          width: 100%;
        }

        .table-detail td {
          padding: 4px 0;
          vertical-align: top;
        }

        .table-detail td:first-child {
          width: 220px;
        }

        .footer-area {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }

        .ttd-side {
          text-align: center;
          width: 40%;
        }

        .ttd-space {
          height: 90px;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        .bottom-print {
          position: absolute;
          bottom: 10mm;
          left: 12mm;
          font-size: 11px;
        }

        @page {
          size: 210mm 330mm;
          margin: 0;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          #sptrd-document,
          #sptrd-document * {
            visibility: visible;
          }

          #sptrd-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 330mm;
            box-shadow: none;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
        .sptrd-paper-jtg {
          box-sizing: border-box;
          width: 210mm;
          min-height: 330mm;
          background: white;
          padding: 18mm;
          font-family: "Times New Roman", serif;
          font-size: 12px;
          color: #000;
        }

        .top-format {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .header-jtg {
          display: flex;
          align-items: flex-start;
        }

        .logo-jtg {
          width: 70px;
          margin-right: 15px;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .header-center h2 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }

        .header-center h3 {
          margin: 3px 0;
          font-size: 15px;
        }

        .dots-line {
          border-bottom: 1px dotted #000;
          margin-top: 8px;
        }

        .header-line {
          border-bottom: 4px solid #000;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .title-jtg {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .tujuan-box {
          width: 250px;
          margin-left: auto;
          text-align: left;
          margin-bottom: 20px;
        }

        .tujuan-box p {
          margin: 2px 0;
        }

        .intro-text {
          margin-bottom: 12px;
          font-size: 14px;
        }

        .section-jtg {
          margin-bottom: 15px;
        }

        .section-title-jtg {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 15px;
        }

        .table-jtg {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .table-jtg td {
          padding: 2px 0;
          vertical-align: top;
        }

        .table-jtg td:first-child {
          width: 220px;
        }

        .table-jtg td:nth-child(2) {
          width: 20px;
        }

        .lampiran-jtg p {
          margin: 3px 0;
          font-size: 15px;
        }

        .pernyataan-jtg {
          text-align: justify;
          margin-top: 15px;
          line-height: 1.5;
          font-size: 15px;
        }

        .signature-jtg {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          font-size: 15px;
        }

        .signature-right {
          text-align: left;
          width: 250px;
        }

        .ttd-space-jtg {
          height: 50px;
        }

        .footer-note {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        .qr-mini {
          text-align: right;
        }
      `}</style>
    </div>
  );
}
