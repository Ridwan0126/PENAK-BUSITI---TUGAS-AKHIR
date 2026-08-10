"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  Minus,
  Plus,
  User,
  CalendarDays,
  Ticket as TicketIcon,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Wallet,
  Loader2,
  Download,
  Sparkles,
  History,
  LogIn,
  Lock,
  Banknote,
  Store,
  ChevronLeft,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";

/* =========================================================================
    PEMASARAN PARIWISATA JAWA TENGAH — TICKETING (iOS GLASS THEME)
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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STORAGE_KEY = "jateng_tickets";
const SESSION_KEY = "wr_session";

const RUPIAH = (n) =>
  "Rp" + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const readSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!s || !s.isLoggedIn) return null;
    if (s.expiredAt && Date.now() > s.expiredAt) return null;
    return s;
  } catch (e) {
    console.log("[v0] baca sesi gagal:", e);
    return null;
  }
};

const readTickets = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const qrSrc = (data, size = 260) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encodeURIComponent(
    data,
  )}`;

const genKode = () =>
  "JTG-" +
  Math.random().toString(36).slice(2, 6).toUpperCase() +
  "-" +
  Math.random().toString(36).slice(2, 6).toUpperCase();

const KATEGORI = ["Semua", "Candi", "Alam", "Sejarah", "Pantai", "Rekreasi"];

/* ----------------------------- DUMMY DATA ------------------------------ */
const DUMMY_DESTINASI = [
  {
    id_obyek: "dummy-1",
    nama_obyek: "Candi Borobudur",
    kab_kota: "Magelang",
    kategori: "Candi",
    harga_tiket: 50000,
    rating: 4.9,
    foto_obyek: "https://images.unsplash.com/photo-1598935899537-a745542d137b?auto=format&fit=crop&q=80&w=600",
    jam_operasional: "08.00 - 17.00",
    deskripsi: "Candi Buddha terbesar di dunia yang merupakan salah satu keajaiban dunia.",
    tiket: true,
  },
  {
    id_obyek: "dummy-2",
    nama_obyek: "Dataran Tinggi Dieng",
    kab_kota: "Wonosobo",
    kategori: "Alam",
    harga_tiket: 30000,
    rating: 4.8,
    foto_obyek: "https://images.unsplash.com/photo-1609137144881-540b59246e6a?auto=format&fit=crop&q=80&w=600",
    jam_operasional: "07.00 - 18.00",
    deskripsi: "Kawasan vulkanik aktif dengan panorama alam yang memukau dan telaga berwarna.",
    tiket: true,
  },
  {
    id_obyek: "dummy-3",
    nama_obyek: "Lawang Sewu",
    kab_kota: "Semarang",
    kategori: "Sejarah",
    harga_tiket: 20000,
    rating: 4.6,
    foto_obyek: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&q=80&w=600",
    jam_operasional: "08.00 - 20.00",
    deskripsi: "Gedung bersejarah di Kota Semarang yang terkenal dengan arsitektur pintu yang banyak.",
    tiket: true,
  },
  {
    id_obyek: "dummy-4",
    nama_obyek: "Pantai Menganti",
    kab_kota: "Kebumen",
    kategori: "Pantai",
    harga_tiket: 15000,
    rating: 4.7,
    foto_obyek: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    jam_operasional: "24 Jam",
    deskripsi: "Pantai berpasir putih dengan tebing karst hijau yang langsung berbatasan dengan Samudera Hindia.",
    tiket: true,
  },
  {
    id_obyek: "dummy-5",
    nama_obyek: "Taman Kyai Langgeng",
    kab_kota: "Magelang",
    kategori: "Rekreasi",
    harga_tiket: 25000,
    rating: 4.5,
    foto_obyek: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=600",
    jam_operasional: "08.00 - 16.00",
    deskripsi: "Taman hiburan dan edukasi keluarga dengan berbagai wahana menarik.",
    tiket: true,
  },
  {
    id_obyek: "dummy-6",
    nama_obyek: "Candi Prambanan",
    kab_kota: "Klaten",
    kategori: "Candi",
    harga_tiket: 50000,
    rating: 4.9,
    foto_obyek: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&q=80&w=600",
    jam_operasional: "08.00 - 17.00",
    deskripsi: "Kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9.",
    tiket: true,
  }
];

