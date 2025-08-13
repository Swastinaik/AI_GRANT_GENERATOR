import React from 'react'
import Link from 'next/link'
const BackButton = () => {
  return (
    <Link href={'/main'}>
    <button className="p-[3px] relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-transparent rounded-[10px]  relative group transition duration-200 text-white text-[18px]  hover:text-white">
            HOME
          </div>
    </button>
    </Link>
  )
}

export default BackButton