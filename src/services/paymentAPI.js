import axios from 'axios'

// Mock Payment API Service
// Nanti akan diganti dengan real API

export const paymentAPI = {
  // Get SKRD/Penetapan data
  getSKRD: async (params) => {
    // params: { pksNumber, nik, month, year, objectId }
    // Simulasi API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            data: {
              skrdNumber: `SKRD-${new Date().getTime()}`,
              objectName: 'Retribusi Reklame',
              taxpayerName: 'PT. Contoh Perusahaan',
              taxpayerTIN: params.nik || '123456789012345',
              address: 'Jalan Contoh No. 123, Semarang',
              period: `${params.month}/${params.year}`,
              area: '50 m²',
              rate: 100000,
              totalAmount: 5000000,
              description: 'Penetapan Retribusi Reklame',
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
              qrCode: generateMockQRData(`SKRD-${new Date().getTime()}`),
              status: 'belum_bayar',
            },
            message: 'SKRD berhasil diambil',
          },
        })
      }, 1000)
    })
  },

  // Get settlement/penetapan berdasarkan period
  checkSettlement: async (params) => {
    // params: { objectId, month, year }
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasSettlement = Math.random() > 0.3 // 70% ada penetapan
        resolve({
          data: {
            success: true,
            hasSettlement,
            message: hasSettlement ? 'Penetapan ditemukan' : 'Belum ada penetapan untuk periode ini',
            data: hasSettlement
              ? {
                  settlementNumber: `PNP-${new Date().getTime()}`,
                  objectName: 'Retribusi Reklame',
                  period: `${params.month}/${params.year}`,
                  amount: 5000000,
                  issueDate: new Date().toISOString().split('T')[0],
                }
              : null,
          },
        })
      }, 500)
    })
  },

  // Check payment status
  checkPaymentStatus: async (skrdNumber) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isPaid = Math.random() > 0.6 // 40% sudah bayar
        resolve({
          data: {
            success: true,
            skrdNumber,
            isPaid,
            status: isPaid ? 'lunas' : 'belum_bayar',
            paidDate: isPaid ? new Date().toISOString().split('T')[0] : null,
            paymentMethod: isPaid ? 'QRIS' : null,
            receiptNumber: isPaid ? `TBP-${new Date().getTime()}` : null,
            message: isPaid ? 'Pembayaran sudah diterima' : 'Pembayaran belum diterima',
            data: {
              skrdNumber,
              objectName: 'Retribusi Reklame',
              amount: 5000000,
              paidAmount: isPaid ? 5000000 : 0,
              paymentDate: isPaid ? new Date().toISOString() : null,
              taxpayerName: 'PT. Contoh Perusahaan',
            },
          },
        })
      }, 1000)
    })
  },

  // Download SPTRD template
  downloadSPTRDTemplate: async () => {
    // Dalam real API, ini akan return PDF file
    return {
      fileName: 'Template_SPTRD.pdf',
      url: '/templates/sptrd-template.pdf',
      message: 'Template SPTRD berhasil diunduh',
    }
  },

  // Generate QR Code (mock)
  generateQRCode: (data) => {
    return {
      qrData: `00020126360014ID.CO.BRI.WWW01189360010300000000000100160412RF0000000000500009ID150101PEPAKRAJA520400005303360540${data.amount || '5000000'}5802ID5913PEPAK RAJA6009SEMARANG62480107${data.skrdNumber}63047F09`,
      text: data.skrdNumber,
    }
  },

  // Get list of transactions
  getTransactions: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            data: [
              {
                id: 1,
                skrdNumber: 'SKRD-001',
                type: 'perjanjian',
                objectName: 'Retribusi Reklame',
                amount: 5000000,
                status: 'lunas',
                paidDate: new Date().toISOString().split('T')[0],
              },
              {
                id: 2,
                skrdNumber: 'SKRD-002',
                type: 'langsung',
                objectName: 'Retribusi Parkir',
                amount: 1000000,
                status: 'belum_bayar',
              },
              {
                id: 3,
                skrdNumber: 'SKRD-003',
                type: 'tiket',
                objectName: 'Retribusi Usaha Pariwisata',
                amount: 2500000,
                status: 'lunas',
                paidDate: new Date().toISOString().split('T')[0],
              },
            ],
            pagination: {
              currentPage: 1,
              totalPages: 3,
              totalItems: 50,
            },
          },
        })
      }, 800)
    })
  },

  // Save transaction
  saveTransaction: async (transactionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            skrdNumber: `SKRD-${new Date().getTime()}`,
            message: 'Transaksi berhasil disimpan',
            data: transactionData,
          },
        })
      }, 1000)
    })
  },
}

// Helper function to generate mock QR data
function generateMockQRData(skrdNumber) {
  // This is a mock QRIS format
  const timestamp = new Date().getTime()
  return `00020126360014ID.CO.BRI.WWW01189360010300000000000100160412RF0000000000500009ID150101PEPAKRAJA520400005303360540${5000000}5802ID5913PEPAK RAJA6009SEMARANG62480107${skrdNumber}63047F09`
}

export default paymentAPI
