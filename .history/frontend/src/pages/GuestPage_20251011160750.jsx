import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection'
import KeyFeatures from '../components/landing/KeyFeatures'
import Statistics from '../components/landing/Statistics'
import CustomerTestimonials from '../components/landing/CustomerTestimonials'
import QuickStartGuide from '../components/landing/QuickStartGuide'
import PricingPlans from '../components/landing/PricingPlans'
import Navigation from './components/layout/Navigation'

export default function GuestPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}

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

  )
}
