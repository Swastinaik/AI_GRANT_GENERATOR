"use client";
import { fetchWithAuth } from '@/app/lib/api';
import React, { useEffect, useState } from 'react';
import useAuthStore from '@/app/store/AuthStore';
import { Progress } from "@/components/ui/progress"
import { mapUsageToProgress, formatDate } from '@/app/lib/utils/helpers';
import { services } from '@/app/lib/constants';
import Link from 'next/link';
import { set } from 'react-hook-form';
interface User {
    username: string;
    email: string;
    isAdmin: boolean;
}
const Me = () => {
    const [user, setUser] = useState<any | null>(null);

    const [usage, setUsage] = useState<any | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = React.useState(0);
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { method: 'POST' }, accessToken, setAccessToken);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                const { user, usage } = data;
                console.log('yser:', user);
                console.log('usage:', usage);
                const progress = mapUsageToProgress(usage?.count, 5); // Assuming 5 is the max limit for usage
                setProgress(progress);
                setUser(user.username);
                setUsage(usage);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData()
    }, [accessToken, setAccessToken])
    return (
        <div className="page-container p-8 space-y-16">
            <div className='flex mt-8 pb-16 justify-between items-center w-full md:flex-row flex-col border-b space-y-4 md:space-y-0'>
                <h1 className='text-foreground text-4xl font-semibold'>Hello {user} !</h1>
                <div className='flex flex-col  space-y-4'>
                    <div className='bg-card rounded-lg shadow-lg p-4 space-y-2'>
                        <h2 className='flex flex-start text-foreground text-lg font-semibold'>Usage:</h2>
                        <Progress value={progress} />
                        <p className='text-primary text-sm'>You have used {usage?.count} out of 5 requests.</p>
                    </div>
                    
                </div>
                <p className='text-primary-background'>Current Date: {formatDate(usage?.date)}</p>
            </div>

            <div className='flex flex-col space-y-4'>
                <h1 className='flex flex-start text-3xl font-bold '>Services</h1>
                <div className=' grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {
                       services.map((service, index) => (
                            <div key={index} className=' bg-card rounded-lg shadow-lg p-4 hover:shadow-xl hover:border transition-shadow duration-500 cursor-pointer'>
                                <Link href={service.link} className='w-full h-full flex flex-col items-center justify-center'>
                                <h2 className='text-foreground text-xl font-semibold'>{service.name}</h2>
                                <p className='text-primary text-sm mt-2'>Click to {service.link.includes('generate-grant') ? 'generate a grant proposal' : service.link.includes('search-grant') ? 'search for grants' : 'generate a resume'}</p>
                                </Link>
                            </div>
                        )) 
                    }
                </div>
            </div>
        </div>
    )
}

export default Me;