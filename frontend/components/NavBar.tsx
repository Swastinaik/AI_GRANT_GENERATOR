'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../app/components/ToggleTheme';
import { navLinks } from '../app/lib/constants';
import useAuthStore from '@/app/store/AuthStore';
import { Button } from '@/components/ui/button';
const NavBar = () => {
    const accessToken = useAuthStore((state)=> state.accessToken)
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // close mobile menu on route change


    // add subtle shadow when scrolling
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <header className={` w-full top-0 z-40 transition-shadow bg-bg backdrop-blur-sm mb-4 md:mb-8 ${scrolled ? 'shadow-elev-1' : ''}`}>
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            {/* simple svg logo */}
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
                            </svg>
                            <span className="font-semibold text-lg text-text">Docs4All</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-8 md:justify-end">
                        <ThemeToggle />
                        {navLinks.map((link) => (
                            <Link
                                key={link.link}
                                href={link.link} 
                            >
                                <Button variant='link'>{link.name}</Button>
                                
                            </Link>
                        ))}
                        
                    </div>
                    <Link href={`${accessToken ? '/me': '/login'}`} >
                            <Button variant='secondary' >{accessToken ? 'Dashboard' : 'Login'}</Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default NavBar;