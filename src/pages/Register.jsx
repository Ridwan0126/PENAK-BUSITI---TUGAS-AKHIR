import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Building2,
  Mail,
  CreditCard,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Loader2,
  Building,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // =========================================================
  // TOKEN
  // =========================================================
  const TOKEN = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";
  const CS_NUMBER = "081234567890";

  // =========================================================
  // URL TOKEN
  // =========================================================
  const setPasswordToken = searchParams.get("set_password_token");

  // =========================================================
  // STATE
  // =========================================================
  const [selectedType, setSelectedType] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const [kotaList, setKotaList] = useState([]);

  // =========================================================
  // MODE VERIFIKASI PASSWORD
  // =========================================================
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(false);

  const [tokenData, setTokenData] = useState(null);

  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // =========================================================
  // FORM DATA REGISTER
  // =========================================================
  const [formData, setFormData] = useState({
    dokumen: "NIK",
    nik_npwp: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    provinsi: "33",
    kota: "",
    email_rpp: "",
    telepon: "",
  });

  // =========================================================
  // LOAD KOTA
  // =========================================================
  useEffect(() => {
    getKota();
  }, []);

  // =========================================================
  // CHECK TOKEN MODE
  // =========================================================
  useEffect(() => {
    if (setPasswordToken) {
      setIsPasswordMode(true);
      checkPasswordToken();
    }
  }, [setPasswordToken]);

  // =========================================================
  // GET KOTA
  // =========================================================
  const getKota = async () => {
    try {
      const response = await fetch("/api/bapenda/kota?provinsi=33", {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      });

      const result = await response.json();

      // Log untuk memastikan struktur data
      console.log("Struktur API:", result);

      // Jika result berupa array:
      if (Array.isArray(result)) {
        setKotaList(result);
      }
      // Jika result adalah objek { data: [...] }:
      else if (result.data && Array.isArray(result.data)) {
        setKotaList(result.data);
      }
    } catch (err) {
      console.error("Gagal load kota:", err);
    }
  };

  // =========================================================
  // CHECK TOKEN PASSWORD
  // =========================================================
  const checkPasswordToken = async () => {
    try {
      setIsCheckingToken(true);

      const response = await fetch(
        `/api/bapenda/pepakraja/wr/set-password?set_password_token=${setPasswordToken}`,
        {
          method: "GET",
          headers: {
            token: TOKEN,
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      console.log("TOKEN RESULT:", result);

      if (result.code === "00") {
        setTokenData(result.data);

        return;
      }

      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: result.message,
      });

      navigate("/");
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Gagal Verifikasi",
        text: err.message,
      });

      navigate("/");
    } finally {
      setIsCheckingToken(false);
    }
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // HANDLE PASSWORD CHANGE
  // =========================================================
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // CEK WR
  // =========================================================
  const cekWR = async () => {
    if (!formData.nik_npwp) {
      Swal.fire({
        icon: "warning",
        title: "NIK / NPWP wajib diisi",
      });

      return;
    }

    try {
      setIsChecking(true);

      const response = await fetch(
        `/api/bapenda/pepakraja/wr/cek?nik_npwp=${formData.nik_npwp}`,
        {
          method: "GET",
          // Coba ubah menjadi:
          headers: {
            token: TOKEN,
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      console.log("HASIL CEK:", result);

      // =====================================
      // SUDAH TERDAFTAR
      // =====================================
      if (result.code === "00") {
        await Swal.fire({
          icon: "info",
          title: "NIK / NPWP Sudah Terdaftar",
          text: `Silahkan login atau hubungi No ${CS_NUMBER} untuk konfirmasi atau panduan login`,
          confirmButtonText: "OK",
          confirmButtonColor: "#16a34a",
        });

        navigate("/");

        return;
      }

      // =====================================
      // BELUM TERDAFTAR
      // =====================================
      if (result.code === "01") {
        const confirm = await Swal.fire({
          icon: "question",
          title: "NIK / NPWP Belum Terdaftar",
          text: "Apakah ingin mendaftar?",
          showCancelButton: true,
          confirmButtonText: "Ya",
          cancelButtonText: "Tidak",
          confirmButtonColor: "#16a34a",
          cancelButtonColor: "#ef4444",
        });

        if (confirm.isConfirmed) {
          setShowForm(true);
        } else {
          navigate("/");
        }

        return;
      }

      Swal.fire({
        icon: "warning",
        title: "Data tidak dikenali",
        text: result.message || "Terjadi kesalahan",
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Gagal koneksi API",
        text: err.message,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // =========================================================
  // SUBMIT REGISTER
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.dokumen ||
      !formData.nik_npwp ||
      !formData.nama ||
      !formData.alamat ||
      !formData.kelurahan ||
      !formData.kota ||
      !formData.email_rpp ||
      !formData.telepon
    ) {
      setError("Semua field wajib diisi");

      return;
    }

    const confirmSave = await Swal.fire({
      icon: "warning",
      title: "Data Akan Disimpan",
      text: "Apakah anda yakin?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
    });

    if (!confirmSave.isConfirmed) return;

    try {
      setIsSaving(true);

      const bodyData = {
        dokumen: formData.dokumen,
        nik_npwp: formData.nik_npwp,
        nama: formData.nama,
        alamat: formData.alamat,
        kelurahan: formData.kelurahan,
        provinsi: "33",
        kota: formData.kota,
        email_rpp: formData.email_rpp,
        telepon: formData.telepon,
      };

      console.log("BODY FINAL:", bodyData);

      const response = await fetch("/api/bapenda/pepakraja/wr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: TOKEN,
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      console.log("REGISTER RESULT:", result);

      if (result.code === "00") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil menambahkan wajib retribusi. Silahkan cek Email, jika tidak ada coba cek spam / sampah.",
          confirmButtonColor: "#16a34a",
        });

        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.message,
        });
      }
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // SUBMIT PASSWORD
  // =========================================================
  const submitPassword = async (e) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.password_confirmation) {
      Swal.fire({
        icon: "warning",
        title: "Password tidak sama",
      });

      return;
    }

    if (passwordData.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password minimal 6 karakter",
      });

      return;
    }

    const confirmSave = await Swal.fire({
      icon: "question",
      title: "Set Password",
      text: "Apakah anda yakin?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
    });

    if (!confirmSave.isConfirmed) return;

    try {
      setIsSaving(true);

      const response = await fetch("/api/bapenda/pepakraja/wr/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: TOKEN,
          Accept: "application/json",
        },
        body: JSON.stringify({
          set_password_token: setPasswordToken,
          password: passwordData.password,
          password_confirmation: passwordData.password_confirmation,
        }),
      });

      const result = await response.json();

      console.log("SET PASSWORD:", result);

      if (result.code === "00") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil set password wajib retribusi",
          confirmButtonColor: "#16a34a",
        });

        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.message,
        });
      }
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // PASSWORD MODE
  // =========================================================
  if (isPasswordMode) {
    return (
      <div className="min-h-screen overflow-hidden relative bg-[#050816] flex items-center justify-center px-4 py-10">
        {" "}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-[32px] bg-white/90 backdrop-blur-xl shadow-2xl border border-white/30 p-8"
          >
            {isCheckingToken ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />

                <h2 className="text-2xl font-bold text-gray-800">
                  Memverifikasi Token...
                </h2>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <h1 className="text-4xl font-black text-center text-gray-800 mb-2">
                  Set Password
                </h1>

                <p className="text-center text-gray-500 mb-8">
                  Buat password akun wajib retribusi
                </p>

                {tokenData && (
                  <div className="mb-6 rounded-2xl bg-green-50 border border-green-100 p-5">
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Nama</p>

                      <p className="font-bold text-gray-800">
                        {tokenData.nama}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email</p>

                      <p className="font-bold text-gray-800">
                        {tokenData.email}
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={submitPassword} className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Masukkan password"
                        className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-green-100"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Konfirmasi Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={passwordData.password_confirmation}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Konfirmasi password"
                        className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-green-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}

                    {isSaving ? "Menyimpan..." : "Set Password"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // =========================================================
  // REGISTER MODE
  // =========================================================
  return (
    <div className="min-h-screen overflow-hidden relative bg-[#050816] flex items-center justify-center px-4 py-10">
      {" "}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/20 blur-3xl rounded-full animate-pulse" />

        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full animate-pulse -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-10 relative">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
relative z-10
w-full
max-w-6xl
backdrop-blur-2xl
bg-white/10
border border-white/20
shadow-[0_0_80px_rgba(0,255,255,0.15)]
rounded-3xl
overflow-hidden
"
        >
          <div className="grid lg:grid-cols-2">
            {/* LEFT */}
            <div
              className="
  hidden lg:flex
  relative
  overflow-hidden
  bg-[#050816]
  p-10
  text-white
  flex-col
  justify-center
  "
            >
              {" "}
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="flex mb-8">
                  {/* <img
                    src="/images/logo-jateng-official.png"
                    alt="Logo"
                    className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]"
                  />
                  <img
                    src="/images/logo-bapenda.png"
                    alt="Logo"
                    className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]"
                  /> */}

                  <img
                    src="/images/footer.svg"
                    alt="Logo"
                    className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]"
                  />

                  <img
                    src="/images/bregada.png"
                    alt="Logo"
                    className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]"
                  />
                </div>

                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  REGISTER WR
                </h1>

                <p className="text-gray-300 mt-4 leading-relaxed">
                  Pendaftaran Wajib Retribusi Jawa Tengah
                </p>

                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Integrasi API SIPENARI</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Keamanan modern</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span>UI modern & smooth</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-6 lg:p-10">
              <AnimatePresence mode="wait">
                {!selectedType ? (
                  <motion.div
                    key="choose"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-3xl font-black text-white mb-2">
                      Pilih Jenis Pendaftaran
                    </h2>

                    <p className="text-gray-500 mb-8">
                      Silahkan pilih jenis wajib retribusi
                    </p>

                    <div className="space-y-5 text-white">
                      <TypeCard
                        title="Perseorangan"
                        desc="Pendaftaran individu"
                        icon={<User className="w-8 h-8" />}
                        onClick={() => {
                          setSelectedType("Perseorangan");
                          setFormData((prev) => ({ ...prev, dokumen: "NIK" })); // Set otomatis ke NIK
                        }}
                      />

                      <TypeCard
                        title="Badan Usaha"
                        desc="Pendaftaran perusahaan"
                        icon={<Building2 className="w-8 h-8" />}
                        onClick={() => {
                          setSelectedType("Badan Usaha");
                          setFormData((prev) => ({ ...prev, dokumen: "NPWP" })); // Set otomatis ke NPWP
                        }}
                      />
                      {/* LINK KE REGISTER */}
                      <div className="mt-6 text-center text-sm text-gray-400">
                        Sudah punya akun?{" "}
                        <a
                          href="/login"
                          className="text-cyan-400 font-bold hover:underline transition-all"
                        >
                          Masuk Sekarang
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <button
                      onClick={() => {
                        setSelectedType("");
                        setShowForm(false);
                      }}
                      className="flex items-center gap-2 text-white font-semibold mb-5 hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Kembali
                    </button>

                    <h2 className="text-3xl font-black text-white mb-2">
                      {selectedType}
                    </h2>

                    <p className="text-white mb-8">
                      Masukkan data wajib retribusi
                    </p>

                    {!showForm && (
                      <div className="space-y-5">
                        <div className="bg-white/5 border border-cyan-400/30 rounded-2xl p-4 text-center">
                          <p className="text-cyan-300 font-semibold text-sm">
                            Anda mendaftar sebagai {selectedType}
                          </p>
                          <p className="text-white font-bold text-lg">
                            Silahkan masukkan{" "}
                            {formData.dokumen === "NIK" ? "NIK" : "NPWP"}
                          </p>
                        </div>

                        <InputIcon
                          label={formData.dokumen === "NIK" ? "NIK" : "NPWP"}
                          icon={<CreditCard className="w-5 h-5" />}
                          name="nik_npwp"
                          value={formData.nik_npwp}
                          onChange={handleChange}
                          placeholder={`Masukkan ${
                            formData.dokumen === "NIK" ? "NIK" : "NPWP"
                          }`}
                        />

                        <button
                          onClick={cekWR}
                          disabled={isChecking}
                          className="
w-full
rounded-2xl
py-4
font-bold
text-lg
bg-gradient-to-r
from-cyan-500
via-blue-600
to-indigo-600
hover:scale-[1.02]
active:scale-[0.98]
transition-all
duration-300
shadow-2xl
shadow-cyan-500/30
"
                        >
                          {isChecking && (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          )}

                          {isChecking ? "Mengecek..." : "Cek Data"}
                        </button>
                      </div>
                    )}

                    {showForm && (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                          </div>
                        )}

                        {/* <SelectDokumen
                          formData={formData}
                          handleChange={handleChange}
                        /> */}

                        <InputIcon
                          label={formData.dokumen === "NIK" ? "NIK" : "NPWP"}
                          icon={<CreditCard className="w-5 h-5" />}
                          name="nik_npwp"
                          value={formData.nik_npwp}
                          onChange={handleChange}
                        />

                        <InputIcon
                          label="Nama"
                          icon={<User className="w-5 h-5" />}
                          name="nama"
                          value={formData.nama}
                          onChange={handleChange}
                        />

                        <div>
                          <label className="text-sm font-semibold text-white mb-2 block">
                            Alamat
                          </label>

                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                            <textarea
                              rows={3}
                              name="alamat"
                              value={formData.alamat}
                              onChange={handleChange}
                              className="
  w-full
  bg-white/10
  border
  border-white/20
  rounded-2xl
  py-4
  pl-12
  pr-4
  text-white
  outline-none
  focus:ring-4
  focus:ring-cyan-400/20
  focus:border-cyan-400
  "
                            />
                          </div>
                        </div>

                        <InputSimple
                          label="Kelurahan"
                          name="kelurahan"
                          value={formData.kelurahan}
                          onChange={handleChange}
                        />

                        <div>
                          <label className="text-sm font-semibold text-white mb-2 block">
                            Provinsi
                          </label>

                          <select
                            name="provinsi"
                            value={formData.provinsi}
                            onChange={handleChange}
                            className="
w-full
bg-white/10
border
border-white/20
rounded-2xl
py-4
px-4
text-black
outline-none
focus:ring-4
focus:ring-cyan-400/20
focus:border-cyan-400
"
                          >
                            <option value="33">Jawa Tengah</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-white mb-2 block">
                            Kota / Kabupaten
                          </label>

                          <div className="relative">
                            {/* <Building className="absolute left-4 top-4 w-5 h-5 text-gray-400" /> */}

                            <select
                              name="kota"
                              value={formData.kota}
                              onChange={handleChange}
                              required
                              className="
w-full
bg-white/10
border
border-white/20
rounded-2xl
py-4
px-4
text-black
outline-none
focus:ring-4
focus:ring-cyan-400/20
focus:border-cyan-400
"
                            >
                              <option className="text-white" value="">
                                Pilih Kota / Kabupaten
                              </option>

                              {Array.isArray(kotaList) &&
                                kotaList.length > 0 &&
                                kotaList.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.text} {/* Perbaikan di sini */}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <InputIcon
                          label="Email"
                          icon={<Mail className="w-5 h-5" />}
                          type="email"
                          name="email_rpp"
                          value={formData.email_rpp}
                          onChange={handleChange}
                        />

                        <InputIcon
                          label="No Telepon"
                          icon={<Phone className="w-5 h-5" />}
                          name="telepon"
                          value={formData.telepon}
                          onChange={handleChange}
                        />

                        <button
                          type="submit"
                          disabled={isSaving}
                          className="
w-full
rounded-2xl
py-4
font-bold
text-lg
bg-gradient-to-r
from-cyan-500
via-blue-600
to-indigo-600
hover:scale-[1.02]
active:scale-[0.98]
transition-all
duration-300
shadow-2xl
shadow-cyan-500/30
disabled:opacity-70
"
                        >
                          {isSaving && (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          )}

                          {isSaving ? "Menyimpan..." : "Simpan Data"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
  );
}

function TypeCard({ title, desc, icon, onClick }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="
      w-full
      relative
      overflow-hidden
      rounded-3xl
      border
      border-cyan-500/20
      bg-white/5
      backdrop-blur-xl
      p-6
      text-left
      hover:border-cyan-400
      hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]
      transition-all
      "
    >
      <div className="flex items-center gap-5">
        <div
          className="
          w-16
          h-16
          rounded-2xl
          bg-gradient-to-br
          from-cyan-500
          to-blue-600
          flex
          items-center
          justify-center
          text-white
          shadow-lg
          "
        >
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>

          <p className="text-gray-400">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}

function SelectDokumen({ formData, handleChange }) {
  return (
    <div>
      <label className="text-sm font-semibold text-white mb-2 block">
        Jenis Dokumen
      </label>

      <select
        name="dokumen"
        value={formData.dokumen}
        onChange={handleChange}
        className="
w-full
bg-white/10
border
border-white/20
rounded-2xl
py-4
px-4
text-white
outline-none
focus:ring-4
focus:ring-cyan-400/20
focus:border-cyan-400
"
      >
        <option value="NIK">NIK</option>

        <option value="NPWP">NPWP</option>
      </select>
    </div>
  );
}

function InputIcon({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300">
          {icon}
        </div>

        <input
          {...props}
          required
          className="
          w-full
          bg-white/10
          border
          border-white/20
          rounded-2xl
          py-4
          pl-12
          pr-4
          outline-none
          text-white
          placeholder:text-gray-400
          focus:ring-4
          focus:ring-cyan-400/20
          focus:border-cyan-400
          transition-all
          "
        />
      </div>
    </div>
  );
}

function InputSimple({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-semibold text-white mb-2 block">
        {label}
      </label>

      <input
        {...props}
        required
        className="w-full rounded-2xl border border-gray-200 py-4 px-4 focus:outline-none focus:ring-4 focus:ring-green-100"
      />
    </div>
  );
}
<style>
  {`
@keyframes float {
  0%,100%{
    transform:translateY(0px);
  }

  50%{
    transform:translateY(-10px);
  }
}

.logo-float{
  animation:float 3s ease-in-out infinite;
}
`}
</style>;
