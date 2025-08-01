'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import {Grant} from '../lib/utils/types'
interface GrantCardProps {
    grant: Grant;
}
export default function GrantCard( grant :GrantCardProps) {
  const {id,title,agency,agencyCode,openDate,closeDate,link,score} = grant.grant
  const funders_detail={'id':id,'title':title,'agency':agency,'agencyCode':agencyCode,'openDate':openDate,'closeDate':closeDate,'link':link}
  const router = useRouter()
  const handleGenerate = () => {
  try {
    router.push(`/generate-grant`)
  } catch (error) {
    console.log(error)
  }
  };

  return (
    <div className="dark bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-xl p-6 max-w-md w-full mx-auto transition-all hover:scale-105 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">{title}</h2>
      <div className="space-y-2 text-gray-300">
        <p><span className="font-semibold text-white">Agency:</span> {agency}</p>
        <p><span className="font-semibold text-white">Agency Code:</span> {agencyCode}</p>
        <p><span className="font-semibold text-white">Open Date:</span> {openDate}</p>
        <p><span className="font-semibold text-white">Close Date:</span> {closeDate}</p>
        <p><span className="font-semibold text-white">Score:</span> {score} (for your granrt)</p>
        
      </div>
      {/* Buttons at the bottom-right corner */}
      <div className="flex justify-end gap-4 mt-6">
        <Link href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
        <button
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all"
        >
          Apply
        </button>
        </Link>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-fuchsia-500 via-blue-500 to-pink-400 text-white shadow-lg ring-2 ring-white/10 hover:from-pink-600 hover:to-blue-600 transition-all"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
