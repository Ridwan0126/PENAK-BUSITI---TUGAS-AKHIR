import { useState } from 'react'
import { FileText, CreditCard, CheckCircle, AlertCircle, Upload, Loader } from 'lucide-react'
import { dummyTransactions, getTransactionsByUser } from '../data/dummyPKS'
import { dummySKRD, getSKRDById } from '../data/dummySKRD'

export default function TransactionManager({ userId, skrdId, onComplete }) {
  const [activeTab, setActiveTab] = useState('payment') // payment, documents, history
  const [formData, setFormData] = useState({
    paymentMethod: 'transfer',
    bankName: '',
    referenceNumber: '',
    amount: '',
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const skrd = skrdId ? getSKRDById(skrdId) : null
  const userTransactions = userId ? getTransactionsByUser(userId) : dummyTransactions

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!formData.bankName || !formData.referenceNumber) {
        throw new Error('Harap isi semua data pembayaran')
      }

      // Mock: In production, call actual payment API
      console.log('[v0] Payment submission:', { ...formData, skrdId, userId })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess(true)
      setTimeout(() => {
        onComplete?.({ type: 'payment', data: formData })
        setSuccess(false)
        setFormData({
          paymentMethod: 'transfer',
          bankName: '',
          referenceNumber: '',
          amount: '',
        })
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file tidak boleh lebih dari 5MB')
        return
      }
      setUploadedFile(file)
      setError(null)
    }
  }

  const handleDocumentSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!uploadedFile) {
        throw new Error('Pilih file terlebih dahulu')
      }

      // Mock: In production, upload to actual storage
      console.log('[v0] Document upload:', {
        skrdId,
        userId,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
      setTimeout(() => {
        onComplete?.({ type: 'document', data: { fileName: uploadedFile.name } })
        setSuccess(false)
        setUploadedFile(null)
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('payment')}
          className={`pb-3 font-medium transition border-b-2 ${
            activeTab === 'payment'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pembayaran
          </span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 font-medium transition border-b-2 ${
            activeTab === 'documents'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Dokumen
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 font-medium transition border-b-2 ${
            activeTab === 'history'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Riwayat
          </span>
        </button>
      </div>

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          {skrd && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">SKRD yang akan dibayar</p>
              <p className="text-lg font-semibold text-gray-900">{skrd.skrdNumber}</p>
              <p className="text-blue-600 font-bold mt-2">
                Total: Rp {(skrd.totalBayar / 1000000).toFixed(0)} Juta
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metode Pembayaran
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="transfer">Transfer Bank</option>
              <option value="e-wallet">E-Wallet</option>
              <option value="debit">Kartu Debit</option>
              <option value="credit">Kartu Kredit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Bank/E-Wallet
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              placeholder="Contoh: BCA, Mandiri, GCash, OVO"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Referensi Pembayaran
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) =>
                setFormData({ ...formData, referenceNumber: e.target.value })
              }
              placeholder="Nomor transfer atau ID transaksi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Pembayaran berhasil dicatat. Verifikasi akan dilakukan oleh admin.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            {success ? 'Berhasil' : 'Kirim Pembayaran'}
          </button>
        </form>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <form onSubmit={handleDocumentSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer block">
              <span className="text-blue-600 font-medium hover:text-blue-700">
                Klik untuk unggah
              </span>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />
            </label>
            <p className="text-gray-500 text-sm mt-2">
              PDF, JPG, PNG, DOC (Maks 5MB)
            </p>
            {uploadedFile && (
              <p className="mt-3 text-green-600 font-medium flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {uploadedFile.name}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Unggah dokumen pendukung seperti bukti pembayaran, KTP, atau dokumen lainnya yang diperlukan untuk verifikasi.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Dokumen berhasil diunggah.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !uploadedFile || success}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            {success ? 'Berhasil' : 'Unggah Dokumen'}
          </button>
        </form>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {userTransactions.length > 0 ? (
            userTransactions.map((txn) => (
              <div key={txn.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{txn.referenceNumber}</p>
                    <p className="text-sm text-gray-600">{txn.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Intl.DateTimeFormat('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(txn.createdAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-blue-600">
                      Rp {(txn.amount / 1000000).toFixed(0)}M
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                        txn.status === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {txn.status === 'verified' ? 'Terverifikasi' : 'Menunggu'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Belum ada riwayat transaksi</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
