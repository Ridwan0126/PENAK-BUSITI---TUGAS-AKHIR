import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// API Configuration - Menggunakan proxy /api-proxy yang sudah ada di vite.config.js Anda
// Gunakan path relatif agar Vercel mengarahkan request ke server tujuan
const BASE_URL = "/api/lupa-password";
const API_TOKEN = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";

export default function LupaPassword() {
  const [formData, setFormData] = useState({
    nik_npwp: "",
    email_rpp: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setMessage("");

    try {
      const response = await fetch("/api/lupa-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      if (!text.trim().startsWith("{")) {
        console.error("Server Response:", text);
        throw new Error(
          "Server tidak mengembalikan JSON. Mungkin akses diblokir atau server sedang error.",
        );
      }

      const data = JSON.parse(text);

      if (response.ok || data.code === "00") {
        setStatus("success");
        setMessage(
          "Email reset password telah dikirim ke email Anda, jika tidak ditemukan pada Email masuk, cek folder SPAM.",
        );
        setFormData({ nik_npwp: "", email_rpp: "" });
      } else {
        setStatus("error");
        setMessage(
          data.message ||
            "Gagal mengirim reset password. Cek kembali data Anda.",
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Terjadi kesalahan. Silakan coba lagi.");
      console.error("Error Detail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blob Animations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl overflow-hidden">
          {/* Top Decorative Gradient Bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-8 sm:p-10">
            {/* Icon dan Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-40 animate-ping"></div>
                  <div className="relative bg-white p-4 rounded-full shadow-md border border-gray-100 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Lupa Password?
              </h1>
              <p className="text-gray-500 text-sm">
                Kami akan mengirimkan link reset password ke email Anda
              </p>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">
                      Berhasil!
                    </p>
                    <p className="text-emerald-600 text-xs mt-0.5">{message}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-rose-800 text-sm">Gagal</p>
                    <p className="text-rose-600 text-xs mt-0.5">{message}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* NIK/NPWP Input */}
              <div className="relative group">
                <label
                  htmlFor="nik_npwp"
                  className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
                >
                  NIK / NPWP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="nik_npwp"
                    name="nik_npwp"
                    value={formData.nik_npwp}
                    onChange={handleChange}
                    placeholder="Masukkan NIK atau NPWP Anda"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label
                  htmlFor="email_rpp"
                  className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
                >
                  Email RPP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email_rpp"
                    name="email_rpp"
                    value={formData.email_rpp}
                    onChange={handleChange}
                    placeholder="Masukkan email RPP Anda"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Reset Password</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="text-center text-sm text-gray-500 mt-6">
              Kembali ke{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Masuk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <p className="text-center text-xs text-gray-400 mt-6 tracking-wide">
          Kami tidak akan membagikan data Anda kepada pihak ketiga
        </p>
      </motion.div>
      <div className="fixed bottom-6 right-6 z-50 hidden-on-home">
        <a
          href="https://wa.me/6285642312609"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-300"
        >
          <img
            src="/images/call.png"
            alt="WhatsApp"
            className="w-32 h-32 object-contain floating-logo"
          />
        </a>
      </div>
    </div>
  );
}
