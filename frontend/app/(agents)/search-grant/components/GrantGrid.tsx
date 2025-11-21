'use client';

import GrantCard from './GrantCard'; // Adjust the import path based on your file structure
import { GrantType } from '@/app/lib/utils/types';
import HomeButton from '@/app/components/HomeButton';
export default function GrantsGrid({ grants }: { grants: GrantType[] }) {
  return (
    <div className=" py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className='flex flex-col gap-2'>
          <div className='flex flex-start'>
          <HomeButton/>
          </div>
        <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-10 tracking-wide text-white">Available Grants</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
        {grants.length === 0 && (
          <p className="text-center text-gray-400 text-lg mt-10">No grants available at the moment.</p>
        )}
        </div>
      </div>
    </div>
  );
}
