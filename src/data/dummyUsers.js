// Dummy user data for SKRD system
export const dummyUsers = [
  {
    id: 'USER001',
    email: 'budi.santoso@company.com',
    name: 'Budi Santoso',
    phone: '081234567890',
    company: 'PT Maju Jaya Sejahtera',
    taxId: '12.123.456.7-456.000',
    address: 'Jl. Merdeka No. 123, Semarang',
    city: 'KOTA SEMARANG',
    province: 'Jawa Tengah',
    postalCode: '50131',
    emailVerified: true,
    verifiedAt: '2026-05-10T08:30:00Z',
    createdAt: '2026-05-01T10:00:00Z',
    role: 'user',
  },
  {
    id: 'USER002',
    email: 'siti.nurhaliza@business.com',
    name: 'Siti Nurhaliza',
    phone: '081298765432',
    company: 'CV Cemerlang Jaya',
    taxId: '12.234.567.8-567.000',
    address: 'Jl. Sudirman No. 45, Semarang',
    city: 'KOTA SEMARANG',
    province: 'Jawa Tengah',
    postalCode: '50132',
    emailVerified: true,
    verifiedAt: '2026-05-08T14:20:00Z',
    createdAt: '2026-04-25T09:15:00Z',
    role: 'user',
  },
  {
    id: 'USER003',
    email: 'hendra.wijaya@ventures.com',
    name: 'Hendra Wijaya',
    phone: '081345678901',
    company: 'PT Inovasi Digital Indonesia',
    taxId: '12.345.678.9-678.000',
    address: 'Jl. Ahmad Yani No. 67, Semarang',
    city: 'KOTA SEMARANG',
    province: 'Jawa Tengah',
    postalCode: '50133',
    emailVerified: false,
    verifiedAt: null,
    createdAt: '2026-05-15T11:45:00Z',
    role: 'user',
  },
  {
    id: 'ADMIN001',
    email: 'admin@pepakraja.id',
    name: 'Administrator',
    phone: '0274000000',
    company: 'PEPAK RAJA',
    taxId: null,
    address: 'Jl. Pemuda No. 1, Semarang',
    city: 'KOTA SEMARANG',
    province: 'Jawa Tengah',
    postalCode: '50131',
    emailVerified: true,
    verifiedAt: '2026-01-01T00:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    role: 'admin',
  },
]

export const getUserById = (userId) => {
  return dummyUsers.find((user) => user.id === userId)
}

export const getUserByEmail = (email) => {
  return dummyUsers.find((user) => user.email === email)
}
