import { Button } from "../ui/button"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Instant EV Power Swap - Anytime, Anywhere
              <span className="text-blue-600"> Convenience</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Experience the future of EV charging with our automated battery swap stations.
              Save time, reduce range anxiety, and get back on the road in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Link to="/register">Sign up now →</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                Find Nearest Station
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-6xl">🔌</div>
            </div>
            {/* Placeholder for actual EV charging image */}
          </div>
        </div>
      </div>
    </section>
  )
}