import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    console.log("Contact form data:", data)
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@hindustanbills.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Call us during business hours"
    },
    {
      icon: MapPin,
      title: "Office",
      details: "456 Business Rd, Melbourne VIC 3000 AU",
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "We're here to help"
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-[#e8e8e8] section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get In <span className="text-[#8246a6]">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're here to assist you with any inquiries or support you may need. 
              Reach out to us and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-600">We'll respond within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Get in touch with us through any of these channels. We're always happy to help!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                      <p className="text-gray-600 text-sm">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-primary-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                <p className="text-gray-600 mb-6">
                  For urgent matters, call our support line or use our live chat feature.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Support
                  </button>
                  <button className="btn-secondary flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Live Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
