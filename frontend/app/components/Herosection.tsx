import react from 'react'

import { BackgroundBeams } from '@/components/ui/background-beams'
import { AuroraText } from "@/components/magicui/aurora-text";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Link from 'next/link';

const HeroSection = () => {
    return(
        <div id='home' className='flex flex-col items-center justify-center w-full mt-20 gap-20 p-25'>
            <div className='flex flex-col items-center justify-center gap-7 z-10'>
                <div className='flex flex-col items-center justify-center gap-5'>
                    <h1 className='sm:text-7xl text-5xl font-bold text-white'>AI Grant Generator for</h1>
                    <h1 className='sm:text-7xl text-5xl font-bold text-white'><AuroraText>Non-Profit </AuroraText> Organizations</h1>
                </div>
                <p className='text-xl text-[#e0e0e0]'>The One stop solution for searching and generating grants.</p>
            </div>
            <div className='flex flex-row items-center justify-center sm:gap-8 gap-4 z-10'>
                <Link href={'/generate-grant'}>
                <InteractiveHoverButton className='sm:w-60 w-30 h-12 flex justify-center items-center p-3  text-black rounded-xl'>
                    Generate Grant</InteractiveHoverButton>
                </Link>
                <Link href={'/search-grant'}>
                <InteractiveHoverButton className='sm:w-60 w-30 h-12 flex justify-center items-center p-3  text-black rounded-xl'>
                    Search Grant</InteractiveHoverButton>
                </Link>
            </div>
            <BackgroundBeams/>
        </div>
    )
}

export default HeroSection