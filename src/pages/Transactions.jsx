import { useState, useRef, useEffect } from "react";
import { Search, Printer, FileDown, QrCode, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Html5QrcodeScanner } from "html5-qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TransactionStatus() {
  const [skrd, setSkrd] = useState("");
  const [data, setData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const componentRef = useRef();
  // Di dalam komponen TransactionStatus
  const [printInfo, setPrintInfo] = useState(null);
  const getPrintTimestamp = () => {
    const now = new Date();
    return now.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    // Mengatur nama file: "tbp_NamaUser.pdf"
    documentTitle: data
      ? `tbp_${data.nama.replace(/\s+/g, "_")}-${data.no_tbp}`
      : "tbp_dokumen",
  });
  const handlePrintAction = () => {
    const session = JSON.parse(localStorage.getItem("wr_session"));
    setPrintInfo({
      username: session?.user?.nama || "User", // Sesuaikan dengan key nama di session Anda
      waktu: getPrintTimestamp(),
    });

    // Berikan sedikit jeda agar state terupdate sebelum render print
    setTimeout(() => handlePrint(), 100);
  };

  // FUNGSI UNDUH PDF
  const handleDownloadPDF = async () => {
    const session = JSON.parse(localStorage.getItem("wr_session"));
    const element = componentRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    setPrintInfo({
      username: session?.user?.nama || "User",
      waktu: getPrintTimestamp(),
    });
    setTimeout(async () => {
      const element = componentRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`tbp_${data.nama}-${data.no_tbp}.pdf`);
    }, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const terbilang = (bilangan) => {
    bilangan = Math.floor(bilangan);
    const angka = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
    ];
    if (bilangan < 12) return angka[bilangan];
    if (bilangan < 20) return terbilang(bilangan - 10) + " Belas";
    if (bilangan < 100)
      return (
        terbilang(Math.floor(bilangan / 10)) +
        " Puluh " +
        terbilang(bilangan % 10)
      );
    if (bilangan < 200) return "Seratus " + terbilang(bilangan - 100);
    if (bilangan < 1000)
      return (
        terbilang(Math.floor(bilangan / 100)) +
        " Ratus " +
        terbilang(bilangan % 100)
      );
    if (bilangan < 2000) return "Seribu " + terbilang(bilangan - 1000);
    if (bilangan < 1000000)
      return (
        terbilang(Math.floor(bilangan / 1000)) +
        " Ribu " +
        terbilang(bilangan % 1000)
      );
    if (bilangan < 1000000000)
      return (
        terbilang(Math.floor(bilangan / 1000000)) +
        " Juta " +
        terbilang(bilangan % 1000000)
      );
    return "";
  };

  const handleSearch = async () => {
    setLoadingSearch(true);
    const session = JSON.parse(localStorage.getItem("wr_session")) || {};
    const idWr = Number(session?.user?.id);

    if (!idWr || !skrd) {
      Swal.fire(
        "Peringatan",
        "Pastikan sudah login dan nomor SKRD terisi",
        "warning",
      );
      setLoadingSearch(false);
      return;
    }

    try {
      const response = await fetch(
        `/bapenda/pepakraja/tbp/detail?id_wr=${idWr}&no_penetapan=${encodeURIComponent(skrd.trim())}`,
        {
          headers: {
            token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();
      if (result.code !== "00") {
        Swal.fire("Gagal", "Data TBP tidak ditemukan di sistem", "error");
        return;
      }

      const item = result.data;
      const pejabat = JSON.parse(item.json_pejabat);
      const jumlahBayar = Number(item.jumlah_bayar);

      setData({
        no_tbp: item.no_tbp,
        tanggal: formatDate(item.tanggal),
        nama: item.wr.nama,
        alamat: item.wr.alamat,
        nik: item.wr.nik_npwp,
        jumlah: jumlahBayar.toLocaleString("id-ID"),
        terbilang: terbilang(jumlahBayar) + " Rupiah",
        jenis_ret: item.obyek.sub_rekening.golongan.golongan,
        keterangan: item.obyek.sub_rekening.jenis.jenis_retribusi,
        no_skrd: item.no_penetapan,
        obyek: item.obyek.obyek_retribusi,
        lokasi: item.obyek.alamat,
        nama_bendahara: pejabat.nama_bendahara,
        nip: pejabat.nip_bendahara,
        uppd: item.uppd.nama,
        opd: item.opd.nama,
        alamatuppd: item.opd.alamat,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        "Gagal mengambil data, pastikan koneksi server baik",
        "error",
      );
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 300, height: 150 },
          // Memastikan library mencari format Code 128
          formatsToSupport: [0, 6],
        },
        false,
      );

      scanner.render(
        (decodedText) => {
          // Jika sudah scan, jangan lupa bersihkan
          setSkrd(decodedText);
          setShowScanner(false);
          scanner.clear().catch(console.error);
        },
        (err) => {
          // Abaikan error "NotFoundException", itu hanya artinya barcode belum tertangkap
        },
      );
    }
    return () => {
      if (scanner) scanner.clear().catch(console.error);
    };
  }, [showScanner]);
  return (
    <div className="min-h-screen flex flex-col pt-28 bg-slate-50">
      <Header />
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full ">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="font-bold text-slate-800 mb-4 uppercase">
            Masukkan kode bayar
          </h2>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-slate-300 rounded p-2"
              placeholder="Masukkan Kode Bayar"
              value={skrd}
              onChange={(e) => setSkrd(e.target.value)}
            />
            {/* <button
              onClick={() => setShowScanner(true)}
              className="bg-slate-700 text-white px-4 rounded"
            >
              <QrCode className="w-5 h-5" />
            </button> */}
            <button
              onClick={handleSearch}
              className="bg-blue-700 text-white px-6 py-2 rounded"
            >
              <Search className="w-5 h-5 inline mr-1" /> Cari
            </button>
          </div>
        </div>

        {showScanner && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white p-4 rounded w-full max-w-sm">
              <div className="flex justify-between mb-4 font-bold">
                <span>SCAN BARCODE/QR</span>
                <button onClick={() => setShowScanner(false)}>
                  <X />
                </button>
              </div>
              <div id="reader" className="w-full"></div>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="flex gap-3">
              {/* Tombol Cetak */}
              <button
                onClick={handlePrintAction}
                className="bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-emerald-800"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>

              {/* Tombol Unduh PDF (Warna Merah) */}
              <button
                onClick={handleDownloadPDF}
                className="bg-red-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-red-700"
              >
                <FileDown className="w-4 h-4" /> Unduh PDF
              </button>
            </div>
            <div
              ref={componentRef}
              className="bg-white text-black mx-auto w-[210mm] min-h-[297mm] px-12 py-10 font-['Times_New_Roman'] text-[12px] leading-relaxed"
            >
              <div className="relative">
                <img
                  src="/images/logo-jateng-official.png"
                  alt="Logo"
                  className="absolute left-0 top-0 w-[60px]"
                />
                <div className="text-center font-bold text-[14px]">
                  <div>PEMERINTAH PROVINSI JAWA TENGAH</div>
                  <div>{data.opd}</div>
                  <div className="font-normal text-[12px]">{data.uppd}</div>
                  <div className="font-normal text-[12px]">
                    {data.alamatuppd}
                  </div>
                  <div className="text-right font-bold mt-4">{data.nik}</div>
                  <div className="border-b-2 border-black mt-2"></div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="font-bold underline text-[13px]">
                  TANDA BUKTI PEMBAYARAN (TBP) RETRIBUSI DAERAH
                </div>
                <div className="font-bold mt-1">No TBP : {data.no_tbp}</div>
                <div className="text-right font-bold mt-4">
                  Tanggal Pembayaran : {data.tanggal}
                </div>
              </div>
              <div className="mt-8">
                <div className="font-bold mb-2">
                  Telah terima dari Wajib Retribusi :
                </div>
                <table className="w-full ml-10">
                  <tbody>
                    <tr>
                      <td className="w-[180px] font-bold">1. Nama</td>
                      <td className="px-2">:</td>
                      <td>{data.nama}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">2. Alamat</td>
                      <td className="px-2">:</td>
                      <td>{data.alamat}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">3. Jumlah Uang</td>
                      <td className="px-2">:</td>
                      <td>Rp {data.jumlah}</td>
                    </tr>
                    <tr>
                      <td className="font-bold pl-8">terbilang</td>
                      <td className="px-2">:</td>
                      <td>{data.terbilang}</td>
                    </tr>
                    <tr>
                      <td className="py-2" colSpan="3"></td>
                    </tr>
                    <tr>
                      <td className="font-bold" colSpan="3">
                        4. Untuk Membayar
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold pl-8">Retribusi</td>
                      <td className="px-2">:</td>
                      <td>
                        {data.jenis_ret} - {data.keterangan}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold pl-8">No. SKRD</td>
                      <td className="px-2">:</td>
                      <td>{data.no_skrd}</td>
                    </tr>
                    <tr>
                      <td className="font-bold pl-8">Tanggal SKRD</td>
                      <td className="px-2">:</td>
                      <td>{data.tanggal}</td>
                    </tr>
                    <tr>
                      <td className="py-2" colSpan="3"></td>
                    </tr>
                    <tr>
                      <td className="font-bold" colSpan="3">
                        5. Obyek Retribusi
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold pl-8">Obyek</td>
                      <td className="px-2">:</td>
                      <td>{data.obyek}</td>
                    </tr>
                    <tr>
                      <td className="font-bold pl-8">Lokasi Obyek</td>
                      <td className="px-2">:</td>
                      <td>{data.lokasi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-16 flex justify-between px-10">
                <div className="text-center font-bold">
                  Wajib Retribusi
                  <div className="h-[80px]" />({data.nama})
                </div>
                <div className="text-center font-bold">
                  BENDAHARA PEMBANTU
                  <div className="h-[80px]" />
                  <u>{data.nama_bendahara}</u>
                  <br />
                  NIP. {data.nip}
                </div>
              </div>
              {printInfo && (
                <div className="absolute bottom-10 left-12 text-[10px] italic text-slate-500">
                  <div>Dicetak oleh: {printInfo.username}</div>
                  <div>Waktu: {printInfo.waktu}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
