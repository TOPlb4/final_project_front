"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [ isLogedIn, setIsLogedIn ] = useState(false)
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem("auth")
    window.location.href = "/"
  }

  useEffect(() => {
    const token = localStorage.getItem("auth")
    if(token) setIsLogedIn(true)
  }, [])

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/">
          <h1 className="text-lg font-bold">CharGunroom</h1>
        </Link>
        <div>
          {
            !isLogedIn ?
            <>
              <Link href="/auth/login" className="mx-2">Login</Link>
              <Link href="/auth/register" className="mx-2">Register</Link>
            </>
            :
            <>
              <Link href="/booking" className="mx-2">Booking</Link>
              <Link href="/rooms" className="mx-2">Rooms</Link>
              <a onClick={logout} className="mx-2 cursor-pointer">Logout</a>
            </>
          }
        </div>
      </div>
    </nav>
  );
}
