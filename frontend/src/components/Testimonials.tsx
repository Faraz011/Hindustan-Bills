import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Manager, Supermart",
      initials: "RK",
      text: "The checkout speed has improved by 40% since we switched. It's exactly the infrastructure upgrade we needed.",
    },
    {
      name: "Priya Sharma",
      role: "Owner, QuickMart",
      initials: "PS",
      text: "Digital receipts are a hit with our customers. The dashboard gives me clarity on my daily sales instantly.",
    },
    {
      name: "Amit Patel",
      role: "Director, Retail Chain",
      initials: "AP",
      text: "Robust, reliable, and zero downtime. This is enterprise-grade billing for modern Indian retail.",
    }
  ]

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container-custom">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-wide uppercase text-sm mb-3 block">Customer Stories</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Trusted by modern <span className="text-primary-600">Retailers</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex gap-1 mb-6">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                 ))}
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div>
                   <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                   <div className="text-gray-500 text-xs">{testimonial.role}</div>
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
