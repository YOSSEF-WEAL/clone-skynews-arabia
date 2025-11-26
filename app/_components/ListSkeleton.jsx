export default function ListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title Skeleton */}
      <div className="w-48 h-10 bg-gray-200 rounded animate-pulse mb-8 border-b-4 border-gray-300"></div>

      {/* Grid Skeleton */}
      <div className="flex flex-row flex-wrap items-center justify-around gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative w-[48%] md:w-[32%] mb-8">
            {/* Image Skeleton */}
            <div className="relative w-full h-40 md:h-60 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            
            {/* Content Skeleton */}
            <div className="space-y-3">
              {/* Title lines */}
              <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              
              {/* Excerpt lines */}
              <div className="h-4 bg-gray-100 rounded animate-pulse w-full mt-2"></div>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
