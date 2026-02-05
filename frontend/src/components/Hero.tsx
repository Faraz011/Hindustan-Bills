import { motion } from "framer-motion";
import { Play, ArrowRight, TrendingUp, ShoppingCart, BarChart3, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* Organic blob shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#561485]/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-[#3C47BA]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A13266]/5 rounded-full blur-3xl" />
      </div>

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #561485 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#561485]/20 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#561485]" />
              <span className="text-sm font-medium text-gray-700">
                Made in India · For India
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-6 leading-[1.1] font-bold tracking-tight">
              Checkout in{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#561485]">10 seconds</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#A13266]/20 -rotate-1" />
              </span>
              .<br />
              Not 5 minutes.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Billing infrastructure and Scan & Go checkout for cafés, retail, and restaurants – 
              GST-compliant, offline-first, and AI-powered to grow revenue and margins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-[#561485] to-[#A13266] text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#561485]/25 hover:shadow-xl hover:shadow-[#561485]/30 transition-all hover:scale-105 active:scale-95"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-[#3C47BA]/30 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
              >
                <Play className="w-5 h-5 text-[#3C47BA] fill-[#3C47BA]/10" />
                Watch 2-min Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium font-black uppercase tracking-widest text-[10px]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            {/* Main dashboard frame */}
            <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-[0_40px_80px_rgba(0,0,0,0.08)] overflow-hidden group">
              {/* Browser chrome */}
              <div className="bg-gray-50 border-b-2 border-gray-100 px-6 py-4 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider">
                  app.hindustanbills.com/dashboard
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-8 bg-gradient-to-br from-white to-slate-50/50">
                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="bg-white border-2 border-[#561485]/10 rounded-2xl p-5 shadow-sm">
                    <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-black">Today's Revenue</div>
                    <div className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">₹45,280</div>
                    <div className="text-[10px] text-emerald-500 font-black flex items-center gap-1">
                      <TrendingUp size={12} />
                      +18.2% vs yesterday
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#3C47BA]/10 rounded-2xl p-5 shadow-sm">
                    <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-black">Live Checkouts</div>
                    <div className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">12</div>
                    <div className="text-[10px] text-slate-500 font-bold">Avg 42 sec/checkout</div>
                  </div>
                </div>

                {/* Top products */}
                <div className="bg-white rounded-2xl p-5 mb-6 border-2 border-slate-100 shadow-sm">
                  <div className="text-[10px] text-slate-400 mb-4 uppercase tracking-widest font-black">Top Products</div>
                  <div className="space-y-3">
                    {[
                      { name: "Cappuccino", sales: 34, amount: "₹4,760", color: "bg-[#561485]" },
                      { name: "Cold Brew", sales: 28, amount: "₹3,920", color: "bg-[#3C47BA]" },
                      { name: "Sandwich", sales: 22, amount: "₹3,080", color: "bg-[#A13266]" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-slate-900 font-bold flex-1">{item.name}</span>
                        <span className="text-slate-400 font-medium">{item.sales}</span>
                        <span className="text-slate-900 font-black">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini chart */}
                <div className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm">
                  <div className="text-[10px] text-slate-400 mb-4 uppercase tracking-widest font-black">Hourly Revenue</div>
                  <div className="flex items-end justify-between h-20 gap-1.5 overflow-hidden">
                    {[40, 65, 45, 80, 70, 55, 90, 75, 60, 85].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.05 + 0.5 }}
                        className="flex-1 bg-gradient-to-t from-[#561485] to-[#3C47BA] rounded-t-lg group-hover:from-accent group-hover:to-primary-600 transition-all"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: Scan & Go Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-8 -left-8 lg:-left-16 w-60 bg-white rounded-[32px] border-2 border-gray-200 shadow-2xl overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50/50">
                <div className="bg-white border-2 border-green-100 rounded-2xl p-4 mb-4">
                  <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center border-2 border-green-200">
                    <div className="absolute inset-4 border-2 border-green-500/20 rounded-xl" />
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_15px_#10b981] z-10"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                    <BarChart3 className="w-12 h-12 text-green-200" />
                  </div>
                  <div className="text-[10px] text-gray-500 text-center font-black uppercase tracking-widest">Scan to add items</div>
                </div>

                <div className="space-y-2 mb-4 px-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-500">2× Cappuccino</span>
                    <span className="text-slate-900 font-black">₹280</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-500">1× Sandwich</span>
                    <span className="text-slate-900 font-black">₹140</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-3 text-center shadow-lg shadow-green-500/25 active:scale-95 transition-transform cursor-pointer">
                  <div className="text-[9px] text-white/80 font-black uppercase tracking-widest mb-0.5">Total Amount</div>
                  <div className="text-xs font-black text-white">Pay ₹420 with UPI</div>
                </div>
              </div>
            </motion.div>

            {/* Floating: AI Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -top-10 -right-4 lg:-right-12 w-64 bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-5"
            >
              <div className="flex items-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#561485] to-[#A13266] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#561485]/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 mb-1 uppercase tracking-widest font-black">AI Recommendation</div>
                  <div className="text-xs font-black text-gray-900 leading-tight">
                    Raise price of Cappuccino by 5%
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Demand stable. Projected margin increase is ~8.2% daily.</p>
            </motion.div>

            {/* Floating: GST Compliance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-16 -right-6 lg:-right-10 w-52 bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="text-[11px] font-black text-gray-900">GSTR-1 Ready</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">128 Invoices Sync</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <style>{`
        .animate-pulse-slow {
            animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
