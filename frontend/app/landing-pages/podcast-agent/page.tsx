"use client"
import { benefits,
        testimonials,
        faqs
 } from "@/app/constants/landing/podcast-agent"
import Hero from "./components/Hero"
import Benefits from "@/components/landing/Benefits"
import FAQ from "@/components/landing/FAQ"
import SocialProof from "@/components/landing/SocialProof"

const LandingPage = () => {
    return(
        <>
            <Hero/>
            <Benefits benefits={benefits}/>
            <SocialProof testimonials={testimonials}/>
            <FAQ faqs={faqs}/>
        </>
    )
}

export default LandingPage