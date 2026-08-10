import { useState } from 'react'
import { Users, ShoppingCart, TrendingUp, Settings, Plus, Trash2, Edit } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin One', email: 'admin1@pepakraja.com', status: 'active' },
    { id: 2, name: 'Admin Two', email: 'admin2@pepakraja.com', status: 'active' },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">SuperAdmin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user?.name}! Manage the entire platform here.</p>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Users</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900">1,234</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Orders</span>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">5,678</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Platform Revenue</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">Rp500M</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active Admins</span>
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{admins.length}</div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'admins'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Admin Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'settings'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Platform Settings
            </button>
          </div>

          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
              
              <div className="space-y-4">
                {[
                  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', joined: '2024-01-15', orders: 5 },
                  { id: 2, name: 'Siti Rahman', email: 'siti@example.com', joined: '2024-02-20', orders: 3 },
                  { id: 3, name: 'Ahmad Wijaya', email: 'ahmad@example.com', joined: '2024-03-10', orders: 8 },
                ].map((userItem) => (
                  <div key={userItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">{userItem.name}</p>
                      <p className="text-sm text-gray-600">{userItem.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Joined {userItem.joined} • {userItem.orders} orders</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
                <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition">
                  <Plus className="w-5 h-5" />
                  Add Admin
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{admin.name}</td>
                        <td className="py-4 px-4 text-gray-600">{admin.email}</td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {admin.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 flex gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h2>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Disabled</option>
                    <option>Enabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="PEPAK RAJA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
