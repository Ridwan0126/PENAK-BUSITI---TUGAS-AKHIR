// Dummy SKRD (Surat Ketetapan Retribusi Daerah) data
export const dummySKRD = [
  {
    id: 'SKRD001',
    skrdNumber: '000123/SKRD/2026',
    year: 2026,
    userId: 'USER001',
    obyekId: 'OBJ001',
    periode: '2026-01-2026-03',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    tarikaanBaru: 150000000,
    koreksi: 0,
    tarifakAkhir: 150000000,
    denda: 0,
    totalBayar: 150000000,
    status: 'issued',
    issuedDate: '2026-04-15T10:30:00Z',
    dueDate: '2026-05-15',
    paymentDate: null,
    paymentStatus: 'pending',
    notes: 'SKRD untuk obyek retribusi Pelayanan Kesehatan',
    pksId: 'PKS001',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SKRD001',
  },
  {
    id: 'SKRD002',
    skrdNumber: '000124/SKRD/2026',
    year: 2026,
    userId: 'USER002',
    obyekId: 'OBJ002',
    periode: '2026-01-2026-03',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    tarikaanBaru: 250000000,
    koreksi: 0,
    tarifakAkhir: 250000000,
    denda: 0,
    totalBayar: 250000000,
    status: 'issued',
    issuedDate: '2026-04-10T09:00:00Z',
    dueDate: '2026-05-10',
    paymentDate: '2026-05-08T14:30:00Z',
    paymentStatus: 'paid',
    notes: 'SKRD untuk obyek retribusi Tempat Rekreasi dan Olahraga',
    pksId: 'PKS002',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SKRD002',
  },
  {
    id: 'SKRD003',
    skrdNumber: '000125/SKRD/2026',
    year: 2026,
    userId: 'USER003',
    obyekId: 'OBJ003',
    periode: '2026-01-2026-03',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    tarikaanBaru: 75000000,
    koreksi: 0,
    tarifakAkhir: 75000000,
    denda: 0,
    totalBayar: 75000000,
    status: 'draft',
    issuedDate: null,
    dueDate: null,
    paymentDate: null,
    paymentStatus: 'draft',
    notes: 'SKRD draft untuk obyek retribusi Terminal',
    pksId: null,
    qrCode: null,
  },
]

export const getSKRDById = (id) => {
  return dummySKRD.find((skrd) => skrd.id === id)
}

export const getSKRDByUser = (userId) => {
  return dummySKRD.filter((skrd) => skrd.userId === userId)
}

export const getSKRDByStatus = (status) => {
  return dummySKRD.filter((skrd) => skrd.status === status)
}
