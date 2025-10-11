import { Card, CardContent } from "../ui/card"

const testimonials = [
  {
    rating: 5,
    text: "PowerSwap has completely changed how I use my EV. No more range anxiety or waiting hours to charge. I'm in and out in minutes!",
    author: "Sarah L.",
    role: "Daily Commuter",
    avatar: "👩"
  },
  {
    rating: 5,
    text: "As a full-time driver, minimizing downtime is crucial. The subscription plan saves me money and the quick swaps keep me earning.",
    author: "Michael T.",
    role: "Rideshare Driver",
    avatar: "👨"
  },
  {
    rating: 5,
    text: "Managing a fleet of 15 EVs became so much easier with PowerSwap. The dashboard gives me all the insights I need in one place.",
    author: "Elena K.",
    role: "Business Fleet Manager",
    avatar: "👩‍💼"
  }
]

export default function CustomerTestimonials() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied EV owners who've made the switch to battery swapping
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="p-6">
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                {/* Author Info */}
                <div className="flex items-center">
                  <div className="text-3xl mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}