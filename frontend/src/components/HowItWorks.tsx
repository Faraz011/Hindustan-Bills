import { motion } from 'framer-motion'
import { QrCode, CreditCard, Smartphone } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: QrCode,
      title: "Scan QR Code",
      description: "Scan the QR Code displayed at checkout using your smartphone camera.",
      color: "from-primary-500 to-primary-700"
    },
    {
      number: 2,
      icon: CreditCard,
      title: "Confirm Payment",
      description: "Review your order and complete payment using your preferred payment method.",
      color: "from-green-500 to-emerald-500"
    },
    {
      number: 3,
      icon: Smartphone,
      title: "Digital Receipt",
      description: "Receive a digital receipt instantly on your device. No more paper waste!",
      color: "from-purple-500 to-violet-500"
    }
  ]

  return (
    <section id="how-it-works" className="section-padding bg-[#f4f4f4]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How it Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes checkout faster and more efficient for both business and customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
