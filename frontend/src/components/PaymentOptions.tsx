import { CreditCard, Smartphone, Landmark, Wallet } from 'lucide-react'

export default function PaymentOptions() {
  const paymentMethods = [
    { name: "Cards", icon: CreditCard, color: "text-blue-500" },
    { name: "UPI", icon: Smartphone, color: "text-green-500" },
    { name: "NetBanking", icon: Landmark, color: "text-purple-500" },
    { name: "Wallets", icon: Wallet, color: "text-orange-500" },
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container-custom text-center">
        <p className="text-gray-500 font-medium mb-12">Powering payments for India's best businesses</p>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {paymentMethods.map((method, index) => (
             <div key={index} className="flex items-center gap-2 group cursor-default">
               <method.icon className={`w-8 h-8 ${method.color}`} />
               <span className="text-xl font-bold text-gray-800">{method.name}</span>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
