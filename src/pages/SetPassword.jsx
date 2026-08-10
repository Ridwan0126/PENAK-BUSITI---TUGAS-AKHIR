import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const BASE_URL = "/api/set-password";
  const API_KEY = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";
  // 1. Cek Token saat komponen dimuat
  useEffect(() => {
    fetch(`${BASE_URL}?set_password_token=${token}`, {
      method: "GET",
      headers: { token: API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === "00") {
          setIsValid(true);
          setUserData(res.data);
        } else {
          setMessage("Token tidak valid atau sudah kadaluwarsa.");
        }
      })
      .catch(() => setMessage("Terjadi kesalahan koneksi server."))
      .finally(() => setLoading(false));
  }, [token]);

  // 2. Handler submit password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: API_KEY,
        },
        body: JSON.stringify({
          set_password_token: token,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });

      // AMBIL TEKS DULU UNTUK DEBUGGING
      const text = await response.text();

      // CEK APAKAH TEKS DIMULAI DENGAN '{' (JSON)
      if (!text.trim().startsWith("{")) {
        console.error("Respon Server:", text); // Lihat di console kenapa server kirim HTML
        throw new Error(
          "Server tidak mengembalikan JSON. Mungkin akses diblokir.",
        );
      }

      const result = JSON.parse(text);
      if (result.code === "00") {
        alert("Password berhasil diset!");
        navigate("/login");
      } else {
        alert(result.message || "Gagal mengubah password.");
      }
    } catch (error) {
      alert("Koneksi gagal. Cek Konsol (F12) untuk detail respon server.");
    }
  };

  if (loading) return <div>Memeriksa token...</div>;
  if (!isValid) return <div>{message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-10 p-8 bg-white/50 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Atur Password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Halo, {userData?.nama}. Masukkan password Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input Password */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password Baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Konfirmasi Password */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <CheckCircle2 size={18} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
        >
          Simpan Password
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SetPassword;
