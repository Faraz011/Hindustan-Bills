import { motion } from 'framer-motion'
import { QrCode, Smartphone, CheckCircle2 } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      num: "1",
      icon: QrCode,
      title: "Scan QR",
      desc: "Instant access to digital checkout via dynamic Store QR."
    },
    {
      num: "2",
      icon: Smartphone,
      title: "Select & Pay",
      desc: "Cart management and one-tap UPI payments on your device."
    },
    {
      num: "3",
      icon: CheckCircle2,
      title: "Digital Receipt",
      desc: "Eco-friendly bills delivered instantly via WhatsApp or SMS."
    }
  ]

  return (
    <section id="howitworks" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container-custom">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <span className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3 block">Seamless Experience</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            From Scan to Receipt in <span className="text-accent underline decoration-4 decoration-accent/20">Seconds</span>.
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Eliminate hardware dependency. A complete billing infrastructure that lives on your customer's smartphone.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
            {/* Connected Line Background */}
            <div className="hidden md:block absolute top-24 left-10 right-10 h-1 bg-gray-200 rounded-full -z-10"></div>

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative text-center bg-gray-50 md:bg-transparent"
                >
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 border border-gray-100 relative z-10">
                     <div className="text-2xl font-bold text-gray-300 absolute -top-3 -right-3 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-4 border-gray-50 text-white text-sm">
                       {step.num}
                     </div>
                     <step.icon size={32} className="text-primary-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed px-4">{step.desc}</p>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
