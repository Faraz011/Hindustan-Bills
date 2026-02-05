import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Is there a setup fee for retailers?",
      answer: "No, Hindustan Bills is completely free to start. We charge a minimal transaction fee only when you process payments successfully."
    },
    {
      question: "Can I integrate this with my existing POS?",
      answer: "Yes, our API and standard hardware support allows for seamless integration with most modern Point of sale systems."
    },
    {
      question: "How secure are the UPI transactions?",
      answer: "We use bank-grade encryption and direct API partnerships with NPCI-certified payment gateways to ensure 100% secure payments."
    },
    {
      question: "Do customers need to download an app?",
      answer: "No app required for customers. They simply scan your store's QR code with any camera or UPI app to view the bill and pay."
    }
  ]

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <span className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3 block">Common Questions</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Details required for <span className="text-primary-600">Decision Making.</span>
            </h2>
            <p className="text-xl text-gray-500 mb-8">
              Everything you need to know about our billing infrastructure and pricing models.
            </p>
            
            <a href="mailto:support@hindustanbills.com" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
              <MessageCircle size={20} /> Contact Support
            </a>
          </motion.div>

          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? "bg-white border-primary-100 shadow-lg" 
                    : "bg-white border-transparent hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between"
                >
                  <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-primary-900' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'rotate-180 text-primary-600' : 'text-gray-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "circOut" }}
                    >
                      <div className="px-8 pb-8 pt-0">
                        <p className="text-gray-600 leading-relaxed text-base border-t border-gray-100 pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default FAQ
