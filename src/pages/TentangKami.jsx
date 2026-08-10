import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Zap,
  Users,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Swal from "sweetalert2";

const TentangKami = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isExpanded, setIsExpanded] = useState(false);
  // Scroll to section handler
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Alert handler untuk tombol link
  const handleLinkClick = () => {
    Swal.fire({
      title: "Segera Hadir!",
      text: "Platform kami sedang dalam tahap pengembangan. Terima kasih atas antusiasme Anda!",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#003d82",
      background: "#f0f9ff",
      didOpen: (modal) => {
        modal.classList.add("backdrop-blur-md");
      },
    });
  };

  // Contact form handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Terima Kasih!",
      text: "Pesan Anda telah kami terima. Kami akan menghubungi Anda segera.",
      icon: "success",
      confirmButtonText: "Tutup",
      confirmButtonColor: "#003d82",
      background: "#f0f9ff",
    });
    e.target.reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Data fitur unggulan
  const features = [
    {
      id: 1,
      title: "Keamanan Tingkat Enterprise",
      description:
        "Enkripsi end-to-end dengan standar internasional untuk melindungi data Anda. Sistem keamanan berlapis dengan monitoring 24/7.",
      icon: Award,
    },
    {
      id: 2,
      title: "Integrasi Seamless",
      description:
        "Terhubung dengan ratusan aplikasi populer. API yang powerful dan dokumentasi lengkap untuk developer.",
      icon: Zap,
    },
    {
      id: 3,
      title: "Skalabilitas Unlimited",
      description:
        "Grow your business tanpa khawatir tentang kapasitas. Infrastructure yang robust untuk menangani jutaan transaksi.",
      icon: TrendingUp,
    },
    {
      id: 4,
      title: "Kolaborasi Real-Time",
      description:
        "Bekerja bersama tim dengan seamless. Update instant dan komunikasi yang lancar dalam satu platform.",
      icon: Users,
    },
    {
      id: 5,
      title: "Analytics Mendalam",
      description:
        "Dapatkan insight berharga dari data Anda. Dashboard yang customizable dengan visualisasi yang intuitif.",
      icon: TrendingUp,
    },
  ];

  // Data kolaborasi
  const collaborations = [
    { name: "Google Workspace", logo: "🔷" },
    { name: "Microsoft Teams", logo: "📱" },
    { name: "Slack", logo: "💬" },
    { name: "Figma", logo: "🎨" },
    { name: "Notion", logo: "📝" },
    { name: "Zapier", logo: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25"
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -150, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            delay: 5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15"
          animate={{
            x: [0, 80, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
        />
      </div>

      {/* HEADER - Floating */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-4 left-4 right-4 z-50 backdrop-blur-2xl bg-gradient-to-b from-blue-950/60 to-slate-900/30 border border-white/15 shadow-2xl rounded-2xl"
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/images/logopepakraja.png"
                alt="Logo Pepakraja"
                className="w-16 h-16 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-yellow-300 bg-clip-text text-transparent">
                Penak Busiti
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { name: "Tentang Kami", id: "tentang" },
                { name: "Fitur Unggulan", id: "fitur" },
                { name: "Kolaborasi", id: "kolaborasi" },
                { name: "Kontak", id: "kontak" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium hover:text-yellow-300 transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-yellow-300 group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block rounded-lg">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLinkClick}
                className="px-6 py-2  bg-gradient-to-r from-blue-500 to-yellow-400 text-blue-900 font-semibold rounded-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                Mulai Sekarang
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 space-y-3 pb-4"
              >
                {[
                  { name: "Tentang Kami", id: "tentang" },
                  { name: "Fitur Unggulan", id: "fitur" },
                  { name: "Kolaborasi", id: "kolaborasi" },
                  { name: "Kontak", id: "kontak" },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleLinkClick}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-yellow-400 text-blue-900 font-semibold rounded-lg"
                >
                  Mulai Sekarang
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* BODY */}
      <main className="relative pt-32 pb-20">
        {/* HERO SECTION */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2"
        >
          <div className="text-center relative">
            {/* Glow effect behind title */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 top-10 left-1/2 -translate-x-1/2 w-96 h-64 bg-gradient-to-r from-blue-500/30 to-yellow-500/30 rounded-full blur-3xl pointer-events-none"
            />

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl pb-4 font-black mb-8 bg-gradient-to-r from-blue-200 via-yellow-200 to-blue-200 bg-clip-text text-transparent relative z-10 drop-shadow-2xl"
            >
              Selamat Datang di <br /> Penak Busiti
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed relative z-10"
            >
              Platform digital layanan retribusi Daerah Provinsi Jawa Tengah
              yang memberikan kemudahan, transparansi, dan keamanan dalam proses
              pembayaran serta pengelolaan retribusi secara modern.
            </motion.p>
          </div>
        </motion.section>

        {/* TENTANG KAMI SECTION */}
        <motion.section
          id="tentang"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative"
        >
          {/* Section title with gradient underline */}
          <motion.div
            variants={itemVariants}
            className="mb-16 flex items-center gap-4"
          >
            <div className="w-1.5 h-12 bg-gradient-to-b from-blue-400 to-yellow-400 rounded-full" />
            <h2 className="text-5xl md:text-6xl font-black text-white">
              Tentang Kami
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -left-8 top-0 w-1 h-32 bg-gradient-to-b from-yellow-400 to-transparent opacity-50" />
              <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed font-medium">
                Pepak dalam Bahasa Jawa mengandung arti sebuah buku
                panduan/daftar yang lengkap dan Radja merupakan pelafalan lama
                dari kata “raja” sehingga makna dari Pepak Radja adalah sebuah
                panduan lengkap utama yang selalu digunakan oleh raja dalam
                mendapatkan informasi. Pepak Radja sendiri merupakan singkatan
                dari Pelayanan Pajak, Retribusi dan Pemanfaatan Aset Daerah Jawa
                Tengah.
              </p>
              <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed font-medium">
                Istilah “pembeli adalah raja” dirasa sangat tepat diperuntukkan
                kepada Masyarakat, dimana mereka ditempatkan sebagai prioritas
                tertinggi dan harus dilayani sebaik mungkin, dengan tujuan para
                “raja” akan ikut berkontribusi dalam memanfaatkan aset atau jasa
                yang ditawarkan.{" "}
              </p>
              <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed font-medium">
                Aplikasi Penak Busiti sendiri merupakan perangkat lunak berbasis
                web, yang menyediakan daftar/informasi lengkap layanan Pajak dan
                Retribusi Daerah yang disediakan oleh Pemerintah Provinsi Jawa
                Tengah dan dapat dimanfaatkan oleh para “raja”, diakses secara
                online kapanpun dimanapun dengan memanfaatkan jaringan internet
              </p>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed font-medium">
                      Digitalisasi layanan melalui aplikasi Penak Busiti
                      merupakan perwujudan konkret pemerintah Provinsi Jawa
                      Tengah dalam pelayanan publik melalui penerapan terobosan
                      digital untuk menjawab tuntutan masyarakat terhadap
                      pelayanan yang cepat, mudah dan transparan. Sebelum adanya
                      digitalisasi, pengurusan administrasi dalam mendapat
                      pelayanan masyarakat harus mendatangi kantor pelayanan,
                      mengisi beragam formulir, dan menunggu dalam antrean yang
                      menyita waktu. Selain itu, keterbatasan informasi mengenai
                      alur pelayanan birokrasi sering memicu kecurigaan dan
                      membuka ruang terjadinya pungutan liar.
                    </p>
                    <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed font-medium">
                      Melalui Penak Busiti, masyarakat dapat mencari atau
                      mendapatkan informasi layanan birokrasi hingga
                      bertransaksi, dan melakukan pengunduhan dokumen tanpa
                      harus meninggalkan rumah. Pengurangan proses tatap muka
                      dianggap efektif dalam menurunkan potensi penyimpangan
                      karena setiap proses layanan terekam secara digital dan
                      memiliki jejak audit yang jelas. Tidak hanya mempercepat
                      pelayanan, digitalisasi juga meningkatkan akuntabilitas
                      instansi pemerintah, memangkas rantai birokrasi yang
                      berbelit dan meningkatkan kepercayaan masyarakat
                    </p>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed font-medium">
                      Harapannya dengan kemudahan yang diberikan oleh fitur pada
                      aplikasi Penak Busiti, pada akhirnya akan memunculkan
                      dorongan kepada masyarakat untuk berkontribusi dalam
                      pendapatan daerah dengan cara memanfaatkan aset dan jasa
                      yang disediakan pemerintah Provinsi Jawa Tengah sehingga
                      berimbas pula pada peningkatkan Pendapatan Asli Daerah
                      (PAD) Provinsi Jawa Tengah baik dari sektor Retribusi
                      maupun Pajak Daerah.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-yellow-300 hover:text-yellow-400 font-bold transition-all duration-300 mb-8 text-lg"
              >
                {isExpanded ? "Tampilkan Lebih Sedikit" : "Selengkapnya"}
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </motion.button>
            </motion.div>

            {/* Image */}
            <motion.div variants={imageVariants} className="relative group">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"
              />
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/20 rounded-3xl p-12 overflow-hidden group-hover:border-yellow-400/50 transition-all duration-300">
                <motion.div
                  animate={{ y: [0, 30, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="aspect-square bg-gradient-to-br from-blue-600/40 to-yellow-500/30 rounded-2xl flex items-center justify-center text-8xl shadow-2xl"
                >
                  🚀
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ float: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -right-8 text-6xl opacity-60"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ float: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-8 -left-8 text-5xl opacity-60"
              >
                💡
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* FITUR UNGGULAN SECTION */}
        <motion.section
          id="fitur"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative"
        >
          <motion.div
            variants={itemVariants}
            className="mb-20 flex items-center gap-4"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white">
              Fitur Unggulan
            </h2>
            <div className="w-1.5 h-12 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-20 text-center font-medium"
          >
            Temukan keunggulan platform kami yang dirancang khusus untuk
            memaksimalkan produktivitas dan efisiensi bisnis Anda.
          </motion.p>

          <div className="space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isLeft = [0, 2, 4].includes(index);
              const emojis = ["🔐", "🔗", "📈", "👥", "📊"];

              return (
                <motion.div
                  key={feature.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={containerVariants}
                  className={`grid md:grid-cols-2 gap-16 items-center ${!isLeft ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""}`}
                >
                  {/* Text */}
                  <motion.div
                    variants={itemVariants}
                    className="backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/20 rounded-3xl p-10 hover:border-yellow-400/60 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-blue-400/0 group-hover:from-yellow-400/10 group-hover:to-blue-400/10 transition-all duration-300 rounded-3xl" />

                    <div className="relative z-10">
                      <div className="flex items-start gap-5 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg"
                        >
                          <Icon
                            size={32}
                            className="text-slate-950 font-bold"
                          />
                        </motion.div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-blue-100 text-lg leading-relaxed mb-8 font-medium">
                        {feature.description}
                      </p>
                      <motion.button
                        whileHover={{ x: 8, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          Swal.fire({
                            title: feature.title,
                            text: feature.description,
                            icon: "info",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#003d82",
                          });
                        }}
                        className="flex items-center gap-3 text-yellow-300 hover:text-yellow-400 font-bold transition-all duration-300 text-lg"
                      >
                        Selengkapnya
                        <ArrowRight
                          size={22}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Image */}
                  <motion.div
                    variants={imageVariants}
                    className="relative group"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/20 rounded-3xl p-12 overflow-hidden group-hover:border-yellow-400/50 transition-all duration-300">
                      <motion.div
                        animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="aspect-square bg-gradient-to-br from-blue-600/50 to-yellow-500/40 rounded-2xl flex items-center justify-center text-8xl shadow-2xl"
                      >
                        {emojis[index]}
                      </motion.div>
                    </div>

                    {/* Decorative elements */}
                    <motion.div
                      animate={{ float: [0, 25, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-6 -right-6 text-6xl opacity-50"
                    >
                      ✨
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* KOLABORASI SECTION */}
        <motion.section
          id="kolaborasi"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative"
        >
          <motion.div variants={itemVariants} className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-5xl md:text-6xl font-black text-white">
                Kolaborasi Kami
              </h2>
              <div className="w-1.5 h-12 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full" />
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl font-medium">
              Kami bekerja sama dengan platform-platform terkemuka dunia untuk
              memberikan pengalaman terbaik dan terintegrasi kepada klien kami.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {collaborations.map((collab, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.15, rotateZ: 8, y: -15 }}
                whileTap={{ scale: 0.95 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer group hover:border-yellow-400/60 transition-all duration-300 shadow-xl relative overflow-hidden min-h-32"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-blue-400/0 group-hover:from-yellow-400/15 group-hover:to-blue-400/15 transition-all duration-300" />

                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="text-6xl group-hover:scale-150 transition-transform relative z-10"
                >
                  {collab.logo}
                </motion.span>
                <p className="text-sm md:text-base font-bold text-center text-blue-100 group-hover:text-yellow-300 transition-colors relative z-10">
                  {collab.name}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24"
          >
            {[
              { label: "Integrasi Aktif", value: "50+" },
              { label: "Perusahaan Mitra", value: "100+" },
              { label: "Uptime Jaminan", value: "99.9%" },
              { label: "Dukungan 24/7", value: "✓" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-2xl p-6 text-center hover:border-yellow-400/50 transition-all duration-300"
              >
                <p className="text-3xl md:text-4xl font-black text-yellow-300 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-blue-100 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* KONTAK SECTION */}
        <motion.section
          id="kontak"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative"
        >
          <motion.div variants={itemVariants} className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-5xl md:text-6xl font-black text-white">
                Hubungi Kami
              </h2>
              <div className="w-1.5 h-12 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full" />
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl font-medium">
              Kami siap membantu Anda dengan pertanyaan atau kebutuhan apapun.
              Tim support kami tersedia 24/7 untuk memberikan solusi terbaik.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 flex">
            {/* Contact Info */}
            <motion.div variants={containerVariants} className="space-y-8">
              {[
                {
                  icon: MapPin,
                  title: "Alamat",
                  content: "Jl. Teknologi No. 123, Jakarta, Indonesia",
                },
                {
                  icon: Phone,
                  title: "Telepon",
                  content: "+62 (021) 1234-5678",
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: "hello@tentangkami.com",
                },
              ].map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="flex backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/20 rounded-2xl p-8 group hover:border-yellow-400/60 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-blue-400/0 group-hover:from-yellow-400/10 group-hover:to-blue-400/10 transition-all duration-300" />

                    <div className="relative z-10 flex items-start gap-6">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg"
                      >
                        <Icon size={28} className="text-slate-950 font-bold" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-white">
                          {info.title}
                        </h3>
                        <p className="text-blue-100 font-medium text-lg">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-t from-slate-950 via-blue-950/30 to-transparent border-t-2 border-white/10 mt-32 py-20 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8 mb-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-yellow-400 flex items-center justify-center text-slate-950 font-bold text-lg"
                >
                  ✨
                </motion.div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-300 to-yellow-300 bg-clip-text text-transparent">
                  TentangKami
                </span>
              </div>
              <p className="text-blue-200 mb-6 font-medium leading-relaxed">
                Platform digital terdepan untuk transformasi bisnis Anda dengan
                teknologi canggih dan dukungan profesional.
              </p>
              <div className="flex gap-4">
                {["Facebook", "Twitter", "LinkedIn"].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:border-yellow-400/50 hover:bg-white/15 transition-all duration-300 text-sm font-bold text-blue-300 hover:text-yellow-300"
                  >
                    {social.charAt(0)}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            {[
              {
                title: "Produk",
                links: ["Fitur", "Harga", "Dokumentasi", "API"],
              },
              {
                title: "Perusahaan",
                links: ["Tentang", "Blog", "Karir", "Press"],
              },
              {
                title: "Dukungan",
                links: ["Bantuan", "Kontak", "FAQ", "Status"],
              },
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
              >
                <h3 className="font-black text-white mb-5 text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 5 }}
                        className="text-blue-200 hover:text-yellow-300 transition-colors font-medium flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-100 transition-all" />
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mb-8 origin-left"
          />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <p className="text-blue-200 font-medium">
              © 2024 TentangKami. Semua hak dilindungi dengan teknologi terbaik.
            </p>
            <div className="flex gap-8">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ color: "#fcd34d" }}
                    className="text-blue-200 hover:text-yellow-300 transition-colors font-medium text-sm"
                  >
                    {item}
                  </motion.a>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-10 right-10 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 z-40 font-bold text-xl"
        whileHover={{
          scale: 1.15,
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
        }}
        whileTap={{ scale: 0.85 }}
      >
        ↑
      </motion.button>
    </div>
  );
};

export default TentangKami;
