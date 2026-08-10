"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Camera,
  CameraOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Keyboard,
  MapPin,
  User,
  Users,
  CalendarDays,
  Ticket as TicketIcon,
  ShieldCheck,
  Loader2,
  Table,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

/* =========================================================================
    SCAN TIKET & LAPORAN PEMASUKAN — Petugas pintu masuk (Terintegrasi Firebase).
    ========================================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyCRtgEJgJef3PNkPxPxbilsFRsv7Ldrv5Q",
  authDomain: "retribusi-bapenda.firebaseapp.com",
  projectId: "retribusi-bapenda",
  storageBucket: "retribusi-bapenda.firebasestorage.app",
  messagingSenderId: "479725161202",
  appId: "1:479725161202:web:3980d3054259bd5a235e6b",
  measurementId: "G-TJL81KLS2Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const RUPIAH = (n) =>
  "Rp" + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

/* Validasi + update status tiket di Firebase berdasarkan kode */
async function validateAndUseFirebase(kode) {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    let targetUserDocId = null;
    let targetTicketIndex = -1;
    let foundTicket = null;

    querySnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.history_tiket && Array.isArray(userData.history_tiket)) {
        const idx = userData.history_tiket.findIndex((t) => t.kode === kode);
        if (idx !== -1) {
          targetUserDocId = userDoc.id;
          targetTicketIndex = idx;
          foundTicket = userData.history_tiket[idx];
        }
      }
    });

    if (!targetUserDocId || !foundTicket) {
      return {
        status: "invalid",
        message: "Tiket tidak ditemukan / tidak valid dalam database.",
      };
    }

    const t = foundTicket;
    const now = new Date();
    const expiry = new Date(t.expiryDate || t.tanggalKunjungan + "T23:59:59");

    if (t.used || t.status === "used") {
      return {
        status: "used",
        message: "Tiket sudah pernah digunakan sebelumnya.",
        ticket: t,
      };
    }

    if (now > expiry) {
      const updatedTickets = [...(await getUserTickets(targetUserDocId))];
      updatedTickets[targetTicketIndex] = { ...t, status: "expired" };
      await updateDoc(doc(db, "users", targetUserDocId), {
        history_tiket: updatedTickets,
      });

      return {
        status: "expired",
        message: "Tiket sudah kedaluwarsa / hangus.",
        ticket: updatedTickets[targetTicketIndex],
      };
    }

    const userDocRef = doc(db, "users", targetUserDocId);
    let currentHistory = [];
    querySnapshot.forEach((d) => {
      if (d.id === targetUserDocId) {
        currentHistory = d.data().history_tiket || [];
      }
    });

    currentHistory[targetTicketIndex] = {
      ...t,
      used: true,
      status: "used",
      usedAt: new Date().toISOString(),
    };

    await updateDoc(userDocRef, {
      history_tiket: currentHistory,
    });

    return {
      status: "valid",
      message: "Tiket valid. Selamat datang!",
      ticket: currentHistory[targetTicketIndex],
    };
  } catch (error) {
    console.error("Gagal memvalidasi tiket ke Firebase:", error);
    return {
      status: "invalid",
      message: "Terjadi kesalahan koneksi database.",
    };
  }
}

async function getUserTickets(docId) {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  for (const d of snapshot.docs) {
    if (d.id === docId) {
      return d.data().history_tiket || [];
    }
  }
  return [];
}

/* Ekstrak kode dari hasil scan */
function extractKode(raw) {
  if (!raw) return null;
  const text = String(raw).trim();
  try {
    const obj = JSON.parse(text);
    if (obj && obj.kode) return obj.kode;
  } catch {
    return text.replace(/[^a-zA-Z0-9-]/g, "");
  }
  return text;
}

