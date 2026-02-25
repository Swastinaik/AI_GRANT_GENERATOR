"use client"
import Hero from "./components/Hero"
import Benefits from "@/components/landing/Benefits"
import FAQ from "@/components/landing/FAQ"
import SocialProof from "@/components/landing/SocialProof"
import {
    benefits,
    testimonials,
    faqs
} from "@/app/constants/landing/grant-reviewer"
export default function GrantReviewer() {
    return (
        <>
            <Hero />
            <Benefits benefits={benefits} />
            <SocialProof testimonials={testimonials} />
            <FAQ faqs={faqs} />
        </>
    )
}
