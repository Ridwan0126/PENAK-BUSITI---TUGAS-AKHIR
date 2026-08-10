import { Search, Sliders, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFilterData } from "../hooks/useFilterData";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductFilter({ onFilterChange, onSearch }) {
  const [activeTab, setActiveTab] = useState("obyek"); // State filter lokal di dalam komponen sebelum tombol "Terapkan Filter" diklik

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    manager: "",
    serviceType: "",
    is_laku: "",
    limit: 500,
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { cities, managers, services, loading } = useFilterData(); // State untuk melacak dropdown mana yang sedang terbuka (Desktop)

  const [openDropdown, setOpenDropdown] = useState(null); // Ref untuk mendeteksi klik di luar komponen dropdown

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, limit: 500 }));
    setOpenDropdown(null);
  }; // Memastikan data filter dikirim dengan benar ke induk pembungkus (ProductGrid) saat tombol diklik

  const handleApplyFilter = () => {
    onFilterChange?.(filters);
    setShowMobileFilter(false);
  };

  const handleReset = () => {
    const emptyFilters = {
      search: "",
      city: "",
      manager: "",
      serviceType: "",
      is_laku: "",
      limit: 500,
    };
    setFilters(emptyFilters);
    setOpenDropdown(null);
    onFilterChange?.(emptyFilters);
  };

  const tabs = [
    { id: "obyek", label: "Obyek", color: "emerald" },
    { id: "bukti", label: "Bukti Bayar", color: "amber" },
  ]; // Opsi status murni menggunakan Boolean (true/false) dan string kosong ("")

  const statusOptions = [
    { value: "", name: "Keseluruhan" },
    { value: true, name: "Tersewa" },
    { value: false, name: "Belum Tersewa" },
  ]; // DIPERBAIKI: Pengecekan tipe data yang aman terhadap boolean murni (true / false)

  const getSelectedLabel = (key, list, placeholder) => {
    const selectedValue = filters[key]; // Jika nilainya murni string kosong, undefined, atau null, kembalikan placeholder

    if (
      selectedValue === "" ||
      selectedValue === undefined ||
      selectedValue === null
    ) {
      return placeholder;
    } // Melakukan pencarian dengan konversi String yang aman untuk membandingkan ID atau Value objek API

    const found = list.find((item) => {
      const itemVal = item.value !== undefined ? item.value : item.id;
      return String(itemVal) === String(selectedValue);
    });

    return found ? found.name : placeholder;
  }; // Gaya scrollbar kustom transparan ala iOS agar tidak merusak rounded container kaca

  const glassScrollbarClass = `
scrollbar-thin 
[&::-webkit-scrollbar]:w-1.5
[&::-webkit-scrollbar-track]:bg-transparent
[&::-webkit-scrollbar-thumb]:bg-slate-400/25
[&::-webkit-scrollbar-thumb]:rounded-full
hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/40
`;

  const FilterContent = () => (
    <div className="space-y-4" ref={filterRef}>
      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 overflow-visible relative z-30">
        {/* Dropdown 1: Lokasi */}
        <div className="relative z-50">
          <label className="flex items-center text-xs font-black text-slate-700 tracking-tight mb-2 uppercase">
            Lokasi ({cities.length})
          </label>

          <button
            type="button"
            disabled={loading || cities.length === 0}
            onClick={() =>
              setOpenDropdown(openDropdown === "city" ? null : "city")
            }
            className="w-full h-11 px-4 rounded-xl bg-white/50 border border-gray-200/60 text-sm font-bold text-slate-800 flex items-center justify-between transition-all backdrop-blur-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
          >
            <span className="truncate text-left pr-2">
              {getSelectedLabel("city", cities, "Semuanya")}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${openDropdown === "city" ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "city" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                /* PERBAIKAN: Menggunakan w-[300px] agar konsisten sama lebar dengan dropdown lainnya */
                className={`absolute z-[9999] mt-2 left-0 w-[300px] max-h-72 overflow-y-auto rounded-2xl border border-white/60 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-1.5 space-y-0.5 ${glassScrollbarClass}`}
              >
                <button
                  onClick={() => handleFilterChange("city", "")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${filters.city === "" ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                >
                  Semuanya
                </button>

                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleFilterChange("city", city.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-normal break-words leading-normal ${String(filters.city) === String(city.value) ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                  >
                    {city.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown 2: Pengelola */}
        <div className="relative z-40">
          <label className="flex items-center text-xs font-black text-slate-700 tracking-tight mb-2 uppercase">
            Pengelola ({managers.length})
          </label>

          <button
            type="button"
            disabled={loading || managers.length === 0}
            onClick={() =>
              setOpenDropdown(openDropdown === "manager" ? null : "manager")
            }
            className="w-full h-11 px-4 rounded-xl bg-white/50 border border-gray-200/60 text-sm font-bold text-slate-800 flex items-center justify-between transition-all backdrop-blur-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
          >
            <span className="truncate text-left pr-2">
              {getSelectedLabel("manager", managers, " Semuanya")}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${openDropdown === "manager" ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "manager" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                /* PERBAIKAN: Menggunakan w-[300px] agar teks dinas panjang terbungkus rapi tanpa memaksa boks melar */
                className={`absolute z-[9999] mt-2 left-0 w-[300px] max-h-72 overflow-y-auto rounded-2xl border border-white/60 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-1.5 space-y-0.5 ${glassScrollbarClass}`}
              >
                <button
                  onClick={() => handleFilterChange("manager", "")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${filters.manager === "" ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                >
                  Semuanya
                </button>

                {managers.map((manager) => (
                  <button
                    key={manager.id}
                    onClick={() => handleFilterChange("manager", manager.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-normal break-words leading-normal ${String(filters.manager) === String(manager.value) ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                  >
                    {manager.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown 3: Jenis Layanan */}
        <div className="relative z-30">
          <label className="flex items-center text-xs font-black text-slate-700 tracking-tight mb-2 uppercase">
            Jenis Layanan ({services.length})
          </label>

          <button
            type="button"
            disabled={services.length === 0}
            onClick={() =>
              setOpenDropdown(
                openDropdown === "serviceType" ? null : "serviceType",
              )
            }
            className="w-full h-11 px-4 rounded-xl bg-white/50 border border-gray-200/60 text-sm font-bold text-slate-800 flex items-center justify-between transition-all backdrop-blur-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
          >
            <span className="truncate text-left pr-2">
              {getSelectedLabel("serviceType", services, "Semuanya")}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${openDropdown === "serviceType" ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "serviceType" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                /* PERBAIKAN: w-[300px] dengan xl:right-0 agar simetris di ujung kanan grid */
                className={`absolute z-[9999] mt-2 left-0 xl:left-auto xl:right-0 w-[300px] max-h-72 overflow-y-auto rounded-2xl border border-white/60 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-1.5 space-y-0.5 ${glassScrollbarClass}`}
              >
                <button
                  onClick={() => handleFilterChange("serviceType", "")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${filters.serviceType === "" ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                >
                  Semuanya
                </button>

                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() =>
                      handleFilterChange("serviceType", service.id)
                    }
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-normal break-words leading-normal ${filters.serviceType === service.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                  >
                    {service.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown 4: Status (is_laku) */}
        <div className="relative z-20">
          <label className="flex items-center text-xs font-black text-slate-700 tracking-tight mb-2 uppercase">
            Status
          </label>

          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "is_laku" ? null : "is_laku")
            }
            className="w-full h-11 px-4 rounded-xl bg-white/50 border border-gray-200/60 text-sm font-bold text-slate-800 flex items-center justify-between transition-all backdrop-blur-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <span className="truncate text-left pr-2">
              {filters.is_laku === ""
                ? "Keseluruhan"
                : getSelectedLabel("is_laku", statusOptions, "Keseluruhan")}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${openDropdown === "is_laku" ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "is_laku" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                /* PERBAIKAN: w-[300px] agar seluruh baris dropdown seimbang tanpa kecuali */
                className={`absolute z-[9999] mt-2 left-0 xl:left-auto xl:right-0 w-[300px] max-h-72 overflow-y-auto rounded-2xl border border-white/60 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-1.5 space-y-0.5 ${glassScrollbarClass}`}
              >
                {statusOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterChange("is_laku", option.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-normal break-words leading-normal ${filters.is_laku === option.value ? "bg-white text-blue-600 shadow-sm" : "text-slate-800 hover:bg-blue-50/80 hover:text-blue-600"}`}
                  >
                    {option.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3.5 pt-2 relative z-10">
        <button
          onClick={handleReset}
          className="px-4 py-3 border border-gray-200/80 bg-white/40 text-slate-700 hover:bg-white/80 font-bold rounded-xl transition-all backdrop-blur-md text-sm shadow-sm"
        >
          Reset
        </button>

        <button
          onClick={handleApplyFilter}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all text-sm"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Filter Panel */}
      <div
        className="
hidden lg:block
bg-white/30
backdrop-blur-2xl
backdrop-saturate-150
rounded-3xl
border border-white/50
shadow-[0_8px_32px_rgba(0,0,0,0.02)]
overflow-visible
w-full
relative
z-40
"
      >
        <div className="p-5">
          <FilterContent />
        </div>
      </div>
      {/* Mobile/SM Filter Button */}
      <div className="lg:hidden mb-4 relative z-40">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/30 border border-white/60 rounded-xl font-bold text-slate-800 hover:bg-white/50 transition-all backdrop-blur-md shadow-sm text-sm"
        >
          <Sliders className="w-4 h-4 text-slate-500" />
          Filter Pencarian
        </button>
      </div>
      {/* Mobile Filter Sheet Overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilter(false)}
          />

          <div className="relative bg-white/80 backdrop-blur-3xl rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="w-12 h-1 bg-slate-300/60 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-black text-slate-900 font-sans tracking-tight">
                Filter Obyek
              </h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-8 h-8 rounded-full bg-slate-900/5 flex items-center justify-center text-slate-600 active:bg-slate-900/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-1.5 p-1 mb-5 bg-slate-900/5 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 font-extrabold text-xs rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <FilterContent />
          </div>
        </div>
      )}{" "}
    </>
  );
}
