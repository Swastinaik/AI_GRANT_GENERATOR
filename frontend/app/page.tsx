'use client'
import Hero from "@/components/Home/HeroSection"
import AgentSuite from "@/components/Home/AgentSuit"
import EcosystemFeature from "@/components/Home/EcoSystemFeature"
import Pricing from "@/components/Home/Pricing"
import Footer from "@/components/landing/Footer"
const Main = () => {
    return(
      <main>
        {/* */}
           
            
            <Hero />
            <AgentSuite/>
            <EcosystemFeature/>
            <Pricing/>
            <Footer/>
            
        </main>

    )
}

export default Main;