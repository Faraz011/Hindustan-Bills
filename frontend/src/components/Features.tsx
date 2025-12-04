import { motion } from 'framer-motion'
import { QrCode, Receipt, BarChart3 } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: QrCode,
      title: "Effortless QR-Based Billing for Quick and Easy Checkouts",
      description: "Scan, pay, and receive your receipt instantly with our QR technology.",
      color: "from-primary-500 to-primary-700"
    },
    {
      icon: Receipt,
      title: "Instant Digital Receipts Delivered Straight to Your Device",
      description: "Receive your receipts via SMS, email, or in-app for convenience.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Retailer Dashboard for Enhanced Management",
      description: "Track transactions and manage sales effortlessly with our intuitive dashboard.",
      color: "from-cyan-500 to-blue-500"
    }
  ]

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why choose Hindustan Bills?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our solution provides significant advantages for both customers and businesses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 card-hover group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
