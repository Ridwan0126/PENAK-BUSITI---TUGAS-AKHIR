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
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

/* =========================================================================
   SCAN TIKET — Petugas pintu masuk.
   Memindai QR e-tiket (kamera native BarcodeDetector) ATAU input kode manual.
   - Tiket valid & belum dipakai  -> ditandai TERPAKAI (used = true).
   - Tiket sudah dipakai          -> ditolak.
   - Tiket kedaluwarsa            -> hangus / ditolak.
   ========================================================================= */

const STORAGE_KEY = "jateng_tickets";

const RUPIAH = (n) =>
  "Rp" + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

function loadTickets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveTickets(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* Validasi + update status berdasarkan kode tiket */
function validateAndUse(kode) {
  const list = loadTickets();
  const idx = list.findIndex((t) => t.kode === kode);

  if (idx === -1) {
    return {
      status: "invalid",
      message: "Tiket tidak ditemukan / tidak valid.",
    };
  }

  const t = list[idx];
  const now = new Date();
  const expiry = new Date(t.expiryDate || t.tanggalKunjungan + "T23:59:59");

  if (t.used || t.status === "used") {
    return {
      status: "used",
      message: "Tiket sudah pernah digunakan.",
      ticket: t,
    };
  }
  if (now > expiry) {
    list[idx] = { ...t, status: "expired" };
    saveTickets(list);
    return {
      status: "expired",
      message: "Tiket sudah kedaluwarsa / hangus.",
      ticket: list[idx],
    };
  }

  // valid -> tandai terpakai
  list[idx] = {
    ...t,
    used: true,
    status: "used",
    usedAt: new Date().toISOString(),
  };
  saveTickets(list);
  return {
    status: "valid",
    message: "Tiket valid. Selamat datang!",
    ticket: list[idx],
  };
}

/* Ekstrak kode dari hasil scan (bisa JSON penuh atau kode polos) */
function extractKode(raw) {
  if (!raw) return null;
  const text = String(raw).trim();
  try {
    // Coba parse jika formatnya JSON
    const obj = JSON.parse(text);
    if (obj && obj.kode) return obj.kode;
  } catch {
    // Jika bukan JSON, mungkin langsung kodenya
    // Bersihkan jika ada karakter aneh
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
  const [result, setResult] = useState(null); // {status, message, ticket}
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    setSupported("BarcodeDetector" in window);
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleResult = (raw) => {
    const kode = extractKode(raw);
    if (!kode) return;
    lockRef.current = true;
    const res = validateAndUse(kode);
    setResult(res);
    stopCamera();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-md px-4 pb-16 pt-6">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600">
            <ShieldCheck className="h-3.5 w-3.5" /> Mode Petugas
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            Pindai E-Tiket
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Arahkan kamera ke QR tiket pengunjung untuk validasi.
          </p>
        </div>

        {/* SCANNER FRAME */}
        <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/60 bg-slate-900 shadow-xl">
          <div className="relative aspect-square w-full">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`h-full w-full object-cover ${scanning ? "opacity-100" : "opacity-0"}`}
            />

            {/* idle overlay */}
            {!scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center">
                <ScanLine className="h-12 w-12 text-sky-400" />
                <p className="mt-3 px-8 text-sm text-slate-300">
                  Kamera belum aktif. Tekan tombol di bawah untuk mulai
                  memindai.
                </p>
              </div>
            )}

            {/* scan reticle + animated line */}
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
            Browser tidak mendukung kamera scan. Gunakan input manual kode
            tiket.
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
                    className="rounded-xl bg-sky-500 px-4 text-sm font-semibold text-white transition active:scale-95"
                  >
                    Cek
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

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
