import { motion } from "framer-motion";
import { Scan, ShoppingCart, FileText, TrendingUp, Zap } from "lucide-react";

const steps = [
  {
    icon: Scan,
    title: "Scan",
    description: "Customer scans product or table QR",
    color: "from-[#561485] to-[#A13266]",
    glow: "shadow-[#561485]/20",
  },
  {
    icon: ShoppingCart,
    title: "Checkout",
    description: "Cart built, UPI/card payment",
    color: "from-[#3C47BA] to-blue-500",
    glow: "shadow-[#3C47BA]/20",
  },
  {
    icon: FileText,
    title: "Invoice",
    description: "GST-compliant invoice generated automatically",
    color: "from-green-500 to-emerald-500",
    glow: "shadow-green-500/20",
  },
  {
    icon: TrendingUp,
    title: "Insights",
    description: "Data feeds AI to improve pricing, promotions, stocking",
    color: "from-[#A13266] to-pink-500",
    glow: "shadow-[#A13266]/20",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 mb-6"
          >
            <Zap className="w-4 h-4 text-[#561485]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">The Workflow</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6 font-black tracking-tight">
            From scan to{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#561485]">GST invoice</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-[#A13266]/10 -rotate-1" />
            </span>
            {" "}in seconds
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Zero friction. Zero hardware. Complete automation for the modern retailer.
          </p>
        </motion.div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative pt-12">
            {/* Connection line background */}
            <div className="absolute top-[108px] left-0 right-0 h-1 bg-slate-100 rounded-full" />
            
            {/* Animated pulse line */}
            <motion.div 
              className="absolute top-[108px] left-0 h-1 bg-gradient-to-r from-[#561485] via-[#3C47BA] to-green-400 rounded-full z-10"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            <div className="grid grid-cols-4 gap-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="relative group"
                  >
                    {/* Step number badge */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-20 shadow-sm group-hover:border-[#561485] transition-colors">
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-[#561485]">{index + 1}</span>
                      </div>
                    </div>

                    {/* Icon Circle */}
                    <div className="relative mb-8 flex justify-center z-20">
                      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl ${step.glow} group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center px-4">
                      <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{step.title}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-6"
              >
                {/* Left: Icon and connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl ${step.glow} flex-shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 flex-1 mt-4 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`w-full bg-gradient-to-b ${step.color}`} 
                        initial={{ height: "0%" }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div className="flex-1 py-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-[#561485] bg-[#561485]/5 px-3 py-1 rounded-full uppercase tracking-widest">
                      Step {index + 1}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
