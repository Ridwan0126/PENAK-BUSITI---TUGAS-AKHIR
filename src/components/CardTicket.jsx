import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CardTicket({ fotos = [] }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timerRef = useRef(null);

  // Mengambil status dari data foto saat ini
  const isComing = fotos[current]?.status === "coming";

  const minSwipeDistance = 50;

  // ... (simpan fungsi onTouchStart, onTouchMove, onTouchEnd, useEffect, prev, next seperti sebelumnya)

  if (!fotos || fotos.length === 0) return null;

  return (
    <div className="relative w-full aspect-[1024/123] bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden group font-sans antialiased">
      <a href="/ticket" className="block w-full h-full relative">
        <img
          src={fotos[current].backgroundImage}
          alt=""
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
        />

        {/* Overlay Coming Soon yang muncul saat hover */}
        {isComing && (
          <div className="absolute inset-0 bg-hite-300/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <div className="px-4 py-1.5 mr-4 rounded-full bg-white border border-gray-200/60 shadow-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <span className="text-xs font-black text-blue-500 tracking-tight font-sans uppercase">
                Jelajahi Sekarang
              </span>
            </div>
          </div>
        )}
      </a>
    </div>
  );
}
