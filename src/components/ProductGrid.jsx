import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { Star, MapPin, Database } from "lucide-react"; 
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { retributiAPI_Endpoints } from "../services/api";
import SkeletonLoader from "./SkeletonLoader";
import logoApp from "/images/footer.svg";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRtgEJgJef3PNkPxPxbilsFRsv7Ldrv5Q",
  authDomain: "retribusi-bapenda.firebaseapp.com",
  projectId: "retribusi-bapenda",
  storageBucket: "retribusi-bapenda.firebasestorage.app",
  messagingSenderId: "479725161202",
  appId: "1:479725161202:web:3980d3054259bd5a235e6b",
  measurementId: "G-TJL81KLS2Q"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ProductGrid({ filters = {}, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(500);
  const [hasMore, setHasMore] = useState(true);

  // State tambahan untuk migrasi
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [JSON.stringify(filters), searchTerm, itemsPerPage]);

  const fetchProducts = async (page, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const filterParams = {
        search: searchTerm || filters.search || "",
        limit: 500,
      };

      if (filters.city) filterParams.city = String(filters.city);
      if (filters.manager) filterParams.manager = String(filters.manager);
      if (filters.serviceType)
        filterParams.id_jenis_retribusi = filters.serviceType;

      const response = await retributiAPI_Endpoints.getProducts(
        page,
        20,
        filterParams,
      );
      const payload = response.data || response;
      let rawProducts = payload.data || payload.products || [];

      // Filter Manual
      if (filters.serviceType) {
        rawProducts = rawProducts.filter(
          (product) =>
            String(product.jenis?.id).trim() ===
            String(filters.serviceType).trim(),
        );
      }

      if (filters.is_laku !== undefined && filters.is_laku !== "") {
        const targetStatus = filters.is_laku === true;
        rawProducts = rawProducts.filter(
          (product) => Boolean(product.is_laku) === targetStatus,
        );
      }

      if (rawProducts.length < 20 && payload.current_page < payload.last_page) {
        return fetchProducts(page + 1, append, rawProducts);
      }

      const updated = append ? [...products, ...rawProducts] : rawProducts;
      setProducts(updated);

      // Otomatis update totalItems berdasarkan total_row dari API
      setTotalItems(payload.total_row || 0);
      setHasMore(updated.length < (payload.total_row || 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    fetchProducts(next, true);
  };

  const displayedCount = products.length;
  const showLoadMore = hasMore;

  // FUNGSI MIGRASI DENGAN ANTIDUPLIKASI & PEMBARUAN DATA (UPDATE)
  const handleMigrateToFirebase = async () => {
    setIsMigrating(true);
    
    const TOTAL_DATA_TARGET = 21402; 
    let count = 0; 
    const BATCH_SIZE = 500;
    
    setMigrationProgress(count);

    try {
      for (let page = 1; count < TOTAL_DATA_TARGET; page++) {
        const response = await retributiAPI_Endpoints.getProducts(page, BATCH_SIZE);
        const data = response.data?.data || [];
        if (data.length === 0) break;

        const batch = writeBatch(db);
        let activeBatchCount = 0;

        for (const item of data) {
          const docRef = doc(collection(db, "obyek_retribusi"), String(item.id));
          
          // Menggunakan set dengan { merge: true }
          // - Jika data belum ada: Insert dokumen baru (Anti-duplikat)
          // - Jika data sudah ada: Update dengan data terbaru dari API
          batch.set(docRef, item, { merge: true });
          activeBatchCount++;
        }

        if (activeBatchCount > 0) {
          await batch.commit();
        }
        
        count += data.length;
        setMigrationProgress(Math.min(count, TOTAL_DATA_TARGET));

        // Jeda keselamatan agar Firestore tidak mengalami rate limit / overload
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      alert("Hebat! Seluruh 21.402 data berhasil disinkronisasi (antiduplikat & update data terbaru).");
    } catch (err) {
      console.error(err);
      alert("Migrasi terhenti: " + err.message);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="w-full">
      {/* PANEL TOOLS MIGRASI SMART */}
      {/* <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200 flex items-center justify-between">
        <div>
           <h3 className="font-bold text-sm flex items-center gap-2">
             <Database className="w-4 h-4 text-indigo-600" />
             Tools Migrasi Kebutuhan Firestore (Anti-Duplikat & Update)
           </h3>
           <p className="text-xs text-slate-500 mt-0.5">
             Progress Data: <span className="font-semibold text-slate-800">{migrationProgress}</span> / 21.402
           </p>
        </div>
        <button 
          onClick={handleMigrateToFirebase}
          disabled={isMigrating}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-sm"
        >
          {isMigrating ? "Memproses Data..." : "Mulai Migrasi 21.402 Data"}
        </button>
      </div> */}

      {/* INFO PANEL */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500 font-medium">
          Menampilkan{" "}
          <span className="font-semibold text-slate-900">{displayedCount}</span>{" "}
          dari{" "}
          <span className="font-semibold text-slate-900">{totalItems}</span>{" "}
          produk
        </p>

        {/* SELECT BOX */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
          className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <SkeletonLoader key={i} className="rounded-[20px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          {/* PRODUCT GRID CONTAINER */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
            {products.map((product, idx) => {
              const isFallback = !product.foto;

              return (
                <motion.div
                  key={product.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                    delay: idx * 0.01,
                  }}
                  className="h-full"
                >
                  <Link
                    to={`/products/${product.id}`}
                    className={`group flex flex-col h-full rounded-[20px] overflow-hidden border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 ${
                      product.is_laku
                        ? "border-slate-100 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10"
                        : "border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10"
                    }`}
                  >
                    {/* AREA MEDIA FOTO */}
                    <div className="relative h-44 bg-slate-100/80 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <div className="absolute top-3 left-3 z-10">
                        {product.is_laku ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Tersewa
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Tersedia
                          </span>
                        )}
                      </div>

                      <img
                        src={isFallback ? logoApp : product.foto}
                        alt={product.obyek_retribusi}
                        className={
                          isFallback
                            ? "max-h-20 object-contain opacity-40 transition-transform duration-500 ease-out group-hover:scale-105"
                            : "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = logoApp;
                        }}
                      />

                      {product.is_laku && (
                        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[11px] font-extrabold shadow-md tracking-wide">
                            TERSEWA
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DETAIL KONTEN */}
                    <div className="p-4 flex flex-col flex-1 bg-white">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 block">
                        {product.opd?.nama || "-"}
                      </span>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                        {product.obyek_retribusi}
                      </h3>

                      <div className="flex items-start gap-1 mt-3 flex-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-slate-500 line-clamp-2 font-medium leading-relaxed">
                          {product.alamat ||
                            product.kecamatan?.kecamatan ||
                            "-"}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                          Tarif
                        </p>
                        <div className="flex">
                          <p className="text-slate-900 flex-auto font-black text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-200">
                            Rp{" "}
                            {parseInt(
                              product.tariftbl?.tarif || 0,
                            ).toLocaleString("id-ID")}
                          </p>
                          <p className="text-[9px] mt-1.5 flex uppercase tracking-wider text-end text-slate-400 font-bold ">
                            {product?.tariftbl?.satuan?.satuan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* TOMBOL LOAD MORE */}
          {showLoadMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-10 py-3.5 rounded-full text-white font-semibold text-sm
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] 
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {loadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-slate-400 font-medium text-sm tracking-wide">
          Tidak ada produk ditemukan
        </div>
      )}
    </div>
  );
}