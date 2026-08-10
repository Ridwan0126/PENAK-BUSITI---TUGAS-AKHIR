import { useState } from 'react'
import { Search, CheckCircle, AlertCircle, Loader, Download } from 'lucide-react'
import { paymentAPI } from '../services/paymentAPI'

export default function PaymentStatus() {
  const [skrdNumber, setSkrdNumber] = useState('')
  const [paymentData, setPaymentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleCheckStatus = async (e) => {
    e.preventDefault()

    if (!skrdNumber.trim()) {
      setError('Harap masukkan nomor SKRD')
      return
    }

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await paymentAPI.checkPaymentStatus(skrdNumber)

      if (response.data.success) {
        setPaymentData(response.data)
      } else {
        setError('SKRD tidak ditemukan. Silakan periksa kembali nomor SKRD Anda.')
      }
    } catch (err) {
      setError('Gagal mengambil data pembayaran. Silakan coba lagi.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadTBP = () => {
    // Simulasi download TBP
    const link = document.createElement('a')
    link.href = `data:text/plain;base64,${btoa(`
TANDA BUKTI PEMBAYARAN
=====================================
Nomor SKRD: ${paymentData.data.skrdNumber}
Nama Wajib Retribusi: ${paymentData.data.taxpayerName}
Objek Retribusi: ${paymentData.data.objectName}
Jumlah Pembayaran: Rp ${paymentData.data.paidAmount.toLocaleString('id-ID')}
Tanggal Pembayaran: ${paymentData.data.paymentDate}
=====================================
    `)}`
    link.download = `TBP-${paymentData.data.skrdNumber}.txt`
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cek Status Pembayaran</h1>
        <p className="text-gray-600">Masukkan nomor SKRD untuk melihat status pembayaran Anda</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleCheckStatus} className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={skrdNumber}
            onChange={(e) => setSkrdNumber(e.target.value)}
            placeholder="Contoh: SKRD-001 atau SKRD-1234567890"
            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-smooth text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin-slow" />
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Cek
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && hasSearched && (
        <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-300 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-600">Tidak Ditemukan</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && paymentData && (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-in-up">
          {/* Status Card */}
          <div
            className={`rounded-2xl p-8 border-2 ${
              paymentData.isPaid
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
            }`}
          >
            <div className="flex items-start gap-4">
              {paymentData.isPaid ? (
                <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-12 h-12 text-yellow-600 flex-shrink-0" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {paymentData.isPaid ? 'Pembayaran Lunas' : 'Belum Dibayarkan'}
                </h2>
                <p className={paymentData.isPaid ? 'text-green-700' : 'text-yellow-700'}>
                  {paymentData.isPaid
                    ? `Pembayaran Anda telah diterima pada ${paymentData.data.paymentDate}`
                    : 'Pembayaran belum diterima. Silakan segera lakukan pembayaran.'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Rincian Pembayaran</h3>

            <div className="space-y-4">
              {/* SKRD Number */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Nomor SKRD</span>
                <span className="font-bold text-gray-800">{paymentData.data.skrdNumber}</span>
              </div>

              {/* Taxpayer Name */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Nama Wajib Retribusi</span>
                <span className="font-bold text-gray-800">{paymentData.data.taxpayerName}</span>
              </div>

              {/* Object Name */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Objek Retribusi</span>
                <span className="font-bold text-gray-800">{paymentData.data.objectName}</span>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Jumlah</span>
                <span className="font-bold text-gray-800">
                  Rp {paymentData.data.paidAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Payment Method */}
              {paymentData.isPaid && (
                <>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Metode Pembayaran</span>
                    <span className="font-bold text-gray-800">{paymentData.paymentMethod || 'QRIS'}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Tanggal Pembayaran</span>
                    <span className="font-bold text-gray-800">{paymentData.data.paymentDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nomor Bukti Pembayaran (TBP)</span>
                    <span className="font-bold text-blue-600">{paymentData.receiptNumber}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {paymentData.isPaid && (
            <div className="space-y-3">
              <button
                onClick={handleDownloadTBP}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Unduh Tanda Bukti Pembayaran (TBP)
              </button>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 text-sm text-gray-700">
                <p>
                  <strong>Informasi:</strong> Bukti pembayaran ini penting untuk arsip administratif Anda.
                  Silakan simpan dengan baik.
                </p>
              </div>
            </div>
          )}

          {!paymentData.isPaid && (
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 text-sm text-gray-700">
              <p className="mb-3">
                <strong>Bagaimana cara membayar?</strong>
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Buka halaman "Pembayaran" dan pilih jenis transaksi yang sesuai</li>
                <li>Ikuti langkah-langkah sesuai dengan jenis transaksi Anda</li>
                <li>Scan QR Code SKRD menggunakan aplikasi pembayaran</li>
                <li>Selesaikan pembayaran sesuai jumlah yang tertera</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-gray-600 text-lg">
            Masukkan nomor SKRD di atas untuk melihat status pembayaran Anda
          </p>
        </div>
      )}
    </div>
  )
}
