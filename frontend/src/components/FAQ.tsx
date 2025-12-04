import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is Hindustan Bills?",
      answer: "Hindustan Bills is a digital billing solution that simplifies the checkout process. It allows customers to scan QR codes, make payments, and receive instant digital receipts. This innovative approach reduces waiting times and enhances the shopping experience."
    },
    {
      question: "How does it work?",
      answer: "To use Hindustan Bills, customers scan a QR code at checkout. They can then complete their payment using various methods like UPI or credit cards. After the transaction, a digital receipt is sent directly to their phone."
    },
    {
      question: "Is it secure?",
      answer: "Yes, Hindustan Bills prioritizes security with encrypted transactions. Customers can shop confidently knowing their payment information is protected. Our system complies with industry standards to ensure a safe checkout experience."
    },
    {
      question: "How to get started?",
      answer: "To get started, simply visit our website and sign up for a merchant account. Once registered, you can integrate our system with your existing POS software. Start offering a modern checkout experience to your customers today!"
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            FAQs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to your questions about our digital billing solution and how it works.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-primary-500" />
                  ) : (
                    <Plus className="w-6 h-6 text-primary-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">
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
    </section>
  )
}

export default FAQ
