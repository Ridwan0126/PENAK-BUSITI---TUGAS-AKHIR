import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import QuickServices from "../components/QuickServices";
import ProductFilter from "../components/ProductFilter";
import ProductGrid from "../components/ProductGrid";
import CardTicket from "../components/CardTicket";

export default function Home() {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const slides = [
    {
      badge: "Layanan Digital",
      title: "PENAK BUSITI",
      description:
        "Pelayanan Pajak, Retribusi dan Aset Daerah Provinsi Jawa Tengah",
      cta: "Pelajari",
      backgroundImage: "/images/MONGKRANG.svg",
      image: "/images/hero1.png",
    },
    {
      badge: "Retribusi Online",
      title: "Mudah & Cepat",
      description: "Lakukan pembayaran dan monitoring retribusi kapan saja.",
      cta: "Mulai Sekarang",
      backgroundImage: "/images/banner-02.svg",
      image: "/images/hero2.png",
    },
  ];
  const fotos = [
    {
      badge: "Layanan Digital",
      title: "PENAK BUSITI",
      description:
        "Pelayanan Pajak, Retribusi dan Aset Daerah Provinsi Jawa Tengah",
      cta: "Pelajari",
      backgroundImage: "/images/tiketbox.svg",
      image: "/images/tiketbox.svg",

      status: "coming",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 isolate relative overflow-x-hidden font-sans antialiased selection:bg-blue-500/20">
      {/* Header Tetap Berada di Atas */}
      <Header />

      {/* Carousel Slider Section - iOS Clean Spacing */}
      <section className="relative z-10 pt-28 md:pt-30 px-4 pb-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <Carousel slides={slides} />
        </div>
      </section>

      <section className="relative z-10 rounded-lg px-4 bg-transparent">
        <div className="max-w-7xl  mx-auto ">
          <CardTicket fotos={fotos} />
        </div>
      </section>

      {/* Main Content Products Section */}
      <section className="relative z-10 py-6 md:py-6 px-4 bg-transparent">
        <div className="max-w-7xl mx-auto">
          {/* iOS Styled Section Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-1 animate-slide-in-down">
              Jelajahi Produk & Layanan
            </h2>
            <p
              className="text-xs md:text-sm font-semibold text-slate-500 tracking-tight"
              style={{ animationDelay: "100ms" }}
            >
              Temukan semua kebutuhan pajak dan retribusi Anda di satu tempat
              secara instan
            </p>
          </div>

          {/* DIUBAH: Menggunakan bg-slate-900/10 (kaca agak gelap) untuk pembeda kontras yang elegan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-5 md:p-6 mb-10 bg-slate-900/10 border border-white/80 backdrop-blur-3xl backdrop-saturate-150 rounded-[28px] shadow-[0_12px_40px_rgba(15,23,42,0.04)] items-start overflow-visible relative z-30">
            <div className="w-full ">
              <QuickServices />
            </div>

            {/* overflow-visible agar popover dropdown filter melayang bebas ke atas grid produk */}
            <div className="w-full overflow-visible">
              <ProductFilter
                onFilterChange={setFilters}
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="relative z-10">
            <ProductGrid filters={filters} searchTerm={searchTerm} />
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <div className="relative z-10 border-t border-gray-200/50">
        <Footer />
      </div>
    </div>
  );
}
