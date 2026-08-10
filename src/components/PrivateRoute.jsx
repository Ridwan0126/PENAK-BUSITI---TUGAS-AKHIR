import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  // 1. PENTING: Tunggu sampai proses pembacaan localStorage di AuthContext selesai
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  // 2. Jika sudah selesai loading tapi user tidak punya token, baru arahkan ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 3. Validasi role (opsional, pastikan user memiliki properti role jika dipakai)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  // 4. Jika lolos, tampilkan halaman yang dilindungi
  return children
}