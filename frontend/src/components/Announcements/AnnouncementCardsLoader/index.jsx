const AnnouncementCardsLoader = () => {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-25px_rgba(0,0,0,0.05)] border border-gray-100 animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Visual Content Placeholder */}
        <div className="md:w-[40%] bg-gray-100 relative min-h-[300px]">
          <div className="absolute top-6 left-6 h-6 w-24 bg-gray-200 rounded-2xl"></div>
          <div className="absolute bottom-6 left-6 right-6 h-20 bg-gray-200/50 rounded-[1.5rem]"></div>
        </div>

        {/* Info Content Placeholder */}
        <div className="md:w-[60%] p-8 md:p-10 space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="h-3 w-32 bg-gray-100 rounded-full"></div>
          </div>

          <div className="space-y-3">
            <div className="h-10 bg-gray-200 w-3/4 rounded-2xl"></div>
            <div className="h-10 bg-gray-200 w-1/2 rounded-2xl"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-100 w-full rounded-full"></div>
            <div className="h-4 bg-gray-100 w-5/6 rounded-full"></div>
            <div className="h-4 bg-gray-100 w-4/6 rounded-full"></div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="h-14 bg-gray-200 w-full rounded-[1.25rem]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCardsLoader;
