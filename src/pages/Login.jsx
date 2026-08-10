import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  Sparkles,
  ShieldCheck,
  Database,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // DEV pakai vite proxy
      // PROD pakai vercel api
      const API_URL = import.meta.env.DEV
        ? "/bapenda-api/pepakraja/wr/data"
        : "/api/auth";

      const headers = import.meta.env.DEV
        ? {
            "Content-Type": "application/json",
            token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
          }
        : {
            "Content-Type": "application/json",
          };

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          // Kirim apa adanya (string) agar bisa menerima email atau angka
          npwrd: identifier,
          password,
        }),
      });

      // ambil text dulu
      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("RAW RESPONSE:", text);

        throw new Error("Response server tidak valid");
      }

      console.log("LOGIN RESULT:", result);

      // sukses
      if (result.code === "00") {
        setSuccess(result.message || "Login berhasil");

        // waktu login
        const loginTime = Date.now();

        // expired 24 jam (sesuaikan kebutuhan)
        const expiredAt = loginTime + 24 * 60 * 60 * 1000;

        // Ambil token jika ada dari API, atau berikan penanda aktif
        const activeToken = result.data.token || "active_session";

        // session user
        const sessionData = {
          isLoggedIn: true,
          loginTime,
          expiredAt,
          token: activeToken, // <--- INI KUNCI UTAMANYA AGAR AUTH CONTEXT TERBACA
          user: {
            id: result.data.id,
            nama: result.data.nama,
            npwrd: result.data.npwrd,
            nik_npwp: result.data.nik_npwp,
            email: result.data.email,
            telepon: result.data.telepon,
            alamat: result.data.alamat,
            dokumen: result.data.dokumen,
            kelurahan: result.data.kelurahan,
            status: result.data.status,
            kota: result.data.kota,
            provinsi: result.data.provinsi,
          },
        };

        // simpan session
        localStorage.setItem("wr_session", JSON.stringify(sessionData));

        // header user
        localStorage.setItem(
          "wr_user_header",
          JSON.stringify({
            nama: result.data.nama,
            npwrd: result.data.npwrd,
            email: result.data.email,
          }),
        );

        // redirect mulus menggunakan window.location.href agar AuthContext langsung mendeteksi sesi aktif
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setError(result.message || "NPWRD atau password salah");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Server tidak dapat dihubungi. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" />

        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:35px_35px]" />
      </div>

      {/* FLOATING PARTICLES */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/20 animate-float"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="flex">
              <img
                src="/images/footer.svg"
                alt="PEPAKRAJA"
                className="m-2 w-32 mb-8 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]"
              />

              <img
                src="/images/massajakBregada.png"
                alt="PEPAKRAJA"
                className="w-38 h-40 m-2 mb-8 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]"
              />
            </div>

            <h1 className="text-6xl font-black text-white leading-tight">
              PENAK BUSITI
            </h1>

            <p className="text-cyan-200 text-xl mt-5 max-w-xl">
              Platform digital layanan retribusi Daerah Provinsi Jawa Tengah
              yang memberikan kemudahan, transparansi, dan keamanan dalam proses
              pembayaran serta pengelolaan retribusi secara modern.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
                <Building2 className="w-8 h-8 text-cyan-300 mb-3" />
                <h3 className="text-3xl font-bold text-white">35</h3>
                <p className="text-gray-400 text-sm">Kab/Kota</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
                <Database className="w-8 h-8 text-cyan-300 mb-3" />
                <h3 className="text-3xl font-bold text-white">24/7</h3>
                <p className="text-gray-400 text-sm">Online</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
                <BadgeCheck className="w-8 h-8 text-cyan-300 mb-3" />
                <h3 className="text-3xl font-bold text-white">100%</h3>
                <p className="text-gray-400 text-sm">Terintegrasi</p>
              </div>
            </div>
          </motion.div>

          {/* LOGIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-[32px] p-8 shadow-[0_0_80px_rgba(34,211,238,0.15)] text-white">
              {/* LOGO MOBILE */}
              <div className="flex justify-center lg:hidden mb-5">
                <div className="flex">
                  <img
                    src="/images/pepak1.png"
                    alt="PEPAKRAJA"
                    className="w-24"
                  />

                  <img
                    src="/images/bregada.png"
                    alt="PEPAKRAJA"
                    className="w-24 ml-2"
                  />
                </div>
              </div>

              {/* HEADER */}
              <div className="text-center mb-8">
                <h2 className="mt-5 text-4xl font-black">Selamat Datang</h2>

                <p className="text-gray-300 mt-2">
                  Login menggunakan NPWRD/Email dan Password
                </p>
              </div>

              {error && (
                <div className="mb-5 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-2xl text-sm animate-shake">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-5 bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-2xl text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NPWRD */}
                {/* NPWRD / EMAIL INPUT */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300">
                    NPWRD atau Email
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />

                    <input
                      type="text" // Diubah dari "number" ke "text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Masukkan NPWRD atau Email"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none text-white placeholder:text-gray-400 focus:ring-4 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-14 outline-none text-white placeholder:text-gray-400 focus:ring-4 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-end mt-3">
                    <a
                      href="/lupapassword"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 text-sm hover:underline"
                    >
                      Lupa Password?
                    </a>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative overflow-hidden w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_40px_rgba(34,211,238,.35)] hover:scale-[1.02] transition-all"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />

                  <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        {/* <Sparkles className="w-5 h-5" /> */}
                        Masuk Sekarang
                      </>
                    )}
                  </div>
                </button>
                {/* LINK KE REGISTER */}
                <div className="mt-6 text-center text-sm text-gray-400">
                  Belum punya akun?{" "}
                  <a
                    href="/register"
                    className="text-cyan-400 font-bold hover:underline transition-all"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              </form>

              <div className="mt-8 text-center text-xs text-gray-400">
                © 2026 Bapenda Provinsi Jawa Tengah
              </div>
            </div>
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
      </div>

      <style>
        {`
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .animate-shake {
        animation: shake .3s ease-in-out;
      }

      @keyframes shine {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(200%);
        }
      }

      .animate-shine {
        animation: shine 3s linear infinite;
      }

      @keyframes float {
        0%,100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-20px);
        }
      }

      .animate-float {
        animation: float 5s ease-in-out infinite;
      }
      `}
      </style>
    </div>
  );
}
