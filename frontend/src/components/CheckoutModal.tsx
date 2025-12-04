import { motion } from "framer-motion"
import { useState } from "react"
import { CreditCard, QrCode, Truck, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import PaymentStep from "./PaymentStep"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutModalProps {
  cart: CartItem[]
  onClose: () => void
  onSuccess: () => void
}

const CheckoutModal = ({ cart, onClose, onSuccess }: CheckoutModalProps) => {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState<string>("")
  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0)

  const handlePayment = (selectedMethod: string) => {
    setMethod(selectedMethod)
    setStep(3)
    setTimeout(() => {
      toast.success(`Payment successful via ${selectedMethod}`)
      onSuccess()
      onClose()
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        {step === 1 && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Order Summary
            </h3>
            <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3 mb-4">
              <span>Total</span>
              <span className="text-primary-600">₹{total}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary py-3"
            >
              Continue to Payment
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </>
        )}

        {step === 2 && (
          <PaymentStep
            onSelect={handlePayment}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for shopping with us.
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CheckoutModal
