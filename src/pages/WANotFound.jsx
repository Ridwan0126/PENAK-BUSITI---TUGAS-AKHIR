import React from "react";
import { motion } from "framer-motion";
import { MapPinOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; // Tambahkan useLocation

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil ID dari state, berikan nilai default '-' jika kosong
  const idAset = location.state?.idAset || "Tidak diketahui";
  const namaObyek = location.state?.namaObyek || "Tidak diketahui";

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/bgwa.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* 1. BAGIAN GAMBAR */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        /* md:absolute md:bottom-0 md:left-0 memastikan nempel di bawah kiri hanya pada desktop */
        className="z-10 flex-1 flex items-end justify-center md:justify-start p-6 md:pl-12 pt-12 md:pt-0"
      >
        <img
          src="/images/suwun1.png"
          alt="Logo Pepak Radja"
          /* Ukuran dinamis: lebih kecil di HP, sangat besar di desktop */
          className="w-64 md:w-[600px] lg:w-[900px] h-auto object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* 2. BAGIAN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        /* Menggunakan md:absolute untuk mengunci di pojok kanan bawah HANYA pada desktop */
        className="z-20 w-full md:absolute md:bottom-6 md:right-6 md:max-w-md bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-t-3xl md:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] flex flex-col items-center text-center"
      >
        <div className="max-w-xl">
          <p className="text-md md:text-lg text-gray-600 mb-8 leading-relaxed font-light">
            Saat ini nomor WhatsApp untuk pengelola Layanan/Jasa{" "}
            <span className="font-semibold text-blue-700">{namaObyek}</span>{" "}
            belum tercantum di Aplikasi Penak Busiti. Silakan hubungi{" "}
            <span className="font-semibold text-blue-700">PIC Penak Busiti</span>{" "}
            untuk mendapatkan bantuan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <motion.a
            href="/"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl"
          >
            Lain Kali
          </motion.a>
          <motion.a
            href={`https://wa.me/6287894600111?text=${encodeURIComponent(
              `Halo PIC Penak Busiti, saya berminat dan ingin mendapatkan informasi terkait layanan/jasa ${namaObyek} dengan ID : ${idAset}, namun nomor WhatsApp pengelola tidak tercantum di Aplikasi Penak Busiti. Mohon bantuannya, terima kasih.`,
            )}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            Hubungi PIC
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
