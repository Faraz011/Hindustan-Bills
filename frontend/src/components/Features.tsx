import { motion } from 'framer-motion'
import { Receipt, BarChart3, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Contactless Checkout",
      description: "Enable customers to scan, pay, and go directly from their smartphones.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Receipt,
      title: "Smart Digital Receipts",
      description: "Send automated, eco-friendly digital receipts via SMS, WhatsApp, or Email.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: "Bank-grade encryption for every transaction. PCI-DSS compliant infrastructure.",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Visual dashboards for sales trends, inventory alerts, and customer insights.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <span className="text-accent font-bold tracking-wide uppercase text-sm mb-3 block">Platform Features</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
             All the tools you need to <span className="text-primary-600">scale your retail business.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            We've distilled complex billing infrastructure into a simple, powerful suite of tools designed for modern Indian retailers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon strokeWidth={2} size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                Learn more <ArrowRight size={16} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
