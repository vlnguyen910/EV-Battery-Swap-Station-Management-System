import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection'
import KeyFeatures from '../components/landing/KeyFeatures'
import Statistics from '../components/landing/Statistics'
import CustomerTestimonials from '../components/landing/CustomerTestimonials'
import QuickStartGuide from '../components/landing/QuickStartGuide'
import PricingPlans from '../components/landing/PricingPlans'

export default function GuestPage() {
  const navigate = useNavigate();

  return (

    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Light Sky Blue Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
       radial-gradient(circle at center, #93c5fd, transparent)
     `,
        }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Key Features */}
        <KeyFeatures />

        {/* Statistics */}
        <Statistics />

        {/* Customer Testimonials */}
        <CustomerTestimonials />

        {/* Quick Start Guide */}
        <QuickStartGuide />

        {/* Pricing Plans */}
        <PricingPlans />

        {/* Call to Action Section */}

      </div>
    </div>

  )
}
