import { motion } from "framer-motion";
import { Check, X, Shield, Zap, TrendingUp, Clock, CloudOff, Cloud } from "lucide-react";

const comparisons = [
  {
    category: "Checkout Speed",
    traditional: "5-10 minutes (Queues)",
    hindustanBills: "10 seconds (Scan & Go)",
    icon: Clock,
  },
  {
    category: "Connectivity",
    traditional: "Stops without internet",
    hindustanBills: "Offline-first (Always works)",
    icon: Cloud,
  },
  {
    category: "GST Compliance",
    traditional: "Manual GSTR-1 preparation",
    hindustanBills: "Instant GSTR-1 reports",
    icon: Shield,
  },
  {
    category: "Business Growth",
    traditional: "Basic sales reporting",
    hindustanBills: "AI Margin & Demand insights",
    icon: TrendingUp,
  },
];

const ComparisonSection = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-bold tracking-tight">
            More than a billing software.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#561485]">A retail OS.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#A13266]/10" />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Join the modern retail revolution. Compare the old vs. the new.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* DULL CARD: Traditional POS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-[#F8FAFC] rounded-[2.5rem] border-2 border-slate-200 p-8 lg:p-12 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200/50 border border-slate-300 mb-8">
                <X className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">Traditional Systems</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">The Legacy Way</h3>

              <div className="space-y-6">
                {comparisons.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.category}</div>
                      <div className="text-sm font-bold text-slate-600">{item.traditional}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200">
               
              </div>
            </div>
            
            {/* Background pattern for dull card */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          </motion.div>

          {/* VIBRANT CARD: Hindustan Bills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#561485] via-[#A13266] to-[#3C47BA] rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-[#561485]/20 overflow-hidden"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                <Check className="w-4 h-4 text-white" />
                <span className="text-xs font-black uppercase tracking-widest text-white/90">Hindustan Bills</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">The Future of Retail</h3>

              <div className="space-y-6">
                {comparisons.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">{item.category}</div>
                      <div className="text-sm font-bold text-white">{item.hindustanBills}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-[#561485] rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-black/20"
                >
                  Switch to Modern Billing
                </motion.button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
