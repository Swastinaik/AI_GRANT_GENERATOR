import React from "react";
import NavBar from "@/components/landing/NavBar"
import Footer from "@/components/landing/Footer"
export default function LandingPageLayout({children}:{children: React.ReactNode}){
    return(
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
            <NavBar/>
            {children}
            <Footer/>
        </div>
    )
}