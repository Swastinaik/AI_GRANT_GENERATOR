"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Meteors } from "@/components/magicui/meteors";
import { words } from "../lib/utils/constants";


const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>
      
      <div className="hero-layout pr-20 -mt-3">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1>
                AI Powered
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center md:gap-3 gap-1 pb-2"
                      >
                        <img
                          src={word.imgPath}
                          alt="person"
                          className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                        />
                        <span>{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <h1>Grant Writing Assistant</h1>
              <h1>For Non Profit Organizations.</h1>
            </div>

            <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
              The Revolutionizing way to generate grant proposals.
            </p>

            
          </div>
        </header>
          <Meteors/>
        {/* RIGHT: 3D Model or Visual */}
        
        <Link href={"/generate-grant"}>
        <button className="p-[3px] relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-white rounded-[10px]  relative group transition duration-200 text-black text-[18px] hover:bg-transparent hover:text-white">
            Create
          </div>
        </button>
        
        </Link>
       
      </div>

      {/*<AnimatedCounter />*/}
    </section>
  );
};

export default Hero;
