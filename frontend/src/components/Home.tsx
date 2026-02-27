import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
            <h1 className="text-4xl font-bold text-black mb-6">
                Welcome to Eventz
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mb-12">
                A simple platform for managing your event bookings, clients, and financial tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <Link
                    to="/dashboard"
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded font-medium flex justify-center items-center gap-2"
                >
                    Go to Dashboard
                </Link>

                <Link
                    to="/orders/new"
                    className="flex-1 py-3 px-6 bg-white border border-gray-300 text-black rounded font-medium flex justify-center items-center gap-2"
                >
                    New Order
                </Link>
            </div>
        </div>
    );
}