export default function ScanTicket() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const lockRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [supported, setSupported] = useState(true);
  const [result, setResult] = useState(null);
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState("");
  const [validating, setValidating] = useState(false);

  // State untuk Data Laporan & Filter Pemasukan Tiket
  const [scannedTicketsList, setScannedTicketsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");

  useEffect(() => {
    setSupported("BarcodeDetector" in window);
    fetchAllScannedTickets();
    return () => stopCamera();
  }, []);

  // Ambil semua tiket yang sudah digunakan/dipindai dari Firebase untuk tabel laporan
  const fetchAllScannedTickets = async () => {
    setLoadingList(true);
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      let list = [];

      querySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.history_tiket && Array.isArray(userData.history_tiket)) {
          userData.history_tiket.forEach((t) => {
            if (t.used || t.status === "used") {
              list.push(t);
            }
          });
        }
      });

      // Urutkan berdasarkan waktu pemindaian terbaru
      list.sort((a, b) => new Date(b.usedAt || 0) - new Date(a.usedAt || 0));
      setScannedTicketsList(list);
    } catch (error) {
      console.error("Gagal memuat data laporan tiket:", error);
    } finally {
      setLoadingList(false);
    }
  };

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleResult = async (raw) => {
    const kode = extractKode(raw);
    if (!kode) return;
    lockRef.current = true;
    setValidating(true);
    
    const res = await validateAndUseFirebase(kode);
    setResult(res);
    setValidating(false);
    stopCamera();
    fetchAllScannedTickets(); // Refresh data tabel setelah scan berhasil
  };

  const tick = async () => {
    if (lockRef.current) return;
    const video = videoRef.current;
    if (video && video.readyState === 4 && detectorRef.current) {
      try {
        const codes = await detectorRef.current.detect(video);
        if (codes && codes.length) {
          handleResult(codes[0].rawValue);
          return;
        }
      } catch (e) {
        console.log("[v0] detect error:", e);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const startCamera = async () => {
    setResult(null);
    lockRef.current = false;
    if (!("BarcodeDetector" in window)) {
      setSupported(false);
      setManual(true);
      return;
    }
    try {
      detectorRef.current = new window.BarcodeDetector({
        formats: ["qr_code"],
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      console.log("[v0] kamera gagal:", e);
      setManual(true);
    }
  };

  const submitManual = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    handleResult(code.trim().toUpperCase());
  };

  const reset = () => {
    setResult(null);
    setCode("");
    lockRef.current = false;
  };

  // Filter Data Berdasarkan Tanggal, Bulan, dan Tahun dari usedAt atau tanggalKunjungan
  const filteredTickets = scannedTicketsList.filter((item) => {
    const targetDateStr = item.usedAt || item.tanggalKunjungan || "";
    if (!targetDateStr) return false;

    const dateObj = new Date(targetDateStr);
    const itemTahun = String(dateObj.getFullYear());
    const itemBulan = String(dateObj.getMonth() + 1).padStart(2, "0");
    const itemTanggal = String(dateObj.getDate()).padStart(2, "0");

    if (filterTahun && itemTahun !== filterTahun) return false;
    if (filterBulan && itemBulan !== filterBulan) return false;
    if (filterTanggal && itemTanggal !== filterTanggal) return false;

    return true;
  });

  // Hitung total pemasukan dari tiket yang sudah disaring
  const totalPemasukan = filteredTickets.reduce((acc, curr) => acc + Number(curr.total || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600">
            <ShieldCheck className="h-3.5 w-3.5" /> Mode Petugas (Firebase)
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            Pindai E-Tiket & Laporan Pemasukan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Arahkan kamera ke QR tiket pengunjung untuk validasi dan pantau rekapitulasi pemasukan secara real-time.
          </p>
        </div>

        {/* SCANNER FRAME */}
        <div className="mx-auto max-w-md">
          <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/60 bg-slate-900 shadow-xl">
            <div className="relative aspect-square w-full">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`h-full w-full object-cover ${scanning ? "opacity-100" : "opacity-0"}`}
              />

              {!scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center">
                  <ScanLine className="h-12 w-12 text-sky-400" />
                  <p className="mt-3 px-8 text-sm text-slate-300">
                    Kamera belum aktif. Tekan tombol di bawah untuk mulai memindai.
                  </p>
                </div>
              )}

              {scanning && (
                <>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative h-56 w-56 rounded-3xl">
                      <Corner className="left-0 top-0" />
                      <Corner className="right-0 top-0 rotate-90" />
                      <Corner className="bottom-0 right-0 rotate-180" />
                      <Corner className="bottom-0 left-0 -rotate-90" />
                      <motion.div
                        className="absolute left-2 right-2 h-0.5 rounded-full bg-sky-400 shadow-[0_0_12px_2px_rgba(56,189,248,0.8)]"
                        animate={{ top: ["8%", "92%", "8%"] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white backdrop-blur">
                    Mendeteksi QR...
                  </div>
                </>
              )}

              {validating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                  <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
                  <p className="mt-3 text-sm font-medium text-white">Memeriksa database...</p>
                </div>
              )}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="mt-5 flex gap-3">
            {!scanning ? (
              <button
                onClick={startCamera}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition active:scale-[0.98]"
              >
                <Camera className="h-4 w-4" /> Mulai Pindai
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
              >
                <CameraOff className="h-4 w-4" /> Hentikan
              </button>
            )}
            <button
              onClick={() => setManual((m) => !m)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-4 text-sm font-medium text-slate-700 backdrop-blur transition active:scale-95"
            >
              <Keyboard className="h-4 w-4" /> Manual
            </button>
          </div>

          {!supported && (
            <p className="mt-3 flex items-center gap-1.5 text-center text-xs text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              Browser tidak mendukung kamera scan. Gunakan input manual kode tiket.
            </p>
          )}

          {/* MANUAL INPUT */}
          <AnimatePresence>
            {manual && (
              <motion.form
                onSubmit={submitManual}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                  <label className="text-xs font-medium text-slate-500">
                    Masukkan Kode Tiket
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="JTG-XXXX-XXXX"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm uppercase tracking-wide outline-none focus:border-sky-400"
                    />
                    <button
                      type="submit"
                      disabled={validating}
                      className="flex items-center justify-center rounded-xl bg-sky-500 px-4 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-50"
                    >
                      {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cek"}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION: TABEL LAPORAN PEMASUKAN TIKET */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Table className="h-5 w-5 text-sky-500" /> Data Pemasukan Tiket Terpindai
              </h2>
              <p className="text-xs text-slate-500">Rekapitulasi tiket masuk yang sukses divalidasi oleh petugas.</p>
            </div>
            
            <div className="rounded-2xl bg-sky-50 px-4 py-2 border border-sky-100 text-right">
              <span className="block text-[11px] font-semibold text-sky-600 uppercase">Total Pemasukan</span>
              <span className="text-base font-bold text-sky-900">{RUPIAH(totalPemasukan)}</span>
            </div>
          </div>

          {/* FILTER TANGGAL, BULAN, TAHUN */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Filter Tanggal (01-31)</label>
              <input
                type="text"
                placeholder="Cth: 05"
                maxLength={2}
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Filter Bulan (01-12)</label>
              <input
                type="text"
                placeholder="Cth: 12"
                maxLength={2}
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Filter Tahun</label>
              <input
                type="text"
                placeholder="Cth: 2025"
                maxLength={4}
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* RESET FILTER BUTTON */}
          {(filterTanggal || filterBulan || filterTahun) && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => { setFilterTanggal(""); setFilterBulan(""); setFilterTahun(""); }}
                className="text-xs font-medium text-rose-600 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* TABEL DATA */}
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <th className="p-3 font-semibold">No. Tiket / Kode</th>
                  <th className="p-3 font-semibold">Obyek Wisata</th>
                  <th className="p-3 font-semibold">Pengunjung</th>
                  <th className="p-3 font-semibold">Waktu Scan</th>
                  <th className="p-3 font-semibold text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loadingList ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Memuat data dari database...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Tidak ada data tiket yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 font-mono font-medium text-slate-900">{t.kode}</td>
                      <td className="p-3">{t.objekNama || "-"}</td>
                      <td className="p-3">{t.namaPemesan || "-"} ({t.jumlahOrang || 1} org)</td>
                      <td className="p-3 text-slate-500">
                        {t.usedAt ? new Date(t.usedAt).toLocaleString("id-ID") : "-"}
                      </td>
                      <td className="p-3 text-right font-semibold text-emerald-600">
                        {RUPIAH(t.total || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESULT MODAL */}
        <AnimatePresence>
          {result && <ResultModal result={result} onClose={reset} />}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function Corner({ className = "" }) {
  return (
    <div
      className={`absolute h-7 w-7 rounded-tl-xl border-l-4 border-t-4 border-sky-400 ${className}`}
    />
  );
}

const STATUS_UI = {
  valid: {
    color: "emerald",
    icon: CheckCircle2,
    title: "Tiket Valid",
    badge: "MASUK DIIZINKAN",
  },
  used: {
    color: "amber",
    icon: AlertTriangle,
    title: "Sudah Digunakan",
    badge: "DITOLAK",
  },
  expired: {
    color: "rose",
    icon: XCircle,
    title: "Tiket Hangus",
    badge: "KEDALUWARSA",
  },
  invalid: {
    color: "rose",
    icon: XCircle,
    title: "Tidak Valid",
    badge: "DITOLAK",
  },
};

function ResultModal({ result, onClose }) {
  const ui = STATUS_UI[result.status] || STATUS_UI.invalid;
  const Icon = ui.icon;
  const t = result.ticket;

  const colorMap = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      solid: "bg-emerald-500",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      solid: "bg-amber-500",
    },
    rose: { bg: "bg-rose-100", text: "text-rose-600", solid: "bg-rose-500" },
  };
  const c = colorMap[ui.color];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.6 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="relative z-10 w-full rounded-t-[2rem] border border-white/60 bg-white/85 p-6 backdrop-blur-2xl sm:max-w-sm sm:rounded-[2rem]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 20,
            delay: 0.05,
          }}
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${c.bg}`}
        >
          <Icon className={`h-9 w-9 ${c.text}`} />
        </motion.div>

        <div className="mt-3 text-center">
          <span
            className={`inline-block rounded-full ${c.solid} px-3 py-0.5 text-[10px] font-bold tracking-wide text-white`}
          >
            {ui.badge}
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{ui.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{result.message}</p>
        </div>

        {t && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/60 bg-white/70">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <TicketIcon className="h-4 w-4 text-slate-500" />
              <span className="font-mono text-sm font-semibold tracking-wider text-slate-700">
                {t.kode}
              </span>
            </div>
            <div className="space-y-2.5 p-4 text-sm">
              <Row
                icon={<MapPin className="h-4 w-4" />}
                label="Obyek Wisata"
                value={`${t.objekNama}`}
              />
              <Row
                icon={<ShieldCheck className="h-4 w-4" />}
                label="ID Obyek"
                value={t.objekId}
              />
              <Row
                icon={<User className="h-4 w-4" />}
                label="Pemesan"
                value={t.namaPemesan}
              />
              <Row
                icon={<Users className="h-4 w-4" />}
                label="Jumlah"
                value={`${t.jumlahOrang} orang`}
              />
              <Row
                icon={<CalendarDays className="h-4 w-4" />}
                label="Tanggal"
                value={t.tanggalKunjungan}
              />
              <Row
                icon={<TicketIcon className="h-4 w-4" />}
                label="Total"
                value={RUPIAH(t.total)}
              />
              {t.usedAt && (
                <Row
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Dipindai"
                  value={new Date(t.usedAt).toLocaleString("id-ID")}
                />
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" /> Pindai Tiket Lain
        </button>
      </motion.div>
    </motion.div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-slate-400">
        {icon}
        {label}
      </span>
      <span className="truncate text-right font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}