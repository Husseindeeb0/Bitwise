const AnnouncementCardsLoader = () => {
  return (
    <div className="bg-light-purple border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 md:my-auto md:ml-5 md:mr-0 mx-5 mt-5">
          <div className="w-full h-52 bg-gray-300"></div>
        </div>
        <div className="md:w-2/3 p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex">
              <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-300 rounded-full ml-2"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="h-7 bg-gray-300 w-3/4 mb-3 rounded"></div>
          <div className="h-4 bg-gray-300 w-full mb-2 rounded"></div>
          <div className="h-4 bg-gray-300 w-5/6 mb-4 rounded"></div>

          <div className="mt-3 flex flex-col space-y-3">
            <div className="flex items-center">
              <div className="h-5 w-5 bg-gray-300 rounded mr-2"></div>
              <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 bg-gray-300 rounded mr-2"></div>
              <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-5 bg-gray-300 w-24 mb-2 rounded"></div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-300 px-4 py-3 rounded-md w-32"></div>
              <div className="flex items-center gap-2 bg-gray-300 px-4 py-3 rounded-md w-36"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCardsLoader;