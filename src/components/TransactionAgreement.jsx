import { useState } from 'react'
import { ChevronRight, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { paymentAPI } from '../services/paymentAPI'
import SKRDDocument from './SKRDDocument'
import QRCodeDisplay from './QRCodeDisplay'

export default function TransactionAgreement() {
  const [step, setStep] = useState(1) // 1: Choose PKS, 2: Select product, 3: Enter PKS/NIK, 4: Select period, 5: Check settlement, 6: Show SKRD
  const [hasPKS, setHasPKS] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [pksNumber, setPksNumber] = useState('')
  const [nik, setNik] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [skrdData, setSkrdData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSettlement, setHasSettlement] = useState(null)
  const [error, setError] = useState(null)

  const products = [
    { id: 1, name: 'Retribusi Reklame', rate: 100000 },
    { id: 2, name: 'Retribusi Parkir', rate: 5000 },
    { id: 3, name: 'Retribusi Usaha Pariwisata', rate: 50000 },
    { id: 4, name: 'Retribusi Tempat Penjualan Minuman Beralkohol', rate: 75000 },
  ]

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ]

  const handleCheckSettlement = async () => {
    if (!selectedProduct || !month || !year) {
      setError('Harap isi semua field')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await paymentAPI.checkSettlement({
        objectId: selectedProduct.id,
        month,
        year,
      })

      const settlementExists = response.data.hasSettlement

      if (!settlementExists) {
        setError('Belum ada penetapan untuk periode ini atau belum memasuki tanggal jatuh tempo pembayaran')
        setHasSettlement(false)
        setIsLoading(false)
        return
      }

      // Get SKRD data
      const skrdResponse = await paymentAPI.getSKRD({
        pksNumber,
        nik,
        month,
        year,
        objectId: selectedProduct.id,
      })

      setSkrdData(skrdResponse.data.data)
      setHasSettlement(true)
      setStep(6)
    } catch (err) {
      setError('Gagal mengecek penetapan. Silakan coba lagi.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadSPTRD = () => {
    const link = document.createElement('a')
    link.href = '/templates/sptrd-template.pdf'
    link.download = 'Template_SPTRD.pdf'
    link.click()
  }

  // Step 1: Choose PKS Status
  if (step === 1 && hasPKS === null) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Transaksi Dengan Perjanjian</h2>
          <p className="text-gray-600">Pilih status PKS (Perjanjian Kerja Sama) Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Belum Ada PKS */}
          <button
            onClick={() => setHasPKS(false)}
            className="group p-8 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-2xl hover:border-orange-500 hover:shadow-xl transition-smooth text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center group-hover:bg-orange-300 transition-smooth">
                <span className="text-2xl">📄</span>
              </div>
              <ChevronRight className="w-6 h-6 text-orange-500 group-hover:translate-x-1 transition-smooth" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada PKS</h3>
            <p className="text-gray-600 mb-4">Dapatkan template SPTRD dan persiapkan dokumen Anda</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Unduh template SPTRD
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Isi dan persiapkan dokumen
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Hubungi kantor retribusi
              </li>
            </ul>
          </button>

          {/* Sudah Ada PKS */}
          <button
            onClick={() => setHasPKS(true)}
            className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl hover:border-green-500 hover:shadow-xl transition-smooth text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center group-hover:bg-green-300 transition-smooth">
                <span className="text-2xl">✅</span>
              </div>
              <ChevronRight className="w-6 h-6 text-green-500 group-hover:translate-x-1 transition-smooth" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sudah Ada PKS</h3>
            <p className="text-gray-600 mb-4">Lanjutkan proses penetapan retribusi Anda</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Pilih objek retribusi
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Verifikasi data PKS & NIK
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Dapatkan SKRD otomatis
              </li>
            </ul>
          </button>
        </div>
      </div>
    )
  }

  // Belum Ada PKS - Download SPTRD
  if (hasPKS === false) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => {
            setHasPKS(null)
            setStep(1)
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali
        </button>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Template SPTRD</h2>
              <p className="text-gray-600">Formulir Pernyataan untuk Penetapan Retribusi Daerah</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 space-y-3">
            <h3 className="font-bold text-gray-800">Langkah-Langkah:</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">1.</span>
                <span>Klik tombol "Unduh Template SPTRD" di bawah</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">2.</span>
                <span>Isi semua data dengan lengkap dan benar sesuai dengan identitas Anda</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">3.</span>
                <span>Lengkapi dengan dokumen pendukung (KTP, NPWP, dll)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">4.</span>
                <span>Kirim atau datang langsung ke Kantor Bapenda Jawa Tengah</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">5.</span>
                <span>Tunggu verifikasi dan proses pembuatan PKS (1-7 hari kerja)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">6.</span>
                <span>Setelah PKS terbit, Anda bisa lanjut ke transaksi perjanjian</span>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Hubungi Kami:</strong> Untuk bantuan lebih lanjut atau pertanyaan tentang proses pembuatan PKS, silakan hubungi kantor retribusi terdekat.
            </p>
          </div>

          <button
            onClick={handleDownloadSPTRD}
            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95 flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Unduh Template SPTRD
          </button>
        </div>
      </div>
    )
  }

  // Sudah Ada PKS - Step 2: Select Product
  if (hasPKS === true && step === 2) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => {
            setHasPKS(null)
            setStep(1)
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pilih Objek Retribusi</h2>
          <p className="text-gray-600 mb-6">Tentukan jenis layanan retribusi yang ingin Anda lakukan</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product)
                  setStep(3)
                }}
                className={`p-4 border-2 rounded-lg transition-smooth text-left ${
                  selectedProduct?.id === product.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-2">Rp {product.rate.toLocaleString('id-ID')} per unit</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Enter PKS & NIK
  if (step === 3) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali ke Pilihan Objek
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Verifikasi Data PKS & NIK</h2>

          <div className="space-y-4">
            {/* Selected Product */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Objek Retribusi Yang Dipilih</p>
              <p className="text-lg font-bold text-blue-600">{selectedProduct?.name}</p>
            </div>

            {/* PKS Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Perjanjian Kerja Sama (PKS)
              </label>
              <input
                type="text"
                value={pksNumber}
                onChange={(e) => setPksNumber(e.target.value)}
                placeholder="Contoh: PKS-2024-001"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-smooth"
              />
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Induk Kependudukan (NIK)
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Contoh: 3374011234567890"
                maxLength="16"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-smooth"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setStep(4)}
              disabled={!pksNumber || !nik}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Lanjut Ke Pemilihan Periode
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Select Period
  if (step === 4) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => setStep(3)}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali ke Verifikasi Data
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Masa Retribusi</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Month */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bulan</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-smooth"
                >
                  <option value="">Pilih Bulan</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2020"
                  max={new Date().getFullYear()}
                  placeholder="2024"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-smooth"
                />
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={handleCheckSettlement}
              disabled={!month || !year || isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin-slow" />
                  Mengecek Penetapan...
                </>
              ) : (
                <>
                  Cek Penetapan
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-600">Pemberitahuan</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 6: Show SKRD
  if (step === 6 && skrdData) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => {
            setStep(4)
            setError(null)
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali
        </button>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 flex items-center gap-4 mb-6">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-green-700">Penetapan Ditemukan</h3>
            <p className="text-sm text-green-600">SKRD berhasil dibuat dan siap diunduh</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* SKRD Details */}
          <SKRDDocument skrdData={skrdData} />

          {/* QR Code Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pembayaran Non Tunai</h2>
            <QRCodeDisplay data={skrdData.qrCode} skrdNumber={skrdData.skrdNumber} />
          </div>
        </div>
      </div>
    )
  }

  // Default - Start
  return (
    <div className="text-center py-12">
      <p className="text-gray-600">Mempersiapkan halaman transaksi...</p>
    </div>
  )
}
