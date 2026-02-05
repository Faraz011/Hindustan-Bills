import { motion } from "framer-motion";
import { Coffee, ShoppingBag, Shirt, Building2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const personas = [
  {
    icon: Coffee,
    title: "Cafés & QSR",
    benefit: "Faster table turns, higher ticket sizes",
    description: "QR table ordering, instant billing, AI-powered upsell suggestions for desserts and add-ons.",
    color: "from-[#561485] to-[#A13266]",
    bgColor: "from-purple-50 to-pink-50",
    borderColor: "border-[#561485]/20",
    image: "https://images.unsplash.com/photo-1759050480727-03453404ba46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWZlJTIwaW50ZXJpb3IlMjByZXRhaWx8ZW58MXx8fHwxNzcwMzI0OTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: ShoppingBag,
    title: "Retail & General Stores",
    benefit: "Zero checkout queues, real-time inventory",
    description: "Customer Scan & Go, barcode billing at counter, automatic inventory sync with each sale.",
    color: "from-[#3C47BA] to-blue-500",
    bgColor: "from-blue-50 to-indigo-50",
    borderColor: "border-[#3C47BA]/20",
    image: "https://images.unsplash.com/photo-1748344309193-a94eb93117a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdG9yZSUyMHJldGFpbHxlbnwxfHx8fDE3NzAzMjQ5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Shirt,
    title: "Fashion & Clothing",
    benefit: "Smart pricing, size analytics",
    description: "Track which sizes and styles sell fastest, get AI pricing suggestions, promote slow-movers automatically.",
    color: "from-[#A13266] to-pink-500",
    bgColor: "from-pink-50 to-rose-50",
    borderColor: "border-[#A13266]/20",
    image: "https://images.unsplash.com/photo-1764631947499-1cb6cb0de4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHN0b3JlJTIwcmV0YWlsJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAzMjQ5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Building2,
    title: "Chains & Franchises",
    benefit: "Multi-location control, white-label ready",
    description: "Central dashboard for all outlets, unified inventory, custom branding, franchise-ready infrastructure.",
    color: "from-[#561485] to-[#3C47BA]",
    bgColor: "from-purple-50 to-blue-50",
    borderColor: "border-[#561485]/20",
    image: "https://images.unsplash.com/photo-1765877675064-92dfdeec6045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwcXVpY2slMjBzZXJ2aWNlfGVufDF8fHx8MTc3MDMyNDk4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
];

const WhoWeServeSection = () => {
  return (
    <section id="solutions" className="relative">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
            Built for{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#561485]">modern Indian commerce</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#A13266]/10" />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From street cafés to national chains – one platform that scales with your ambition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`group bg-gradient-to-br ${persona.bgColor} rounded-3xl border-2 ${persona.borderColor} overflow-hidden transition-all hover:shadow-xl`}
              >
                {/* Image header */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={persona.image}
                    alt={persona.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                  
                  {/* Floating icon */}
                  <div className="absolute bottom-4 left-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${persona.color} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{persona.title}</h3>
                  <div className="text-sm font-semibold text-green-600 mb-3">{persona.benefit}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{persona.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
