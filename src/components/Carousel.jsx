import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Carousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(0); // -1 untuk kiri, 1 untuk kanan
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timerRef = useRef(null);

  const minSwipeDistance = 50;

  // Variasi Animasi dengan transisi interpolation melengkung (Fluid Slider Motion)
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      next();
    }
    if (distance < -minSwipeDistance) {
      prev();
    }
  };

  useEffect(() => {
    if (!autoplay || slides.length === 0) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [autoplay, slides.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoplay(false);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    setAutoplay(false);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full aspect-[4/1] bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden group font-sans antialiased"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slider Core Container */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", mass: 0.6, stiffness: 140, damping: 24 },
              opacity: { duration: 0.35, ease: "easeInOut" },
              filter: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-between"
          >
            {/* CONTAINER GAMBAR UTAMA */}
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src={slides[current].backgroundImage}
                alt=""
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
              />
              {/* GRADASI HALUS */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent pointer-events-none" />
            </div>

            {/* CONTENT OVERLAY CONTAINER */}
            <div className="relative z-10 w-full h-full flex items-center justify-between px-12 md:px-24 select-none">
              {/* SISI KIRI: Detail Teks Informasi Bertema SF Pro Apple */}
              <div className="max-w-md lg:max-w-xl flex flex-col items-start text-left">
                {/* Badge Pills Kapsul */}
                <div className="inline-block px-3 py-1 bg-white/80 border border-white rounded-full mb-3 shadow-sm">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-blue-600 font-sans">
                    {slides[current].badge}
                  </p>
                </div>

                {/* Judul Utama Pro-Display */}
                <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 font-sans">
                  {slides[current].title}
                </h2>

                {/* Deskripsi */}
                <p className="text-slate-600 text-[11px] md:text-sm font-medium leading-relaxed line-clamp-2 mb-5 font-sans tracking-wide">
                  {slides[current].description}
                </p>

                {/* Tombol Aksi Khas App Store */}
                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 font-sans tracking-wide">
                  {slides[current].cta || "Mulai Jelajah"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SISI KANAN: Visual Ilustrasi Produk Terapung */}
              {/* <div className="hidden md:flex items-center justify-center h-full py-6 z-10 pr-4">
                <motion.img
                  key={`carousel-img-${current}`}
                  initial={{ scale: 0.85, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.85, opacity: 0, x: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 20,
                    delay: 0.08,
                  }}
                  src={slides[current].image}
                  // alt={slides[current].title}
                  className="h-full max-h-[160px] lg:max-h-[200px] object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                />
              </div> */}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigasi Kiri (iOS Light Blur System) */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-800 active:scale-90 border border-white/50 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-250"
      >
        <ChevronLeft className="w-4 h-4 stroke-[3]" />
      </button>

      {/* Navigasi Kanan (iOS Light Blur System) */}
      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-800 active:scale-90 border border-white/50 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-250"
      >
        <ChevronRight className="w-4 h-4 stroke-[3]" />
      </button>

      {/* Indikator Halaman (iOS Pill Style Dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1.5 rounded-full bg-gray-900/10 backdrop-blur-md border border-white/20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > current ? 1 : -1);
              setCurrent(idx);
              setAutoplay(false);
            }}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              idx === current
                ? "w-5 bg-slate-800 shadow-sm"
                : "w-1.5 bg-slate-500/40 hover:bg-slate-600"
            }`}
            aria-label={`Buka slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
