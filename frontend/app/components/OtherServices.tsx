'use client'
import React from "react";
import Link from "next/link";

const OtherService = () => {
    return(
        <div className="w-full h-[300px] p-10 flex flex-col mt-16">
            <h2 className="text-3xl sm:text-5xl text-center font-extrabold text-white mb-8 animate-fade-in-up ">
          Other Services...
        </h2>
        <div className="flex items-center justify-center gap-3">
        <Link href={`/resume-generate`}>
        <div className="h-54 bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800
                 flex flex-col items-center text-center justify-center
                 transform transition-all duration-500 ease-in-out hover:cursor-pointer
                 hover:scale-105 hover:shadow-2xl  hover:border-purple-600">
            <h3 className="text-white text-2xl font-semibold mb-3">Resume Generation</h3>
        </div>
        </Link>
        </div>
        </div>
    )
}


export default OtherService