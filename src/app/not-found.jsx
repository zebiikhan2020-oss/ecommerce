import Link from "next/link";

export default function NotFound() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">

      <div className="text-center">

        <h1 className="text-8xl font-extrabold text-blue-600">

          404

        </h1>

        <h2 className="text-3xl font-bold mt-4">

          Page Not Found

        </h2>

        <p className="text-gray-600 mt-4 max-w-md mx-auto">

          Sorry, the page you are looking for doesn't exist or has been moved.

        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          Go Back Home
        </Link>

      </div>

    </div>

  );

}