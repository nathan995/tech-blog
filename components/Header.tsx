import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className="sticky  top-0 z-50  mx-auto  flex max-w-7xl justify-between bg-white px-5 py-2">
      <div className="flex items-center space-x-5">
        <Link href="/" className="max-w-xl text-6xl">
          <img
            className="h-16 w-16 cursor-pointer object-contain"
            src="https://logodix.com/logo/986337.png"
            alt=""
          />
        </Link>
      </div>

      <div className="hidden items-center space-x-5 md:inline-flex">
        <h3>About</h3>
        <h3>Contact</h3>
      </div>
    </header>
  )
}

export default Header
