import { motion } from "framer-motion"
import { CreditCard, QrCode } from "lucide-react"

interface PaymentStepProps {
  onSelect: (method: string) => void
  onBack: () => void
}

const PaymentStep = ({ onSelect, onBack }: PaymentStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose Payment Method
      </h3>

      <div className="space-y-4">
        <button
          onClick={() => onSelect("UPI")}
          className="w-full p-4 border-2 border-primary-500 rounded-lg hover:bg-primary-50 flex items-center justify-center"
        >
          <QrCode className="w-6 h-6 mr-3 text-primary-600" />
          <span className="font-semibold">Pay with UPI</span>
        </button>

        <button
          onClick={() => onSelect("Credit/Debit Card")}
          className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
        >
          <CreditCard className="w-6 h-6 mr-3 text-gray-600" />
          <span className="font-semibold">Credit/Debit Card</span>
        </button>

        <button
          onClick={() => onSelect("Cash on Delivery")}
          className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
        >
          <span className="text-2xl mr-3">💵</span>
          <span className="font-semibold">Cash on Delivery</span>
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full mt-4 text-gray-600 hover:text-gray-800"
      >
        ← Back
      </button>
    </motion.div>
  )
}

export default PaymentStep
