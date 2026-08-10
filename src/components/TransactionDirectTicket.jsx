import { useState } from 'react'
import { ChevronRight, AlertCircle, Loader } from 'lucide-react'
import { paymentAPI } from '../services/paymentAPI'
import SKRDDocument from './SKRDDocument'
import QRCodeDisplay from './QRCodeDisplay'

export default function TransactionDirectTicket({ type = 'langsung' }) {
  const [step, setStep] = useState(1) // 1: Select product, 2: Enter volume, 3: Show SKRD
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [volume, setVolume] = useState('')
  const [skrdData, setSkrdData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const products = [
    { id: 1, name: 'Retribusi Reklame', rate: 100000, unit: 'm²' },
    { id: 2, name: 'Retribusi Parkir', rate: 5000, unit: 'jam' },
    { id: 3, name: 'Retribusi Usaha Pariwisata', rate: 50000, unit: 'unit' },
    { id: 4, name: 'Retribusi Tempat Penjualan Minuman Beralkohol', rate: 75000, unit: 'bulan' },
    { id: 5, name: 'Retribusi Pajak Hiburan', rate: 25000, unit: 'unit' },
  ]

  const handleCreateSKRD = async () => {
    if (!selectedProduct || !volume) {
      setError('Harap isi semua field')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const totalAmount = parseInt(volume) * selectedProduct.rate

      const response = await paymentAPI.getSKRD({
        objectId: selectedProduct.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })

      setSkrdData({
        ...response.data.data,
        totalAmount,
        area: `${volume} ${selectedProduct.unit}`,
      })

      setStep(3)
    } catch (err) {
      setError('Gagal membuat SKRD. Silakan coba lagi.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle =
    type === 'langsung'
      ? 'Transaksi Pembayaran Langsung'
      : 'Transaksi Dengan Tiket'

  const pageSubtitle =
    type === 'langsung'
      ? 'Bayar retribusi secara langsung tanpa perjanjian jangka panjang'
      : 'Bayar retribusi menggunakan sistem tiket elektronik'

  // Step 1: Select Product
  if (step === 1) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{pageTitle}</h2>
          <p className="text-gray-600">{pageSubtitle}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pilih Objek Retribusi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product)
                  setStep(2)
                }}
                className="p-4 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-smooth text-left hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Rp {product.rate.toLocaleString('id-ID')} per {product.unit}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Enter Volume
  if (step === 2) {
    const totalAmount = volume ? parseInt(volume) * selectedProduct.rate : 0

    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali ke Pilihan Objek
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Masukkan Volume/Jumlah</h2>

          <div className="space-y-4">
            {/* Selected Product */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Objek Retribusi</p>
              <p className="text-lg font-bold text-blue-600">{selectedProduct?.name}</p>
            </div>

            {/* Volume Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah ({selectedProduct?.unit})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  placeholder="Contoh: 10"
                  min="0"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-smooth"
                />
                <div className="px-4 py-3 bg-gray-100 rounded-lg font-semibold text-gray-700">
                  {selectedProduct?.unit}
                </div>
              </div>
            </div>

            {/* Total Calculation */}
            {volume && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Rincian Perhitungan:</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {volume} {selectedProduct?.unit} × Rp {selectedProduct?.rate.toLocaleString('id-ID')}
                    </span>
                    <span className="font-semibold text-gray-800">
                      = Rp {(parseInt(volume) * selectedProduct?.rate).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Total Amount */}
            {totalAmount > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                <p className="text-sm text-blue-100 mb-1">Jumlah Yang Harus Dibayar</p>
                <p className="text-3xl font-bold">Rp {totalAmount.toLocaleString('id-ID')}</p>
              </div>
            )}

            {/* Create SKRD Button */}
            <button
              onClick={handleCreateSKRD}
              disabled={!volume || isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin-slow" />
                  Membuat SKRD...
                </>
              ) : (
                <>
                  Buat SKRD & QR Code
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-600">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Show SKRD
  if (step === 3 && skrdData) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <button
          onClick={() => {
            setStep(2)
            setError(null)
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Kembali ke Input Volume
        </button>

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

  return (
    <div className="text-center py-12">
      <p className="text-gray-600">Mempersiapkan halaman transaksi...</p>
    </div>
  )
}
