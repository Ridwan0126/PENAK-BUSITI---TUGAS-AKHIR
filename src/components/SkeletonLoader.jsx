export default function SkeletonLoader({ count = 4, variant = 'card' }) {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            
            {/* Content skeleton */}
            <div className="p-5 space-y-4">
              {/* Badge */}
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded-lg w-full" />
                <div className="h-6 bg-gray-200 rounded-lg w-4/5" />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Price */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-20" />
                <div className="h-8 bg-gray-200 rounded-lg w-full" />
              </div>

              {/* Button */}
              <div className="h-10 bg-gray-200 rounded-lg w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        {/* Left */}
        <div className="lg:col-span-1 space-y-4">
          <div className="h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-shimmer" />
          <div className="flex gap-3">
            <div className="h-12 bg-gray-200 rounded-xl flex-1" />
            <div className="h-12 bg-gray-200 rounded-xl flex-1" />
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-6 w-32 bg-gray-200 rounded-full" />
            <div className="h-6 w-32 bg-gray-200 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded-lg w-full" />
            <div className="h-10 bg-gray-200 rounded-lg w-3/4" />
          </div>

          {/* Rating */}
          <div className="h-6 bg-gray-200 rounded-lg w-48" />

          {/* Details */}
          <div className="space-y-4 py-4 border-t border-gray-200">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-32" />
                <div className="h-6 bg-gray-200 rounded-lg w-full" />
              </div>
            ))}
          </div>

          {/* Price Box */}
          <div className="bg-gray-100 rounded-xl p-6 space-y-2">
            <div className="h-4 bg-gray-200 rounded-lg w-16" />
            <div className="h-10 bg-gray-200 rounded-lg w-48" />
          </div>

          {/* Button */}
          <div className="h-14 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return null
}
