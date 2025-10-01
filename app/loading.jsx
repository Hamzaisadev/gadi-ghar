import { Loader2, Car } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center container-responsive">
      <div className="text-center space-y-4 sm:space-y-6">
        {/* Animated car icon */}
        <div className="relative">
          <Car className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 mx-auto animate-bounce" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
        
        {/* Loading spinner */}
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto animate-spin" />
        
        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-responsive-lg font-semibold text-gray-900">
            Loading...
          </h2>
          <p className="text-responsive-sm text-gray-600 max-w-sm mx-auto px-4">
            Getting your car marketplace ready
          </p>
        </div>
        
        {/* Progress bar animation */}
        <div className="w-32 sm:w-48 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
