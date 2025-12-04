import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Manager, Supermart",
      avatar: "RK",
      rating: 5,
      text: "Hindustan Bills has transformed our checkout process, making it faster and more efficient for our customers. The instant digital receipts are a game changer!"
    },
    {
      name: "Priya Sharma",
      role: "Store Owner, QuickMart",
      avatar: "PS",
      rating: 5,
      text: "The QR-based system has reduced our checkout time by 70%. Customers love the convenience and we love the efficiency!"
    },
    {
      name: "Amit Patel",
      role: "CEO, Retail Chain",
      avatar: "AP",
      rating: 5,
      text: "Implementing Hindustan Bills was the best decision for our business. The dashboard provides excellent insights into our sales performance."
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our businesses that have transformed their checkout experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 card-hover"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
