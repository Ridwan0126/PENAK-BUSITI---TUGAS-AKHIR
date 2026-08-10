import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import SplashScreen from "./components/SplashScreen";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import SKRD from "./pages/SKRD";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
import SPTRD from "./pages/SPTRD";
import Profile from "./pages/Profile";
import SetPassword from "./pages/SetPassword";
import TentangKami from "./pages/TentangKami";
import ScanTicket from "./pages/ScanTicket";
import Ticket from "./pages/Ticket";
import LupaPassword from "./pages/LupaPassword";
import WANotFound from "./pages/WANotFound";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {/* 
        PENTING: AuthProvider harus membungkus Router 
        agar PrivateRoute (yang ada di dalam Routes) bisa mengakses useAuth() 
      */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tentangkami" element={<TentangKami />} />
            <Route path="/lupapassword" element={<LupaPassword />} />
            <Route path="/setpassword/:token" element={<SetPassword />} />
            <Route path="/wanotfound" element={<WANotFound />} />

            {/* Halaman yang dibatasi: Harus Login */}
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/skrd"
              element={
                <PrivateRoute>
                  <SKRD />
                </PrivateRoute>
              }
            />
            <Route
              path="/sptrd"
              element={
                <PrivateRoute>
                  <SPTRD />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Halaman lain yang sudah ada proteksinya */}
            <Route path="/scanticket" element={<ScanTicket />} />
            <Route path="/ticket" element={<Ticket />} />

            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;







// import React, { useState, useEffect } from 'react';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('api_token') || '');
//   const [username, setUsername] = useState('rpp_smg1');
//   const [password, setPassword] = useState('qwerty12345');
  
//   const [userData, setUserData] = useState(null);
//   const [opdList, setOpdList] = useState([]);
//   const [obyekList, setObyekList] = useState([]);
//   const [rawObyekList, setRawObyekList] = useState([]);
  
//   const [filterActive, setFilterActive] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const baseUrl = '/bapenda';

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${baseUrl}/emonev/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || 'Login gagal, periksa kembali username dan password.');
//       }

//       const newToken = result.data.token;
//       localStorage.setItem('api_token', newToken);
//       setToken(newToken);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('api_token');
//     localStorage.removeItem('cached_obyek_data');
//     setToken('');
//     setUserData(null);
//     setOpdList([]);
//     setObyekList([]);
//     setRawObyekList([]);
//   };

//   // Fungsi filter fleksibel & cepat
//   const filterObyekFlexible = (allObyek, allowedOpds) => {
//     const allowedOpdIds = new Set(allowedOpds.map(opd => String(opd.id)));
//     const allowedBalaiIds = new Set();
    
//     allowedOpds.forEach(opd => {
//       if (opd.balai && opd.balai.length > 0) {
//         opd.balai.forEach(balai => {
//           allowedBalaiIds.add(String(balai.id));
//           if (balai.unit_penunjang && balai.unit_penunjang.length > 0) {
//             balai.unit_penunjang.forEach(unit => {
//               allowedBalaiIds.add(String(unit.id));
//             });
//           }
//         });
//       }
//     });

//     return allObyek.filter(item => {
//       const itemOpd = String(item.id_opd || '');
//       const itemUppd = String(item.id_uppd || '');

//       const matchOpd = allowedOpdIds.has(itemOpd);
//       const matchBalai = allowedBalaiIds.size === 0 || allowedBalaiIds.has(itemUppd) || allowedBalaiIds.has(itemOpd);

//       return matchOpd && matchBalai;
//     });
//   };

//   // Ambil data obyek dari API dengan sistem Cache localStorage agar instan
//   const fetchObyekFast = async (allowedOpds) => {
//     try {
//       // Cek apakah data sudah ada di Cache localStorage browser
//       const cachedData = localStorage.getItem('cached_obyek_data');
//       if (cachedData) {
//         const parsedData = JSON.parse(cachedData);
//         setRawObyekList(parsedData);
//         setObyekList(filterObyekFlexible(parsedData, allowedOpds));
//         return; // Keluar agar tidak perlu fetch ulang ke server
//       }

//       // Jika belum ada cache, lakukan fetch dari backend
//       const res = await fetch(`${baseUrl}/pepakraja/obyek?limit=23000`, {
//         method: 'GET',
//         headers: { 
//           'Authorization': `Bearer ${token}`, 
//           'Content-Type': 'application/json' 
//         },
//       });

