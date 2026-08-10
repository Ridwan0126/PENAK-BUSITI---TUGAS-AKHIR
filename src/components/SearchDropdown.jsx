import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFilterData } from '../hooks/useFilterData'

export default function SearchDropdown({ isOpen = false, onClose = () => {} }) {
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { cities, managers, services } = useFilterData()

  // Combine all searchable data
  const allSearchableData = useMemo(() => {
    const dataArray = [
      ...services.map(s => ({ type: 'Layanan', name: s.name, id: s.id })),
      ...cities.map(c => ({ type: 'Lokasi', name: c.name, id: c.id })),
      ...managers.map(m => ({ type: 'Pengelola', name: m.name, id: m.id }))
    ]
    return dataArray
  }, [services, cities, managers])

  // Sample fallback suggestions when API data is not available
  const fallbackSuggestions = [
    { type: 'Layanan', name: 'Pelayanan Kesehatan', id: 'kesehatan' },
    { type: 'Layanan', name: 'Pelayanan Parkir di Tepi Jalan Umum', id: 'parkir_tepi' },
    { type: 'Layanan', name: 'Penyediaan Tempat Kegiatan Usaha', id: 'tempat_usaha' },
    { type: 'Layanan', name: 'Tempat Pelelangan', id: 'lelang' },
    { type: 'Layanan', name: 'Tempat Khusus Parkir', id: 'parkir_khusus' },
    { type: 'Layanan', name: 'Tempat Penginapan/Pesanggrahan/Vila', id: 'penginapan' },
    { type: 'Layanan', name: 'Pelayanan Kepelabuhanan', id: 'pelabuhan' },
    { type: 'Layanan', name: 'Tempat Rekreasi, Pariwisata, dan Olahraga', id: 'rekreasi' },
  ]

  const searchableData = allSearchableData.length > 0 ? allSearchableData : fallbackSuggestions

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      const filtered = searchableData.filter((item) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 8)) // Limit to 8 suggestions
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, searchableData])

  const handleSelectSuggestion = (suggestion) => {
    navigate(`/products?search=${encodeURIComponent(suggestion.name)}`)
    setSearchInput('')
    setSuggestions([])
    onClose?.()
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`)
      setSearchInput('')
      setSuggestions([])
      onClose?.()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="relative max-w-3xl mx-auto mt-24 mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          {/* Search Input */}
          <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-blue-200 focus-within:border-blue-500">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari obyek retribusi, lokasi, atau pengelola..."
              className="w-full pl-12 pr-12 py-4 text-lg outline-none rounded-2xl font-medium"
              autoFocus
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setSuggestions([])
                  searchRef.current?.focus()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {(searchInput || suggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden z-10">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Sedang mencari...
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-600">
                      Hasil Pencarian ({suggestions.length})
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="w-full px-6 py-3 text-left hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600">
                            {suggestion.type.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 group-hover:text-blue-600 transition font-medium truncate">
                            {suggestion.name}
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-blue-500">
                            {suggestion.type}
                          </p>
                        </div>
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </>
              ) : searchInput ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Tidak ada hasil untuk "{searchInput}"
                </div>
              ) : null}
            </div>
          )}
        </form>

        {/* Quick Links - Popular Searches */}
        {!searchInput && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-600 mb-4">
              Pencarian Populer
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchableData.slice(0, 6).map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 text-left bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition text-sm font-medium text-gray-700 hover:text-blue-600 truncate"
                  title={suggestion.name}
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
