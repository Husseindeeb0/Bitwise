const AnnouncementDetailsLoader = () => {
  return (
    <div className="min-h-screen mt-20 animate-pulse">
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full overflow-hidden bg-gray-200" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>

                <div className="mt-6 mb-8">
                  <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-gray-200 pl-4 pb-4"
                      >
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-48 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center h-20 p-4 bg-white rounded-lg border"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-200" />
                      <div className="ml-4">
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-6 space-y-4">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailsLoader;
