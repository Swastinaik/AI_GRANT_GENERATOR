'use client'
import React from 'react'
import Hero from '../components/Hero'
import FeatureCards from '../components/FeatureCards'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'
import FeaturesSection from '../components/Features'
import HeroSection from '../components/Herosection'
const page = () => {
  return (
    <div>
      <NavBar/>
       <HeroSection/>
      <FeatureCards/>
      <FeaturesSection/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default page