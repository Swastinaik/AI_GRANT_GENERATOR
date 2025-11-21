'use client'
import Link from "next/link";
import { Button } from "./ui/button";
const HeroSection = () => {
  return(
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-8">
      <h1 className="text-7xl font-bold text-center text-accent-foreground">Your one stop solution for grants.<br/>Other Docs.</h1>
      <p className="text-lg text-center text-muted-foreground max-w-2xl">
        Welcome to Docs4all the ultimate platform for discovering and applying for grants using the power of AI.
      </p>
      <Link href={'/me'}>
      <Button size="lg">Get Started</Button>
      </Link>
      
      
    </div>
  )
}

export default HeroSection;