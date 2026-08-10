import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow" />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinning loader */}
        <div className="relative w-20 h-20">
          <Loader className="w-20 h-20 text-green-600 animate-spin-slow" strokeWidth={1.5} />
          <div className="absolute inset-0 border-4 border-transparent border-t-green-400 border-r-green-400 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat...</h3>
          <p className="text-gray-600">Harap tunggu sebentar</p>
        </div>

        {/* Dots animation */}
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  )
}
