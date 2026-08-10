// Dummy PKS (Perjanjian Kerjasama) and related agreement data
export const dummyPKS = [
  {
    id: 'PKS001',
    pksNumber: 'PKS-2026-001',
    userId: 'USER001',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    agreementType: 'annual',
    signedDate: '2025-12-20',
    signedBy: 'USER001',
    notes: 'Perjanjian kerjasama tahunan untuk retribusi pelayanan kesehatan',
    skrdCount: 1,
    skrdIds: ['SKRD001'],
  },
  {
    id: 'PKS002',
    pksNumber: 'PKS-2026-002',
    userId: 'USER002',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    agreementType: 'annual',
    signedDate: '2025-12-25',
    signedBy: 'USER002',
    notes: 'Perjanjian kerjasama untuk retribusi tempat rekreasi dan olahraga',
    skrdCount: 1,
    skrdIds: ['SKRD002'],
  },
]

export const getPKSById = (id) => {
  return dummyPKS.find((pks) => pks.id === id)
}

export const getPKSByUser = (userId) => {
  return dummyPKS.find((pks) => pks.userId === userId)
}

// Dummy transactions data
export const dummyTransactions = [
  {
    id: 'TXN001',
    skrdId: 'SKRD001',
    userId: 'USER001',
    transactionType: 'payment',
    amount: 150000000,
    paymentMethod: 'transfer',
    bankName: 'BCA',
    referenceNumber: 'TRF-2026-001',
    status: 'pending',
    createdAt: '2026-05-01T10:30:00Z',
    verifiedAt: null,
    verifiedBy: null,
    notes: 'Pembayaran SKRD001',
  },
  {
    id: 'TXN002',
    skrdId: 'SKRD002',
    userId: 'USER002',
    transactionType: 'payment',
    amount: 250000000,
    paymentMethod: 'transfer',
    bankName: 'Mandiri',
    referenceNumber: 'TRF-2026-002',
    status: 'verified',
    createdAt: '2026-05-08T14:30:00Z',
    verifiedAt: '2026-05-08T15:45:00Z',
    verifiedBy: 'ADMIN001',
    notes: 'Pembayaran SKRD002 - Verified',
  },
]

export const getTransactionById = (id) => {
  return dummyTransactions.find((txn) => txn.id === id)
}

export const getTransactionsByUser = (userId) => {
  return dummyTransactions.filter((txn) => txn.userId === userId)
}

export const getTransactionsBySKRD = (skrdId) => {
  return dummyTransactions.filter((txn) => txn.skrdId === skrdId)
}

// Dummy obyek retribusi for reference
export const dummyObyek = [
  {
    id: 'OBJ001',
    name: 'Retribusi Pelayanan Kesehatan',
    type: '01.01',
    cityId: '3374',
    city: 'KOTA SEMARANG',
    managerId: '02',
    manager: 'DINAS KESEHATAN',
    address: 'Jl. Tanjungsari No. 10, Semarang',
    contactPerson: 'Dr. Siti',
    phone: '0274-1234567',
  },
  {
    id: 'OBJ002',
    name: 'Retribusi Tempat Rekreasi dan Olahraga',
    type: '02.07',
    cityId: '3374',
    city: 'KOTA SEMARANG',
    managerId: '36',
    manager: 'DINAS KEBUDAYAAN, PARIWISATA DAN EKONOMI KREATIF',
    address: 'Jl. Pasar Kembang No. 20, Semarang',
    contactPerson: 'Ahmad Wijaya',
    phone: '0274-2345678',
  },
  {
    id: 'OBJ003',
    name: 'Retribusi Terminal',
    type: '02.05',
    cityId: '3374',
    city: 'KOTA SEMARANG',
    managerId: '07',
    manager: 'DINAS PERHUBUNGAN',
    address: 'Jl. Pantura No. 100, Semarang',
    contactPerson: 'Bambang Sutrisno',
    phone: '0274-3456789',
  },
]

export const getObyekById = (id) => {
  return dummyObyek.find((obyek) => obyek.id === id)
}
