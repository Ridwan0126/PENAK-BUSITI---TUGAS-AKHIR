import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* 1. ANIMATED AMBIENT LIGHT (Background Hidup) */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(255,180,0,0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* 2. GLASS CARD (Mengacu pada gaya image_5a346c.png) */}
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{
              padding: "40px",
              background: "rgba(20, 20, 25, 0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "32px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "300px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* 3. FLOATING LOGO */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <img
                src="/images/footer.svg"
                alt="Logo"
                style={{ width: "120px", height: "auto", marginBottom: "24px" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <h1
                style={{
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                }}
              >
                PENAK BUSITI
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "12px",
                  marginBottom: "32px",
                }}
              >
                Marketplace Retribusi & Pajak
              </p>
            </motion.div>

            {/* 4. PROGRESS BAR DENGAN GLOW */}
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  onComplete: () => setIsVisible(false),
                }}
                onAnimationComplete={() => setTimeout(onFinish, 500)}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #ffb400, #f59e0b)",
                  boxShadow: "0 0 10px rgba(255,180,0,0.5)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
