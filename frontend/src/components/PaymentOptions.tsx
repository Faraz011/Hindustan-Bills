export default function PaymentOptions() {
  const paymentMethods = [
    { name: "Credit / Debit Card", icon: "💳" },
    { name: "UPI (PhonePe, GPay, Paytm)", icon: "📱" },
    { name: "Net Banking", icon: "🏦" },
    { name: "Cash on Delivery", icon: "💵" },
    { name: "Wallets (Amazon Pay, PayZapp)", icon: "👜" },
    { name: "EMI / Pay Later", icon: "⌛" },
  ];

  return (
    <section id="payment-options" className="bg-white py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Supported Payment Modes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex items-center justify-center border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 bg-gray-50 hover:bg-gray-100"
          >
            <span className="text-3xl mr-3">{method.icon}</span>
            <span className="font-medium text-gray-700">{method.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
