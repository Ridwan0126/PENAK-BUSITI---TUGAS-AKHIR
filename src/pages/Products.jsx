import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, DollarSign, Users, Loader } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartStore } from '../stores/cartStore'
import { retributiAPI_Endpoints } from '../services/api'

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCartStore()

  const itemsPerPage = 20

  // Initialize search query from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
      setCurrentPage(1)
    }
  }, [searchParams])

  // Fetch data dari API asli
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await retributiAPI_Endpoints.getProducts(currentPage, itemsPerPage, { search: searchQuery })
        
        if (response.data.success && response.data.data) {
          const apiProducts = response.data.data.data || response.data.data
          const transformedProducts = Array.isArray(apiProducts) 
            ? apiProducts 
            : [apiProducts]
          
          setProducts(transformedProducts)
          setFilteredProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Gagal memuat data. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchQuery])

  // Filter berdasarkan search
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(p =>
        p.obyek_retribusi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keterangan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.alamat?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.obyek_retribusi,
      price: parseFloat(product.tariftbl?.tarif || 0),
      description: product.alamat,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4 animate-slide-in-down">Katalog Retribusi & Pajak</h1>
          <p className="text-lg text-green-100 animate-slide-in-up">Jelajahi daftar lengkap objek retribusi dan layanan pajak kami</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12 animate-slide-in-down">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari objek retribusi, lokasi, atau layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 text-lg transition-smooth shadow-md hover:shadow-lg"
            />
          </div>
        </div>

        {/* Info Bar */}
        <div className="mb-8 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="text-gray-600">
            <p className="font-semibold">
              Menampilkan {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} hasil
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <Loader className="w-16 h-16 text-green-600 animate-spin-slow" strokeWidth={1.5} />
              <div className="absolute inset-0 border-4 border-transparent border-t-green-400 border-r-green-400 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <p className="text-gray-600 text-lg">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border-2 border-red-200 rounded-xl text-center">
            <p className="text-red-700 font-semibold">{error}</p>
            <p className="text-red-600 mt-2">Silakan coba lagi nanti.</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Tidak ada hasil ditemukan</h3>
            <p className="text-gray-600">Coba ubah pencarian atau filter Anda</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {paginatedProducts.map((product, idx) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-smooth border border-gray-100 hover:border-green-200 flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-green-400 to-teal-500 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-5xl opacity-20">📋</div>
                      </div>
                      {product.is_laku && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Aktif
                        </div>
                      )}
                      {!product.is_laku && (
                        <div className="absolute top-3 right-3 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Tidak Aktif
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Category Badge */}
                      <div className="inline-block w-fit mb-3">
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          {product.jenis?.jenis_retribusi || 'Retribusi'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.obyek_retribusi}
                      </h3>

                      {/* Location */}
                      <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <span className="line-clamp-2">{product.alamat}</span>
                      </div>

                      {/* Department */}
                      <div className="mb-4 text-xs text-gray-500">
                        <p className="font-medium">{product.opd?.nama}</p>
                        <p>{product.kota?.kab_kota}</p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-3" />

                      {/* Price and Actions */}
                      <div className="mt-auto">
                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Tarif</p>
                          <div className="flex items-baseline gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">
                              {parseInt(product.tariftbl?.tarif || 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-600">/ {product.tariftbl?.satuan?.satuan}</span>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToCart(product)
                            }}
                            className="w-full py-2 px-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth active:scale-95"
                          >
                            Tambah ke Keranjang
                          </button>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Klik untuk detail lengkap</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-semibold"
                >
                  Sebelumnya
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1
                  // Tampilkan hanya page yang relevan
                  if (Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                    return null
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-semibold"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
