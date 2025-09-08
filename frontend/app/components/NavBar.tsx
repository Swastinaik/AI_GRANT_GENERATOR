import { useState, useEffect } from "react";

import { navLinks } from "../lib/utils/constants"
import useAuthStore from '@/app/store/AuthStore'
import Link from "next/link";
const NavBar = () => {
  const user = useAuthStore((s)=> (s.user))
  const isAuthenticated = useAuthStore((s)=> (s.isAuthenticated))
  const checkAuth = useAuthStore((s)=> (s.checkAuth))

  async function refreshAuth(){
    console.log(isAuthenticated)

    const isValid =  await checkAuth()
    if(!isValid){
      console.log('user not authenticated')
    }
        console.log(isAuthenticated)

  }
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    refreshAuth()
  },[])
  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Grant AI
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({link, name})=> (
              <li key={name}>
                <a href={link} ><span>{name}</span> <span className="underline" /></a>
              </li>
            ))}
          </ul>
        </nav>
        {/*
        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        */}
        {isAuthenticated ?   <p className="text-white font-bold ">{user?.username}</p>  : 
          <Link href={'/login'}>
          <div className="inner">
            <span>Login</span>
          </div>
        </Link>
        }
        
      </div>
    </header>
  );
}

export default NavBar;
