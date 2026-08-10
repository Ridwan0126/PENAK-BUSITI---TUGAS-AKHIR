"use client";

import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Search,
  MapPin,
  Building2,
  Wallet,
  XCircle,
  ArrowRight,
  User,
  Bell,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // =========================
  // REF
  // =========================
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // =========================
  // STATE
  // =========================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [activeCategory, setActiveCategory] = useState("Tanah");

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [search, setSearch] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // PROFILE & NOTIFICATION
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // DETAIL
  const [selectedDetail, setSelectedDetail] = useState(null);

  // GALLERY
  const [activeImage, setActiveImage] = useState("");

  // AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const notifications = [
    {
      id: 1,
      type: "password",
      title: "Reset Password Berhasil",
      desc: "Keamanan akun Anda diperbarui. Silakan gunakan password baru.",
      time: "10 Menit lalu",
      icon: <KeyRound className="w-4 h-4 text-amber-500" />,
      bg: "bg-amber-500/10",
    },
    {
      id: 2,
      type: "payment",
      title: "Pembayaran Sukses",
      desc: "Transaksi pembayaran SKRD Nomor #29402 telah berhasil diverifikasi.",
      time: "2 Jam lalu",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      bg: "bg-emerald-500/10",
    },
    {
      id: 3,
      type: "warning",
      title: "Keterlambatan Bayar",
      desc: "Pemberitahuan: Masa berlaku sewa Gedung Aula tersisa 3 hari lagi.",
      time: "1 Hari lalu",
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      bg: "bg-rose-500/10",
    },
    {
      id: 4,
      type: "product",
      title: "Objek Retribusi Baru",
      desc: "Dinas Kelautan menambahkan Lahan Kios Terminal baru di area pesisir.",
      time: "3 Hari lalu",
      icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      bg: "bg-blue-500/10",
    },
  ];

  useEffect(() => {
    checkSession();
  }, []);
  useEffect(() => {
    if (selectedDetail) {
      setSearchOpen(false);
    }
  }, [selectedDetail]);

  const checkSession = () => {
    const session = localStorage.getItem("wr_session");
    if (!session) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const parsed = JSON.parse(session);
      if (Date.now() > parsed.expiredAt) {
        localStorage.removeItem("wr_session");
        localStorage.removeItem("wr_user_header");
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      setIsAuthenticated(true);
      setUser(parsed.user);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("wr_session");
      localStorage.removeItem("wr_user_header");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wr_session");
    localStorage.removeItem("wr_user_header");
    setIsAuthenticated(false);
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search.trim()) {
        handleSearch(search);
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  const getAllPhotos = (item) => {
    const photos = [];
    if (item?.foto) photos.push(item.foto);
    if (item?.foto2) photos.push(item.foto2);
    if (item?.foto3) photos.push(item.foto3);
    if (item?.foto4) photos.push(item.foto4);
    return [...new Set(photos)];
  };

  const handleSearch = async (
    keywordSearch = search,
    pageNumber = 1,
    isLoadMore = false
  ) => {
    try {
      const keyword = keywordSearch.toLowerCase().trim();
      if (!keyword) return;

      if (!isLoadMore) {
        setLastSearch(keywordSearch);
        setLoadingSearch(true);
        setSearchResults([]);
        setPage(1);
      } else {
        setIsFetchingMore(true);
      }

      setSearchOpen(true);

      const response = await fetch(
        `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/obyek?page=${pageNumber}&limit=20&search=${encodeURIComponent(
          keyword
        )}`
      );

      const result = await response.json();
      const apiData = result?.data || [];

      setHasMore(apiData.length === 20);

      if (isLoadMore) {
        setSearchResults((prev) => [...prev, ...apiData]);
      } else {
        setSearchResults(apiData);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    } finally {
      setLoadingSearch(false);
      setIsFetchingMore(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(lastSearch, nextPage, true);
  };

  const menuData = {
    home: {
      categories: {
        Tanah: [
          { title: "Sewa Tanah", path: "/tanah/sewa-tanah" },
          {
            title: "Bangunan Semi Permanen",
            path: "/tanah/bangunan-semi-permanen",
          },
          { title: "Jalan Masuk", path: "/tanah/jalan-masuk" },
        ],
        Bangunan: [
          { title: "Lantai Jemur", path: "/bangunan/lantai-jemur" },
          { title: "Rumah Dinas", path: "/bangunan/rumah-dinas" },
          { title: "Sewa Gedung", path: "/bangunan/sewa-gedung" },
        ],
        "Tanah Bangunan": [
          { title: "Sewa Lahan", path: "/tanah-bangunan/sewa-lahan" },
          { title: "Tegalan", path: "/tanah-bangunan/tegalan" },
          { title: "Jembatan", path: "/tanah-bangunan/jembatan" },
          { title: "Warung", path: "/tanah-bangunan/warung" },
        ],
        "Gedung Pertemuan": [
          { title: "Aula Sekolah", path: "/gedung-pertemuan/aula-sekolah" },
          { title: "Aula", path: "/gedung-pertemuan/aula" },
          {
            title: "Ruang Pertemuan",
            path: "/gedung-pertemuan/ruang-pertemuan",
          },
          { title: "Sewa Gedung", path: "/gedung-pertemuan/sewa-gedung" },
        ],
        "Lahan Iklan": [
          { title: "Reklame", path: "/lahan-iklan/reklame" },
          {
            title: "Lahan Tiang Reklame",
            path: "/lahan-iklan/lahan-tiang-reklame",
          },
          {
            title: "Pemasangan Media Promosi",
            path: "/lahan-iklan/pemasangan-media-promosi",
          },
        ],
        "Kios / Los": [
          { title: "Kios Terminal", path: "/kios-los/kios-terminal" },
          { title: "Los BPSPP", path: "/kios-los/los-bpspp" },
        ],
        "Lain-lain": [
          {
            title: "Produksi Perkebunan",
            path: "/lain-lain/produksi-perkebunan",
          },
          { title: "Sayur-sayuran", path: "/lain-lain/sayur-sayuran" },
          { title: "Kalibrasi Alat", path: "/lain-lain/kalibrasi-alat" },
          { title: "Pemakaian Ruang", path: "/lain-lain/pemakaian-ruang" },
          { title: "Pengujian", path: "/lain-lain/pengujian" },
        ],
      },
    },
    penetapan: {
      items: [
        { title: "SKRD", path: "/skrd" },
        { title: "Pembayaran", path: "/Transactions" },
      ],
    },
    tiketonline: {
      items: [{ title: "Pariwisata", path: "/ticket" }],
    },
  };

  const topMenus = [
    { key: "home", label: "Kategori" },
    ...(isAuthenticated ? [{ key: "penetapan", label: "Penetapan" }] : []),
    { key: "tiketonline", label: "Tiket Online" },
  ];

  return (
    <div className="font-sans antialiased tracking-tight">
      <div className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6 md:px-6">
        <div className="max-w-7xl mx-auto">
          <header className="rounded-[24px] sm:rounded-[28px] border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-visible hover:border-gray-300 transition-all duration-300">
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <button
                    className="md:hidden p-2 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? (
                      <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
                    ) : (
                      <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
                    )}
                  </button>

                  <Link
                    to="/"
                    className="flex items-center gap-2 sm:gap-3 group relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center justify-center"
                    >
                      <img
                        src="/images/logo.svg"
                        alt="Logo"
                        className="h-10 sm:h-12 w-auto object-contain"
                      />
                      <div className="hidden ml-2 p-2 rounded-lg sm:flex flex-col leading-tight relative h-10 w-[120px]">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={showTooltip ? "beranda" : "pepak"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute left-2 text-sm sm:text-base md:text-lg font-bold text-slate-800 whitespace-nowrap"
                          >
                            {showTooltip ? "BERANDA" : "PENAK BUSITI"}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </Link>

                  {/* NAV MENU BUTTON LEVEL 1 */}
                  <div className="relative hidden md:block z-[10001]">
                    <button
                      onClick={() => setShowCategory(!showCategory)}
                      className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-slate-800 font-semibold transition-all duration-200"
                    >
                      Menu
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${
                          showCategory ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {showCategory && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute mt-4 left-0 w-[min(calc(100vw-24px),950px)] overflow-hidden rounded-[28px] border border-white/60 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
                        >
                          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/20 bg-white/10">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              {topMenus.map((menu) => (
                                <button
                                  key={menu.key}
                                  onClick={() => setActiveMenu(menu.key)}
                                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide transition-all duration-200 ${
                                    activeMenu === menu.key
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                      : "bg-black/5 hover:bg-black/10 text-slate-800"
                                  }`}
                                >
                                  {menu.label}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => setShowCategory(false)}
                              className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/15 flex items-center justify-center transition-all"
                              title="Tutup Menu"
                            >
                              <X className="w-4 h-4 text-slate-700" />
                            </button>
                          </div>

                          <div
                            className={`grid ${
                              activeMenu === "home"
                                ? "grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr]"
                                : "grid-cols-1"
                            }`}
                          >
                            {activeMenu === "home" && (
                              <div className="bg-black/5 border-r border-gray-200/10 p-4 h-auto sm:h-[400px] md:h-[430px] overflow-y-auto space-y-1">
                                {Object.keys(menuData.home.categories).map(
                                  (item, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setActiveCategory(item)}
                                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-xs font-black tracking-tight ${
                                        activeCategory === item
                                          ? "bg-white/80 text-blue-600 shadow-sm border border-white/40"
                                          : "text-slate-800 hover:bg-white/40"
                                      }`}
                                    >
                                      {item}
                                    </button>
                                  )
                                )}
                              </div>
                            )}

                            <div className="p-4 h-auto sm:h-[400px] md:h-[430px] overflow-y-auto bg-white/5">
                              <div
                                className={`grid gap-3 ${
                                  activeMenu === "home"
                                    ? "grid-cols-1 sm:grid-cols-2"
                                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                                }`}
                              >
                                {(activeMenu === "home"
                                  ? menuData.home.categories[activeCategory]
                                  : menuData[activeMenu]?.items || []
                                ).map((item, index) => (
                                  <Link
                                    key={index}
                                    to={item.path || "/"}
                                    onClick={() => setShowCategory(false)}
                                  >
                                    <motion.div
                                      whileHover={{
                                        y: -2,
                                        scale: 1.01,
                                      }}
                                      className="group flex items-center justify-between px-5 py-4 rounded-xl border border-white/40 bg-white/30 hover:bg-white/60 text-slate-900 hover:border-blue-500/40 shadow-sm transition-all duration-200 backdrop-blur-md"
                                    >
                                      <span className="font-extrabold text-xs text-slate-900 tracking-tight font-sans">
                                        {item.title}
                                      </span>
                                      <div className="w-6 h-6 rounded-full bg-black/5 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                                        <ChevronDown className="-rotate-90 w-3 h-3 text-slate-600 group-hover:text-white" />
                                      </div>
                                    </motion.div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SISI TENGAH (INPUT FORM SEARCH BAR - Diubah agar tampil juga di Mobile/Tablet) */}
                <div ref={searchRef} className="flex flex-1 relative max-w-md mx-2">
                  <div className="relative w-full">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => {
                        setShowCategory(false);
                        if (search.trim()) {
                          setSearchOpen(true);
                        }
                      }}
                      placeholder="Cari layanan/retribusi..."
                      className="w-full pl-9 sm:pl-12 pr-20 sm:pr-32 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      onClick={() => {
                        setShowCategory(false);
                        handleSearch(search);
                      }}
                      className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 text-xs sm:text-sm font-semibold transition-all duration-200 z-10"
                    >
                      Cari
                    </button>
                    {search && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setLastSearch("");
                          setSearchResults([]);
                          setSearchOpen(false);
                          setSelectedDetail(null);
                        }}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 transition-all duration-200"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* SISI KANAN (LOGIN/REGISTER ATAU PROFILE/NOTIF) */}
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      {/* PROFILE AREA */}
                      <div ref={profileRef} className="relative">
                        <button
                          onClick={() => {
                            setShowCategory(false);
                            setNotifOpen(false);
                            setProfileOpen(!profileOpen);
                          }}
                          className="flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-lg md:rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                        >
                          <div className="w-7 h-7 sm:w-8 md:h-10 rounded-lg md:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {user?.nama?.charAt(0) || "U"}
                          </div>
                          <div className="text-left hidden md:block">
                            <p className="font-semibold text-xs md:text-sm text-slate-800">
                              {user?.nama || "User"}
                            </p>
                            <p className="text-xs text-slate-400">Profile</p>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-all duration-200 ${
                              profileOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {profileOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/50 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden z-[99999]"
                            >
                              <div className="p-4 border-b border-gray-200/30 bg-white/30">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold">
                                    {user?.nama?.charAt(0) || "U"}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-800 text-sm">
                                      {user?.nama || "User"}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                      {user?.email || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2 space-y-1">
                                <button
                                  onClick={() => {
                                    navigate("/profile");
                                    setProfileOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900/5 text-slate-700 transition-colors text-xs font-bold"
                                >
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm">Profile</span>
                                </button>
                                <button
                                  onClick={() => {
                                    navigate("/lupapassword");
                                    setProfileOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900/5 text-slate-700 transition-colors text-xs font-bold"
                                >
                                  <KeyRound className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm">Ganti Password</span>
                                </button>
                                <button
                                  onClick={handleLogout}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-xs font-bold"
                                >
                                  <LogOut className="w-4 h-4 text-red-400" />
                                  <span className="text-sm">Logout</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* NOTIFICATION */}
                      {/* <div ref={notifRef} className="relative">
                        <button
                          onClick={() => {
                            setShowCategory(false);
                            setProfileOpen(false);
                            setNotifOpen(!notifOpen);
                          }}
                          className={`relative p-2.5 rounded-lg md:rounded-2xl border border-gray-200 transition-all duration-200 shadow-sm ${
                            notifOpen
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-gray-50 hover:bg-gray-100 text-slate-700"
                          }`}
                          title="Notifikasi"
                        >
                          <Bell className="w-5 h-5" />
                          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                        </button>

                        <AnimatePresence>
                          {notifOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute right-0 mt-3 w-[300px] sm:w-[360px] rounded-2xl border border-white/50 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden z-[99999]"
                            >
                              <div className="px-4 py-3 border-b border-gray-200/30 bg-white/40 flex justify-between items-center">
                                <h3 className="font-extrabold text-xs text-slate-900 tracking-wider uppercase">
                                  Pemberitahuan Baru
                                </h3>
                                <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                                  {notifications.length} Info
                                </span>
                              </div>

                              <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100/50">
                                {notifications.map((notif) => (
                                  <div
                                    key={notif.id}
                                    className="p-3.5 hover:bg-slate-900/5 transition-colors cursor-pointer flex gap-3 items-start"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-xl ${notif.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                    >
                                      {notif.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-bold text-xs text-slate-900 leading-snug tracking-tight">
                                        {notif.title}
                                      </h4>
                                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-medium line-clamp-2">
                                        {notif.desc}
                                      </p>
                                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase">
                                        {notif.time}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="p-2 border-t border-gray-200/30 bg-white/40 text-center">
                                <button
                                  onClick={() => {
                                    setNotifOpen(false);
                                    navigate("/notifications");
                                  }}
                                  className="w-full py-1.5 text-[11px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                                >
                                  Lihat Semua Notifikasi
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div> */}
                    </div>
                  ) : (
                    /* Tombol Masuk/Daftar diubah agar selalu tampil di semua ukuran layar (menghapus kelas `hidden md:flex`) */
                    <div className="flex gap-1.5 sm:gap-2">
                      <Link
                        to="/login"
                        onClick={() => setShowCategory(false)}
                        className="px-3 sm:px-4 py-2 rounded-lg md:rounded-2xl border border-gray-200 bg-gray-50 text-slate-700 hover:bg-gray-100 transition-all duration-200 font-semibold text-xs sm:text-sm shadow-sm"
                      >
                        Masuk
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setShowCategory(false)}
                        className="px-3 sm:px-4 py-2 rounded-lg md:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-xs sm:text-sm"
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          {/* MOBILE TOGGLE DRAWER DROPDOWN */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-3 rounded-[24px] border border-white/50 bg-white/30 backdrop-blur-2xl backdrop-saturate-150 shadow-lg overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200/10 bg-white/10 flex-wrap">
                  {topMenus.map((menu) => (
                    <button
                      key={menu.key}
                      onClick={() => setActiveMenu(menu.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeMenu === menu.key
                          ? "bg-blue-600 text-white"
                          : "bg-black/5 text-slate-800"
                      }`}
                    >
                      {menu.label}
                    </button>
                  ))}
                </div>

                <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto bg-white/5">
                  {activeMenu === "home" ? (
                    <>
                      <div className="flex gap-1 overflow-x-auto pb-2 border-b border-gray-200/10">
                        {Object.keys(menuData.home.categories).map(
                          (category, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveCategory(category)}
                              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                activeCategory === category
                                  ? "bg-white/80 text-blue-600 shadow-sm border border-white/20"
                                  : "text-slate-800 hover:bg-white/40"
                              }`}
                            >
                              {category}
                            </button>
                          ),
                        )}
                      </div>

                      <div className="space-y-1.5 pt-1.5">
                        {menuData.home.categories[activeCategory]?.map(
                          (item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <motion.div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/30 bg-white/40 text-slate-900 text-xs font-extrabold shadow-sm">
                                <span>{item.title}</span>
                                <ChevronDown className="-rotate-90 w-3.5 h-3.5 text-slate-500" />
                              </motion.div>
                            </Link>
                          ),
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      {menuData[activeMenu]?.items?.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <motion.div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/30 bg-white/40 text-slate-900 text-xs font-extrabold shadow-sm">
                            <span>{item.title}</span>
                            <ChevronDown className="-rotate-90 w-3.5 h-3.5 text-slate-500" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DROPDOWN SEARCH LIST PANEL */}
          <AnimatePresence>
            {searchOpen && !selectedDetail && search.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 mt-4 z-[99999] pt-[100px] pb-6 animate-none"
              >
                <div className="max-w-7xl mx-auto px-4 h-full">
                  <div className="h-full rounded-[28px] border border-white/60 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_30px_60px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200/20 bg-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                            Hasil Pencarian Objek
                          </h2>
                          <p className="text-[11px] text-slate-500 font-bold tracking-wide uppercase mt-0.5">
                            {searchResults.length} Data Retribusi Ditemukan
                          </p>
                        </div>
                        {!loadingSearch &&
                          searchResults.length > 0 &&
                          hasMore && (
                            <div className="p-4 text-center">
                              <button
                                onClick={loadMore}
                                disabled={isFetchingMore}
                                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                              >
                                {isFetchingMore
                                  ? "Memuat..."
                                  : "Tampilkan Lebih Banyak"}
                              </button>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-white/5">
                      {!loadingSearch && searchResults.length === 0 ? (
                        <div className="py-20 text-center">
                          <p className="text-slate-500 font-medium text-xs tracking-wide">
                            Tidak ada objek retribusi yang cocok.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {searchResults.map((item, index) => {
                            const photo =
                              item?.foto ||
                              item?.foto_2 ||
                              item?.foto_3 ||
                              item?.foto_4 ||
                              null;

                            return (
                              <motion.div
                                key={`${item.id}-${index}`}
                                whileHover={{ y: -3, scale: 1.005 }}
                                onClick={() => {
                                  setSelectedDetail(item);
                                  setActiveImage(photo);
                                  setSearchOpen(false);
                                }}
                                className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/40 bg-white/40 hover:bg-white/60 hover:border-blue-500/40 shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-md"
                              >
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 flex-shrink-0">
                                  {photo ? (
                                    <img
                                      src={`https://rpp.bapenda.jatengprov.go.id/penatausahaan/storage/${photo}`}
                                      alt="foto"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                                      <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate tracking-tight font-sans">
                                    {item?.obyek_retribusi}
                                  </h3>
                                  <p className="text-[10px] text-blue-600 font-bold truncate uppercase mt-0.5">
                                    {item?.opd?.nama || "-"}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600 font-medium">
                                    <div className="flex items-center gap-0.5 truncate max-w-[50%]">
                                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                      <span className="truncate">
                                        {item?.kota?.kab_kota || "-"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-emerald-600 font-bold flex-shrink-0">
                                      <Wallet className="w-3 h-3 text-emerald-500" />
                                      Rp{" "}
                                      {Number(
                                        item?.tariftbl?.tarif || 0,
                                      ).toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEARCH DETAIL MODAL POPUP */}
          <AnimatePresence>
            {selectedDetail && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.99 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 mt-4 z-[99999] pt-[100px] pb-6"
              >
                <div className="max-w-7xl mx-auto px-4 h-full">
                  <div className="h-full rounded-[28px] border border-white/60 bg-white/30 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_30px_60px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200/20 bg-white/20 flex items-center justify-between">
                      <div>
                        <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                          Rincian Objek Retribusi
                        </h2>
                        <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight mt-0.5 line-clamp-1 max-w-[90%] font-sans">
                          {selectedDetail?.obyek_retribusi}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDetail(null);
                          setSearchOpen(true);
                        }}
                        className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white/5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        <div className="flex flex-col border-r border-gray-200/20 bg-black/5">
                          <div className="h-[320px] sm:h-[380px] bg-slate-900 flex items-center justify-center overflow-hidden">
                            {activeImage ? (
                              <img
                                src={`https://rpp.bapenda.jatengprov.go.id/penatausahaan/storage/${activeImage}`}
                                alt="detail"
                                className="w-full h-full object-cover brightness-95"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                                <Building2 className="w-16 h-16 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="p-4 flex gap-2.5 overflow-x-auto border-t border-gray-200/20">
                            {getAllPhotos(selectedDetail).map((photo, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveImage(photo)}
                                className={`min-w-[85px] sm:min-w-[100px] h-[60px] sm:h-[70px] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                  activeImage === photo
                                    ? "border-blue-500 shadow-sm"
                                    : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                              >
                                <img
                                  src={`https://rpp.bapenda.jatengprov.go.id/penatausahaan/storage/${photo}`}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between h-full bg-white/20">
                          <div className="p-5 sm:p-6 space-y-5">
                            <div>
                              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug font-sans">
                                {selectedDetail?.obyek_retribusi}
                              </h1>
                              <p className="text-xs text-slate-500 font-bold tracking-wide mt-1 uppercase">
                                {selectedDetail?.kota?.kab_kota || "-"}
                              </p>
                            </div>

                            <div className="bg-blue-50/50 border border-blue-100/30 p-4 rounded-2xl backdrop-blur-sm">
                              <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mb-0.5">
                                Tarif Sewa Objek
                              </p>
                              <p className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight font-sans">
                                Rp{" "}
                                {Number(
                                  selectedDetail?.tariftbl?.tarif || 0,
                                ).toLocaleString("id-ID")}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="border border-white/30 rounded-xl p-3 bg-white/40 backdrop-blur-sm">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                                  OPD Pengelola
                                </p>
                                <p className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug font-sans">
                                  {selectedDetail?.opd?.nama || "-"}
                                </p>
                              </div>

                              <div className="border border-white/30 rounded-xl p-3 bg-white/40 backdrop-blur-sm">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                                  UPPD Wilayah
                                </p>
                                <p className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug font-sans">
                                  {selectedDetail?.uppd?.nama || "-"}
                                </p>
                              </div>

                              <div className="border border-white/30 rounded-xl p-3 bg-white/40 backdrop-blur-sm">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                                  Klasifikasi Jenis
                                </p>
                                <p className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug font-sans">
                                  {selectedDetail?.jenis?.jenis_retribusi ||
                                    "-"}
                                </p>
                              </div>

                              <div className="border border-white/30 rounded-xl p-3 bg-white/40 backdrop-blur-sm">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                                  Alamat Lokasi
                                </p>
                                <p className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug line-clamp-2 font-sans">
                                  {selectedDetail?.alamat || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 sm:p-5 border-t border-gray-200/20 bg-white/30 backdrop-blur-md">
                            <button
                              onClick={() => {
                                setSearchOpen(false);
                                setSelectedDetail(null);
                                setSearch("");
                                navigate(`/products/${selectedDetail?.id}`);
                              }}
                              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-sans"
                            >
                              Buka Selengkapnya
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}