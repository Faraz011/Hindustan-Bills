import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, Star, Quote } from "lucide-react";

const logos = [
  { name: "Café Coffee Day", width: "w-32" },
  { name: "Haldiram's", width: "w-32" },
  { name: "FabIndia", width: "w-28" },
  { name: "Bikanervala", width: "w-32" },
  { name: "Third Wave Coffee", width: "w-40" },
  { name: "Wow! Momo", width: "w-32" },
];

const metrics = [
  {
    icon: Zap,
    value: "70% faster",
    label: "Checkout Flow",
    detail: "Average 12s vs 45s legacy systems",
    color: "from-orange-500 to-amber-500",
    glow: "shadow-orange-500/20",
  },
  {
    icon: TrendingUp,
    value: "₹60,000+",
    label: "Extra Monthly Profit",
    detail: "Per store through AI pricing & promo",
    color: "from-[#561485] to-[#A13266]",
    glow: "shadow-[#561485]/20",
  },
  {
    icon: Shield,
    value: "99.99%",
    label: "System Uptime",
    detail: "Proprietary offline-first architecture",
    color: "from-[#3C47BA] to-blue-500",
    glow: "shadow-blue-500/20",
  },
];

const SocialProofSection = () => {
  return (
    <section className="relative">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-xs font-black text-slate-300 uppercase tracking-widest">Trusted by the best</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl text-white mb-12 font-black tracking-tight max-w-3xl mx-auto leading-tight">
            The infrastructure behind India's{" "}
            <span className="bg-gradient-to-r from-[#A13266] to-[#3C47BA] bg-clip-text text-transparent">fastest growing retail brands</span>
          </h2>
          
          {/* Logo cloud - Horizontal flow */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`${logo.width} h-12 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 cursor-pointer`}
              >
                <div className="text-sm font-black text-slate-100 tracking-tighter uppercase whitespace-nowrap">{logo.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid - The "Good" design */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="relative bg-white rounded-[2rem] border-2 border-slate-100 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all group overflow-hidden"
              >
                {/* Visual accents */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-[0.03] rounded-bl-[4rem] group-hover:opacity-[0.08] transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-8 shadow-xl ${metric.glow} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
                  {metric.value}
                </div>
                <div className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                  {metric.label}
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {metric.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial - High fidelity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-white rounded-[3rem] border-2 border-slate-100 p-8 lg:p-16 shadow-2xl overflow-hidden group">
            {/* Background gradient blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#561485]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3C47BA]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              {/* Author side */}
              <div className="flex-shrink-0 text-center lg:text-left">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#561485] to-[#A13266] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-[#561485]/30 mb-6 mx-auto lg:mx-0">
                  PS
                </div>
                <div className="font-black text-slate-900 text-lg">Priya Sharma</div>
                <div className="text-xs font-black text-[#561485] uppercase tracking-widest">Brew & Bites Mumbai</div>
              </div>

              {/* Quote side */}
              <div className="flex-1 relative">
                <Quote className="absolute -top-8 -left-8 w-16 h-16 text-slate-100 -z-10 rotate-12" />
                <p className="text-xl lg:text-2xl text-slate-700 font-bold leading-relaxed mb-8">
                  "Hindustan Bills transformed our checkout. We went from 5-minute queues to 10-second scans. Our basket size is up 22%, and the AI pricing models literally pay for themselves."
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">+22%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basket Size</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">-80%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wait Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
