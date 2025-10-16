import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection'
import KeyFeatures from '../components/landing/KeyFeatures'
import Statistics from '../components/landing/Statistics'
import CustomerTestimonials from '../components/landing/CustomerTestimonials'
import QuickStartGuide from '../components/landing/QuickStartGuide'
import PricingPlans from '../components/landing/PricingPlans'
import Navigation from '../components/layout/Navigation'

export default function GuestPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Blue Corner Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #bfdbfe, transparent),
        radial-gradient(circle 600px at 100% 200px, #bfdbfe, transparent)
      `,
        }}
      />
      {/* Your Content Here */}
      <div className="min-h-screen pt-4 relative z-10">
        {/* <Navigation type="main" /> */}

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
