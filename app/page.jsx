"use client"
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome to the Meetroom Booking System</h1>
                <div className="flex flex-col space-y-4">
                    <Link href="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        Login
                    </Link>
                    <Link href="/auth/register" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                        Register
                    </Link>
                    <Link href="/booking" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
                        Booking
                    </Link>
                    <Link href="/rooms" className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                        Rooms
                    </Link>
                </div>
            </div>
        </div>
    )
}