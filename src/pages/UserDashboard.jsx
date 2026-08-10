import { useState, useEffect } from 'react'
import { Package, MapPin, FileText, CreditCard, User as UserIcon, LogOut } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    // Mock orders data
    const mockOrders = [
      {
        id: 'ORD-001',
        date: '2024-05-01',
        total: 2999900,
        status: 'completed',
        items: 'Tax Service #1, Tax Service #2'
      },
      {
        id: 'ORD-002',
        date: '2024-05-05',
        total: 999900,
        status: 'processing',
        items: 'Retribution Service #5'
      },
      {
        id: 'ORD-003',
        date: '2024-05-10',
        total: 1599800,
        status: 'pending',
        items: 'Consulting Service #3'
      },
    ]
    setOrders(mockOrders)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-gray-900">
              Rp{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('id-ID')}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm mb-2">Completed</div>
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm mb-2">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary text-white p-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-green-100">{user?.email}</p>
              </div>

              <nav className="space-y-1 p-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                    activeTab === 'orders'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Orders
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  Profile
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                    activeTab === 'addresses'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  Addresses
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  My Orders
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold text-gray-900">{order.id}</td>
                          <td className="py-4 px-4 text-gray-600">{order.date}</td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{order.items}</td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            Rp{order.total.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-primary" />
                  Profile Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+62 123 4567 8900"
                    />
                  </div>
                  
                  <button className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  My Addresses
                </h2>

                <p className="text-gray-600 mb-6">No addresses saved yet.</p>
                
                <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition">
                  Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