//       const obyekResult = await res.json();
//       let rawData = [];
//       if (Array.isArray(obyekResult)) {
//         rawData = obyekResult;
//       } else if (Array.isArray(obyekResult.data)) {
//         rawData = obyekResult.data;
//       } else if (obyekResult.data && Array.isArray(obyekResult.data.data)) {
//         rawData = obyekResult.data.data;
//       }

//       // Simpan ke localStorage supaya akses berikutnya sangat cepat
//       localStorage.setItem('cached_obyek_data', JSON.stringify(rawData));

//       setRawObyekList(rawData);
//       setObyekList(filterObyekFlexible(rawData, allowedOpds));
//     } catch (err) {
//       console.error('Error fetch obyek:', err);
//       setError('Gagal memuat data objek retribusi.');
//     }
//   };

//   useEffect(() => {
//     if (!token) return;

//     setLoading(true);

//     fetch(`${baseUrl}/emonev/me`, {
//       method: 'GET',
//       headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//     })
//       .then(res => res.json())
//       .then(async (meResult) => {
//         if (meResult.success) {
//           const user = meResult.data.user;
//           setUserData(user);

//           const rawOpdList = meResult.data.opd || [];
//           setOpdList(rawOpdList);

//           // Panggil fungsi pengambilan data obyek yang sudah di-cache
//           await fetchObyekFast(rawOpdList);
//         } else {
//           setError('Gagal memuat profil pengguna.');
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         if (err.message && err.message.includes('401')) {
//           handleLogout();
//           setError('Sesi telah kedaluwarsa, silakan login kembali.');
//         } else {
//           setError('Terjadi kesalahan koneksi.');
//         }
//         setLoading(false);
//       });
//   }, [token]);

//   const handleToggleFilter = () => {
//     if (filterActive) {
//       setObyekList(rawObyekList);
//       setFilterActive(false);
//     } else {
//       const filtered = filterObyekFlexible(rawObyekList, opdList);
//       setObyekList(filtered);
//       setFilterActive(true);
//     }
//   };

//   const countTotalRows = (opd) => {
//     if (!opd.balai || opd.balai.length === 0) return 1;
//     let count = 0;
//     opd.balai.forEach((balai) => {
//       if (!balai.unit_penunjang || balai.unit_penunjang.length === 0) {
//         count += 1;
//       } else {
//         count += balai.unit_penunjang.length;
//       }
//     });
//     return count > 0 ? count : 1;
//   };

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-gray-100">
//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login E-Monev</h2>
          
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Username</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 text-sm disabled:bg-blue-300"
//             >
//               {loading ? 'Memproses...' : 'Masuk'}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Dashboard E-Monev Bapenda Jateng</h2>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition"
//           >
//             Keluar (Logout)
//           </button>
//         </div>

//         {loading && (
//           <div className="p-4 bg-blue-100 text-blue-700 rounded-lg text-center font-medium text-sm">
//             Memuat data...
//           </div>
//         )}
//         {error && (
//           <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-medium text-sm">
//             Terjadi Kesalahan: {error}
//           </div>
//         )}

//         {/* User Info */}
//         {userData && (
//           <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
//             <h3 className="text-lg font-semibold text-blue-600 mb-4">Informasi Pengguna</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
//               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
//                 <span className="block text-xs text-gray-400 font-semibold uppercase">ID</span>
//                 <span className="font-medium">{userData.id}</span>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
//                 <span className="block text-xs text-gray-400 font-semibold uppercase">Nama</span>
//                 <span className="font-medium">{userData.nama}</span>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
//                 <span className="block text-xs text-gray-400 font-semibold uppercase">ID OPD</span>
//                 <span className="font-medium">{userData.id_opd}</span>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
//                 <span className="block text-xs text-gray-400 font-semibold uppercase">ID UPPD</span>
//                 <span className="font-medium">{userData.id_uppd}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Tabel Obyek Retribusi */}
//         <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
//           <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h3 className="text-lg font-semibold text-blue-600">Daftar Obyek Retribusi (Cached Mode)</h3>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {filterActive 
//                   ? `Filter Aktif Sesuai Hak Akses OPD & Balai (${obyekList.length} Data Ditampilkan)` 
//                   : `Menampilkan Seluruh Obyek (${obyekList.length} Data Ditampilkan)`
//                 }
//               </p>
//             </div>

//             <button
//               onClick={handleToggleFilter}
//               className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition border ${
//                 filterActive 
//                   ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
//                   : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
//               }`}
//             >
//               {filterActive ? 'Tampilkan Semua Obyek' : 'Filter Berdasarkan Hak Akses'}
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-900 text-white">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">ID Obyek</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Nama Obyek</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Alamat</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">UPPD / OPD</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Tarif</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {obyekList.length > 0 ? (
//                   obyekList.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 font-mono text-gray-600 text-xs">{item.id}</td>
//                       <td className="px-6 py-4 font-medium text-gray-900">{item.obyek_retribusi || item.judul_penawaran}</td>
//                       <td className="px-6 py-4 text-gray-600">{item.alamat || '-'}</td>
//                       <td className="px-6 py-4 text-gray-600">
//                         <div className="text-xs font-semibold">{item.uppd?.nama || `UPPD: ${item.id_uppd}`}</div>
//                         <div className="text-xs text-gray-400">{item.opd?.nama || `OPD: ${item.id_opd}`}</div>
//                       </td>
//                       <td className="px-6 py-4 font-semibold text-gray-900">
//                         Rp {Number(item.tariftbl?.tarif || item.potensi_retribusi?.tarif || 0).toLocaleString('id-ID')}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
//                       Tidak ada data objek retribusi yang sesuai dengan hak akses unit kerja Anda.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Tabel OPD, Balai & Unit Penunjang */}
//         <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
//           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-blue-600">Daftar OPD, Balai & Unit Penunjang (Hak Akses Anda)</h3>
//             <span className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full">
//               Total Akses OPD: {opdList.length}
//             </span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-900 text-white">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider w-1/12">ID OPD</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider w-3/12">Nama OPD</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider w-4/12">Balai</th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider w-4/12">Unit Penunjang</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {opdList.length > 0 ? (
//                   opdList.map((opd) => {
//                     const totalRows = countTotalRows(opd);

//                     if (!opd.balai || opd.balai.length === 0) {
//                       return (
//                         <tr key={opd.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 font-bold text-gray-900 align-top">{opd.id}</td>
//                           <td className="px-6 py-4 font-bold text-gray-900 align-top">{opd.nama}</td>
//                           <td className="px-6 py-4 text-gray-400 italic align-top">-</td>
//                           <td className="px-6 py-4 text-gray-400 italic align-top">-</td>
//                         </tr>
//                       );
//                     }

//                     return opd.balai.map((balai, bIndex) => {
//                       if (!balai.unit_penunjang || balai.unit_penunjang.length === 0) {
//                         return (
//                           <tr key={`${opd.id}-${bIndex}`} className="hover:bg-gray-50">
//                             {bIndex === 0 && (
//                               <>
//                                 <td rowSpan={totalRows} className="px-6 py-4 font-bold text-gray-900 align-top bg-white border-r border-gray-100">{opd.id}</td>
//                                 <td rowSpan={totalRows} className="px-6 py-4 font-bold text-gray-900 align-top bg-white border-r border-gray-100">{opd.nama}</td>
//                               </>
//                             )}
//                             <td className="px-6 py-4 text-gray-700 align-top border-r border-gray-100">{balai.id} - {balai.nama}</td>
//                             <td className="px-6 py-4 text-gray-400 italic align-top">-</td>
//                           </tr>
//                         );
//                       }

//                       return balai.unit_penunjang.map((unit, uIndex) => {
//                         return (
//                           <tr key={`${opd.id}-${bIndex}-${uIndex}`} className="hover:bg-gray-50">
//                             {bIndex === 0 && uIndex === 0 && (
//                               <>
//                                 <td rowSpan={totalRows} className="px-6 py-4 font-bold text-gray-900 align-top bg-white border-r border-gray-100">{opd.id}</td>
//                                 <td rowSpan={totalRows} className="px-6 py-4 font-bold text-gray-900 align-top bg-white border-r border-gray-100">{opd.nama}</td>
//                               </>
//                             )}
//                             {uIndex === 0 && (
//                               <td rowSpan={balai.unit_penunjang.length} className="px-6 py-4 text-gray-700 align-top bg-white border-r border-gray-100">
//                                 {balai.id} - {balai.nama}
//                               </td>
//                             )}
//                             <td className="px-6 py-4 text-gray-700 align-top">{unit.id} - {unit.nama}</td>
//                           </tr>
//                         );
//                       });
//                     });
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                       Tidak ada data OPD yang tersedia.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default App;