/* --------------------------- SMALL UI PARTS ---------------------------- */
function Glass({ className = "", children, ...rest }) {
  return (
    <div
      className={`border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

const spring = { type: "spring", stiffness: 320, damping: 30 };

/* ------------------------------ CARD ----------------------------------- */
function DestinationCard({ item, onSelect, index }) {
  const nama = item.nama_obyek || item.nama || "Destinasi Wisata";
  const lokasi = item.kab_kota || item.lokasi || "Jawa Tengah";
  const kategori = item.kategori || "Umum";
  const harga = item.harga_tiket || item.harga || 0;
  const rating = item.rating || 4.7;
  const img = item.foto_obyek || item.img || "/placeholder.svg";

  return (
    <motion.button
      layout
      onClick={() => onSelect(item)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ ...spring, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group text-left"
    >
      <Glass className="overflow-hidden rounded-3xl">
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={img}
            alt={nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {rating}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-sky-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {kategori}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {lokasi}
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-900 line-clamp-1">
            {nama}
          </h3>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-slate-400">Mulai dari</p>
              <p className="text-lg font-bold text-sky-600">{RUPIAH(harga)}</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white transition group-hover:bg-sky-600">
              Minat <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Glass>
    </motion.button>
  );
}

/* --------------------------- BOOKING SHEET ----------------------------- */
function BookingSheet({ item, session, onClose, onIssued, onTriggerLogin }) {
  const [step, setStep] = useState("detail");
  const [namaPemesan, setNamaPemesan] = useState(session?.user?.nama || "");
  const [jumlah, setJumlah] = useState(2);
  const today = new Date().toISOString().slice(0, 10);
  const [tanggal, setTanggal] = useState(today);
  const [paying, setPaying] = useState(false);
  const [ticket, setTicket] = useState(null);

  const id = item.id_obyek || item.id;
  const namaObyek = item.nama_obyek || item.nama;
  const harga = item.harga_tiket || item.harga || 0;
  const lokasi = item.kab_kota || item.lokasi || "Jawa Tengah";
  const kategori = item.kategori || "Umum";
  const img = item.foto_obyek || item.img || "/placeholder.svg";
  const jam = item.jam_operasional || "08.00 - 17.00";
  const deskripsi =
    item.deskripsi ||
    "Destinasi wisata unggulan Jawa Tengah yang memukau dan wajib dikunjungi bersama keluarga.";

  const total = harga * jumlah;

  const handleBeliClick = () => {
    if (!session) {
      onTriggerLogin(item);
    } else {
      setStep("form");
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const kode = genKode();
      const expiry = new Date(tanggal + "T23:59:59").toISOString();
      const t = {
        kode,
        objekId: id,
        objekNama: namaObyek,
        lokasi,
        kategori,
        img,
        namaPemesan: namaPemesan.trim() || session?.user?.nama || "Tamu",
        pemesanId: session?.user?.id || session?.user?.npwrd || "guest",
        npwrd: session?.user?.npwrd || null,
        jumlahOrang: jumlah,
        hargaSatuan: harga,
        total,
        tanggalKunjungan: tanggal,
        createdAt: new Date().toISOString(),
        expiryDate: expiry,
        metode: "Tunai / Bayar di Lokasi",
        statusBayar: "Belum Dibayar",
        status: "active",
        used: false,
      };

      // 1. Simpan ke LocalStorage (Cadangan / Offline)
      try {
        const list = readTickets();
        list.push(t);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.log("[v0] gagal simpan ke localstorage:", e);
      }

      // 2. Simpan ke Firebase Firestore (Koleksi `users` -> Dokumen ID `npwrd`/`id`)
      const userId = session?.user?.npwrd || session?.user?.id;
      if (userId) {
        const userRef = doc(db, "users", String(userId));
        
        // Cek apakah dokumen user ada, jika belum buat dengan setDoc atau updateDoc dengan arrayUnion
        try {
          await updateDoc(userRef, {
            history_tiket: arrayUnion(t),
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          // Jika dokumen belum ada, buat dokumen baru menggunakan setDoc
          await setDoc(userRef, {
            history_tiket: [t],
            updated_at: new Date().toISOString()
          }, { merge: true });
        }
      }

      setTicket(t);
      setPaying(false);
      setStep("done");
      onIssued && onIssued();
    } catch (e) {
      console.error("Gagal memproses pembayaran & menyimpan ke Firebase:", e);
      setPaying(false);
      alert("Terjadi kesalahan saat menyimpan pesanan ke database.");
    }
  };

  const ticketQrData = ticket ? JSON.stringify(ticket) : "";

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
        transition={spring}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/60 bg-white/80 p-1 backdrop-blur-2xl sm:max-w-md sm:rounded-[2rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[2rem] bg-white/60 px-4 pb-2 pt-3 backdrop-blur-xl">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 transition active:scale-90"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-8">
          <AnimatePresence mode="wait">
            {step === "detail" && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
              >
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={img}
                    alt={namaObyek}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-4 w-4" /> {lokasi}
                  <span className="text-slate-300">&bull;</span>
                  <Clock className="h-4 w-4" /> {jam}
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {namaObyek}
                </h2>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">4.7</span>
                  <span className="text-slate-400">&middot; {kategori}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {deskripsi}
                </p>

                <Glass className="mt-4 flex items-center justify-between rounded-2xl p-4">
                  <div>
                    <p className="text-[11px] text-slate-400">
                      Harga tiket / orang
                    </p>
                    <p className="text-xl font-bold text-sky-600">
                      {RUPIAH(harga)}
                    </p>
                  </div>
                  <ShieldCheck className="h-7 w-7 text-emerald-500" />
                </Glass>

                <button
                  onClick={handleBeliClick}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition active:scale-[0.98]"
                >
                  Beli Tiket <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
              >
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Detail Pemesanan
                </h2>
                <p className="text-sm text-slate-500">{namaObyek}</p>

                <label className="mt-5 block text-xs font-medium text-slate-500">
                  Nama Pemesan
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur">
                  <User className="h-4 w-4 text-slate-400" />
                  <input
                    value={namaPemesan}
                    onChange={(e) => setNamaPemesan(e.target.value)}
                    placeholder="cth. Budi Santoso"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <label className="mt-4 block text-xs font-medium text-slate-500">
                  Tanggal Kunjungan
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    min={today}
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>

                <label className="mt-4 block text-xs font-medium text-slate-500">
                  Jumlah Orang
                </label>
                <Glass className="mt-1 flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-sm text-slate-700">{jumlah} orang</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition active:scale-90"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-base font-semibold text-slate-900">
                      {jumlah}
                    </span>
                    <button
                      onClick={() => setJumlah((j) => Math.min(20, j + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white transition active:scale-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </Glass>

                <Glass className="mt-5 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {RUPIAH(harga)} &times; {jumlah}
                    </span>
                    <span>{RUPIAH(total)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-2">
                    <span className="text-sm font-medium text-slate-700">
                      Total Bayar
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {RUPIAH(total)}
                    </span>
                  </div>
                </Glass>

                <button
                  onClick={() => setStep("pay")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  <Wallet className="h-4 w-4" /> Lanjut ke Pembayaran
                </button>
                <button
                  onClick={() => setStep("detail")}
                  className="mt-2 w-full rounded-2xl py-2 text-sm font-medium text-slate-500"
                >
                  Kembali
                </button>
              </motion.div>
            )}

            {step === "pay" && (
              <motion.div
                key="pay"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
                className="text-center"
              >
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                  <Banknote className="h-3.5 w-3.5" /> Pembayaran di Lokasi
                </div>
                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  Konfirmasi Pemesanan
                </h2>
                <p className="text-sm text-slate-500">
                  Pembayaran dilakukan secara tunai di loket obyek wisata
                </p>

                <Glass className="mx-auto mt-5 flex w-fit items-center justify-center rounded-3xl p-6">
                  <div className="relative flex h-[160px] w-[220px] flex-col items-center justify-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                      <Store className="h-8 w-8 text-amber-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Bayar di Loket
                    </p>
                    <p className="text-center text-[11px] text-slate-400">
                      Tunjukkan e-tiket Anda kepada petugas saat tiba
                    </p>
                    {paying && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                        <p className="mt-2 text-xs font-medium text-slate-600">
                          Menyimpan pesanan ke Firebase...
                        </p>
                      </div>
                    )}
                  </div>
                </Glass>

                <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-slate-50 p-4 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total Tagihan</span>
                    <span className="font-bold text-slate-900">
                      {RUPIAH(total)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Tujuan</span>
                    <span className="font-medium text-slate-700">
                      {namaObyek}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Metode</span>
                    <span className="font-medium text-slate-700">
                      Tunai di Lokasi
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition active:scale-[0.98] disabled:opacity-60"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Konfirmasi Pesan
                      Tiket
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="mt-2 w-full rounded-2xl py-2 text-sm font-medium text-slate-500"
                  disabled={paying}
                >
                  Kembali
                </button>
              </motion.div>
            )}

            {step === "done" && ticket && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                >
                  <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                </motion.div>
                <h2 className="mt-3 text-center text-xl font-bold text-slate-900">
                  Pesanan Berhasil
                </h2>
                <p className="text-center text-sm text-slate-500">
                  E-Tiket tersimpan di Firebase &middot; bayar di lokasi
                </p>

                <div className="relative mt-5 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between bg-sky-500 px-5 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <TicketIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">
                        E-Tiket Wisata Jateng
                      </span>
                    </div>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
                      AKTIF
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex gap-4">
                      <img
                        src={ticket.img}
                        alt={ticket.objekNama}
                        className="h-20 w-20 rounded-2xl object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900">
                          {ticket.objekNama}
                        </p>
                        <p className="text-xs text-slate-500">
                          {ticket.lokasi}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          ID: {ticket.objekId}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Info label="Pemesan" value={ticket.namaPemesan} />
                      <Info
                        label="Jumlah"
                        value={`${ticket.jumlahOrang} orang`}
                      />
                      <Info label="Tanggal" value={ticket.tanggalKunjungan} />
                      <Info label="Total" value={RUPIAH(ticket.total)} />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <div className="h-5 w-5 -translate-x-2.5 rounded-full bg-slate-900/10" />
                    <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                    <div className="h-5 w-5 translate-x-2.5 rounded-full bg-slate-900/10" />
                  </div>

                  <div className="flex flex-col items-center px-5 pb-6 pt-3">
                    <p className="text-[11px] text-slate-400">
                      Pindai QR ini di pintu masuk
                    </p>
                    <div className="mt-3 rounded-2xl bg-white p-3 shadow-inner">
                      <img
                        src={qrSrc(ticketQrData, 220)}
                        alt="QR Tiket"
                        className="h-44 w-44"
                      />
                    </div>
                    <p className="mt-3 font-mono text-sm font-semibold tracking-wider text-slate-700">
                      {ticket.kode}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Berlaku sampai {ticket.tanggalKunjungan} 23:59
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" /> Selesai &amp; Simpan Tiket
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="truncate font-semibold text-slate-800">{value}</p>
    </div>
  );
}

/* --------------------- SWEETALERT: LOGIN REQUIRED ---------------------- */
function LoginAlert({ onLogin, onCancel }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/60 bg-white/90 p-7 text-center shadow-2xl backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 18,
            delay: 0.08,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100"
        >
          <Lock className="h-9 w-9 text-amber-500" />
        </motion.div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">
          Login Diperlukan
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Anda harus masuk terlebih dahulu untuk melakukan pemesanan tiket
          wisata.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" /> Login Sekarang
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl bg-slate-100 py-3.5 text-sm font-medium text-slate-600 transition active:scale-[0.98]"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TicketDetailView({ ticket, onClose }) {
  if (!ticket) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">E-Tiket Anda</h2>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="text-center">
            <img
              src={qrSrc(JSON.stringify(ticket), 220)}
              alt="QR"
              className="mx-auto h-40 w-40"
            />
            <p className="mt-3 font-mono font-bold text-lg">{ticket.kode}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Destinasi</span>
              <span className="font-semibold">{ticket.objekNama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pemesan</span>
              <span className="font-semibold">{ticket.namaPemesan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kunjungan</span>
              <span className="font-semibold">{ticket.tanggalKunjungan}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl font-medium"
        >
          Tutup
        </button>
      </motion.div>
    </motion.div>
  );
}

const statusBadge = (t) => {
  if (t.used) return { txt: "Terpakai", cls: "bg-slate-200 text-slate-700" };
  if (new Date(t.expiryDate) < new Date())
    return { txt: "Hangus", cls: "bg-rose-100 text-rose-700" };
  return { txt: "Aktif", cls: "bg-emerald-100 text-emerald-700" };
};

/* ----------------------- RIWAYAT PEMESANAN ----------------------------- */
function HistorySheet({ session, onClose }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [firebaseHistory, setFirebaseHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Ambil riwayat dari Firebase Firestore berdasarkan user yang sedang login (npwrd / id)
  useEffect(() => {
    const fetchUserHistory = async () => {
      const userId = session?.user?.npwrd || session?.user?.id;
      if (!userId) {
        setLoadingHistory(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", String(userId));
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.history_tiket && Array.isArray(data.history_tiket)) {
            setFirebaseHistory(data.history_tiket);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat dari Firebase:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchUserHistory();
  }, [session]);

  const list = useMemo(() => {
    // Gabungkan data lokal dan firebase, atau gunakan firebase history sepenuhnya
    const localAll = readTickets();
    const combined = [...firebaseHistory, ...localAll];
    // Hapus duplikat berdasarkan kode tiket
    const unique = Array.from(new Set(combined.map(t => t.kode)))
      .map(kode => combined.find(t => t.kode === kode));
    
    return unique.reverse();
  }, [firebaseHistory]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col bg-white/90 backdrop-blur-2xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold">Riwayat Pemesanan (Firebase)</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loadingHistory ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-center text-slate-400 py-10">
              Belum ada riwayat pemesanan.
            </p>
          ) : (
            list.map((t) => {
              const status = statusBadge(t);
              return (
                <button
                  key={t.kode}
                  onClick={() => setSelectedTicket(t)}
                  className="w-full"
                >
                  <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-left transition">
                    <img
                      src={t.img}
                      className="h-16 w-16 rounded-xl object-cover"
                      alt=""
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t.objekNama}</p>
                      <p className="text-[11px] text-slate-500">
                        {t.tanggalKunjungan}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${status.cls}`}
                        >
                          {status.txt}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <p className="text-xs font-bold text-sky-600">
                        {RUPIAH(t.total)}
                      </p>
                      <p className="text-[9px] font-mono text-slate-400">
                        {t.kode}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailView
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------ MAIN ----------------------------------- */
export default function Ticket() {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [lokasi, setLokasi] = useState("Semua Lokasi");
  const [kategori, setKategori] = useState("Semua");
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState(null);
  const [issuedCount, setIssuedCount] = useState(0);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSession(readSession());
    setIssuedCount(readTickets().length);

    const fetchDestinasi = async () => {
      try {
        const response = await fetch(
          "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/obyek",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
              "Content-Type": "application/json",
            },
          },
        );
        const resData = await response.json();
        const rawData = Array.isArray(resData) ? resData : resData.data || [];
        const filteredTiketTrue = rawData.filter((item) => item.tiket === true);

        if (filteredTiketTrue.length === 0) {
          setDestinasi(DUMMY_DESTINASI);
        } else {
          setDestinasi(filteredTiketTrue);
        }
      } catch (error) {
        console.error("Gagal memuat data objek wisata dari API, menggunakan dummy data:", error);
        setDestinasi(DUMMY_DESTINASI);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinasi();
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const lokasiList = useMemo(() => {
    const list = destinasi.map((d) => d.kab_kota || d.lokasi).filter(Boolean);
    return ["Semua Lokasi", ...Array.from(new Set(list))];
  }, [destinasi]);

  const filtered = useMemo(() => {
    return destinasi.filter((d) => {
      const namaObyek = (d.nama_obyek || d.nama || "").toLowerCase();
      const kotaObyek = (d.kab_kota || d.lokasi || "").toLowerCase();
      const katObyek = d.kategori || "Umum";

      const okQuery =
        namaObyek.includes(query.toLowerCase()) ||
        kotaObyek.includes(query.toLowerCase());

      const currentLokasi = d.kab_kota || d.lokasi;
      const okLokasi = lokasi === "Semua Lokasi" || currentLokasi === lokasi;
      const okKategori = kategori === "Semua" || katObyek === kategori;

      return okQuery && okLokasi && okKategori;
    });
  }, [destinasi, query, lokasi, kategori]);

  const triggerLogin = (item) => {
    setPendingItem(item);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 mt-20">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-1.5 py-2 px-4 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all active:scale-95 shadow-xl border border-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Kembali</span>
        </button>

        {/* HERO */}
        <Glass className="overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600">
            <Sparkles className="h-3.5 w-3.5" /> Jelajah Jawa Tengah
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Pesan Tiket Wisata Jawa Tengah
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Temukan destinasi terbaik Jawa Tengah dan pesan e-tiket dalam
            hitungan detik. Pembayaran{" "}
            <span className="font-semibold text-slate-800">
              tunai di lokasi
            </span>{" "}
            untuk saat ini.
          </p>

          {/* SEARCH & ACTION */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari obyek wisata atau kota..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => setShowFilter((s) => !s)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-95 ${
                showFilter
                  ? "bg-sky-500 text-white"
                  : "bg-white/80 text-slate-700 border border-white/60"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </button>
            {session && (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition active:scale-95"
              >
                <History className="h-4 w-4" /> Riwayat
              </button>
            )}
          </div>

          {/* FILTER PANEL */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={spring}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Lokasi
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lokasiList.map((l) => (
                        <Chip
                          key={l}
                          active={lokasi === l}
                          onClick={() => setLokasi(l)}
                          icon={<MapPin className="h-3 w-3" />}
                        >
                          {l}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Kategori
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {KATEGORI.map((k) => (
                        <Chip
                          key={k}
                          active={kategori === k}
                          onClick={() => setKategori(k)}
                        >
                          {k}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Glass>

        {/* QUICK LOCATION ROW */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {lokasiList.map((l) => (
            <Chip
              key={l}
              active={lokasi === l}
              onClick={() => setLokasi(l)}
              icon={<MapPin className="h-3 w-3" />}
            >
              {l}
            </Chip>
          ))}
        </div>

        {/* RESULTS BAR */}
        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {filtered.length} Destinasi
          </h2>
        </div>

        {/* LOADING / MAIN CONTENT CONDITION */}
        {loading ? (
          <div className="mt-20 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            <p className="mt-3 text-sm font-medium">Memuat objek wisata...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center text-slate-400">
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-slate-100 shadow-md">
              <img
                src="/images/notiket.jpg"
                alt="Data Tidak Ditemukan"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>
            <p className="mt-5 text-sm font-semibold text-slate-600">
              Tidak ada destinasi tiket aktif yang cocok.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <DestinationCard
                  key={item.id_obyek || item.id || i}
                  item={item}
                  index={i}
                  onSelect={handleSelect}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {selected && (
          <BookingSheet
            item={selected}
            session={session}
            onClose={() => setSelected(null)}
            onIssued={() => setIssuedCount((c) => c + 1)}
            onTriggerLogin={triggerLogin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <LoginAlert
            onLogin={handleLogin}
            onCancel={() => {
              setShowLogin(false);
              setPendingItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <HistorySheet
            session={session}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition active:scale-95 ${
        active
          ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
          : "border border-white/60 bg-white/70 text-slate-600 backdrop-blur hover:bg-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}