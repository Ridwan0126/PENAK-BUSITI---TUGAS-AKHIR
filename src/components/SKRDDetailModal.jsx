import { X, Download, QrCode, FileText, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { getSKRDById } from '../data/dummySKRD'
import { getObyekById } from '../data/dummyPKS'

export default function SKRDDetailModal({ skrdId, onClose }) {
  const skrd = getSKRDById(skrdId)
  const obyek = skrd ? getObyekById(skrd.obyekId) : null

  if (!skrd) {
    return null
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{skrd.skrdNumber}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Dokumen</p>
                <p className="text-lg font-semibold text-gray-900">
                  {skrd.status === 'issued' ? 'Terbit' : skrd.status === 'draft' ? 'Draft' : 'Lunas'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Pembayaran</p>
                <div className={`flex items-center gap-2 ${getPaymentStatusColor(skrd.paymentStatus)}`}>
                  {getPaymentStatusIcon(skrd.paymentStatus)}
                  <span className="font-semibold">
                    {skrd.paymentStatus === 'paid' ? 'Lunas' : skrd.paymentStatus === 'pending' ? 'Menunggu' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Object Information */}
          {obyek && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Informasi Obyek Retribusi
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Obyek</p>
                    <p className="text-gray-900 font-medium">{obyek.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Retribusi</p>
                    <p className="text-gray-900 font-medium">{obyek.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pengelola</p>
                    <p className="text-gray-900 font-medium text-sm">{obyek.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="text-gray-900 font-medium">{obyek.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat</p>
                  <p className="text-gray-900 font-medium">{obyek.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Penanggung Jawab</p>
                    <p className="text-gray-900 font-medium">{obyek.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="text-gray-900 font-medium">{obyek.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SKRD Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Detail SKRD
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Periode Pajak</p>
                <p className="text-gray-900 font-semibold">{skrd.periode}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Tahun Pajak</p>
                <p className="text-gray-900 font-semibold">{skrd.year}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Tanggal Terbit</p>
                <p className="text-gray-900 font-semibold">
                  {skrd.issuedDate ? formatDate(skrd.issuedDate) : '-'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Tenggat Pembayaran</p>
                <p className={`font-semibold ${new Date(skrd.dueDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(skrd.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Detail Pembayaran
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Tarikan Baru</p>
                <p className="text-gray-900 font-semibold">{formatCurrency(skrd.tarikaanBaru)}</p>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Koreksi</p>
                <p className="text-gray-900 font-semibold">{formatCurrency(skrd.koreksi)}</p>
              </div>
              <div className="flex justify-between items-center bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-900 font-semibold">Total Bayar</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(skrd.totalBayar)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {skrd.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Catatan</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{skrd.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {skrd.status !== 'draft' && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                <Download className="w-5 h-5" />
                Unduh PDF
              </button>
              {skrd.qrCode && (
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                  <QrCode className="w-5 h-5" />
                  QR Code
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
