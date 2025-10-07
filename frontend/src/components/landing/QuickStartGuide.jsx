const steps = [
  {
    icon: "👤",
    title: "Register",
    description: "Create an account via our mobile app or website"
  },
  {
    icon: "📍",
    title: "Select Station",
    description: "Find and choose the most convenient station for you"
  },
  {
    icon: "📅",
    title: "Book Swap Slot",
    description: "Reserve your slot through the app in seconds"
  },
  {
    icon: "🔋",
    title: "Receive New Battery",
    description: "Arrive at the station and get your fresh battery"
  }
]

export default function QuickStartGuide() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Quick Start Guide
          </h2>
          <p className="text-lg text-gray-600">
            Getting started with our battery swap service is simple and straightforward
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">
                  {step.icon}
                </span>
              </div>
              
              {/* Step Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              {/* Step Description */}
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
              
              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}