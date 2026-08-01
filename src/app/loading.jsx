export default function Loading() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="text-center">

        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-6 text-xl font-semibold text-gray-700">

          Loading...

        </p>

      </div>

    </div>

  );

}