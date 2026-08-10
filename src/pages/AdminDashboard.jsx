import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, TrendingUp, Users } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [showAddProduct, setShowAddProduct] = useState(false)

  useEffect(() => {
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Tax Service ${i + 1}`,
      category: ['tax', 'retribution'][i % 2],
      price: 99.99 + (i * 10),
      stock: Math.floor(Math.random() * 100),
      status: Math.random() > 0.3 ? 'active' : 'inactive',
    }))
    setProducts(mockProducts)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user?.name}! Manage your products and services here.</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Products</span>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{products.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">Rp25,000,000</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active Orders</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">45</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'products'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'orders'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'analytics'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>

              {showAddProduct && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Product</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Product name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition">
                      Save Product
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{product.name}</td>
                        <td className="py-4 px-4 text-gray-600">{product.category}</td>
                        <td className="py-4 px-4 text-gray-600">Rp{product.price.toLocaleString('id-ID')}</td>
                        <td className="py-4 px-4 text-gray-600">{product.stock}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {product.status}
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

          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
              <p className="text-gray-600">Order management interface would display here.</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
              <p className="text-gray-600">Analytics dashboard would display here.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
