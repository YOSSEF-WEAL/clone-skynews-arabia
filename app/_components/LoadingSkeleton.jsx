export default function LoadingSkeleton() {
  return (
    <div className="max-w-full md:max-w-[1350px] mx-auto px-4 py-6 space-y-6 animate-pulse">
      <div className="h-8 w-40 rounded-md bg-gray-300" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="h-64 rounded-xl bg-gray-300" />
          <div className="h-4 w-3/4 rounded bg-gray-300" />
          <div className="h-4 w-5/6 rounded bg-gray-300" />
          <div className="h-4 w-2/3 rounded bg-gray-300" />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-32 rounded bg-gray-300" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-16 w-20 rounded-lg bg-gray-300" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-5/6 rounded bg-gray-300" />
                <div className="h-4 w-2/3 rounded bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-48 rounded-xl bg-gray-300" />
            <div className="h-4 w-5/6 rounded bg-gray-300" />
            <div className="h-4 w-4/6 rounded bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
