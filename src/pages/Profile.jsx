import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building2,
  Shield,
  BadgeCheck,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
        {icon}
      </div>

      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-white font-medium break-words">{value || "-"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("wr_session")) || {};

    setUser(session?.user || null);
  }, []);

  if (!user) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-24">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
            <h2 className="text-white text-2xl font-bold text-center">
              Silakan Login Terlebih Dahulu
            </h2>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-950 relative overflow-hidden pt-[120px]">
        {/* GALAXY GLOW */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
          {/* HERO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-3xl
              overflow-hidden
              shadow-2xl
            "
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* FOTO */}
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 opacity-50 blur-2xl rounded-full" />

                  {user?.foto ? (
                    <img
                      src={user.foto}
                      alt={user?.nama}
                      className="
      relative
      w-36
      h-36
      rounded-full
      object-cover
      border-4
      border-white/20
    "
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className={`
    relative
    w-36
    h-36
    rounded-full
    border-4
    border-white/20
    bg-gradient-to-br
    from-purple-600
    via-indigo-600
    to-cyan-500
    flex
    items-center
    justify-center
    text-white
    text-5xl
    font-bold
    shadow-xl
    ${user?.foto ? "hidden" : "flex"}
  `}
                  >
                    {user?.nama?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-2 border-4 border-slate-950">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                </div>

                {/* INFO */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-white">{user.nama}</h1>

                  <p className="text-cyan-300 mt-2">
                    Wajib Retribusi Terdaftar
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl">
                      NPWRD : {user.npwrd || "-"}
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-xl">
                      Terverifikasi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INFO CARD */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* INFORMASI PRIBADI */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-8
              "
            >
              <h2 className="text-xl font-bold text-white mb-8">
                Informasi Pribadi
              </h2>

              <div className="space-y-6">
                <ProfileItem
                  icon={<User size={18} />}
                  label="Nama"
                  value={user.nama}
                />

                <ProfileItem
                  icon={<Mail size={18} />}
                  label="Email"
                  value={user.email}
                />

                <ProfileItem
                  icon={<Phone size={18} />}
                  label="Telepon"
                  value={user.telepon}
                />

                <ProfileItem
                  icon={<MapPin size={18} />}
                  label="Alamat"
                  value={user.alamat}
                />
              </div>
            </motion.div>

            {/* DATA WR */}
            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-8
              "
            >
              <h2 className="text-xl font-bold text-white mb-8">
                Data Wajib Retribusi
              </h2>

              <div className="space-y-6">
                <ProfileItem
                  icon={<CreditCard size={18} />}
                  label="NIK / NPWP"
                  value={user.nik_npwp}
                />

                <ProfileItem
                  icon={<Building2 size={18} />}
                  label="NPWRD"
                  value={user.npwrd}
                />

                <ProfileItem
                  icon={<Shield size={18} />}
                  label="Status"
                  value="Terverifikasi"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
