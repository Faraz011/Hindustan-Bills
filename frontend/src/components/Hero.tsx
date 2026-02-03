import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, QrCode, Zap, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-[#0f0720]">
      {/* Abstract Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-200">The Future of India's Billing</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
            Build Fast.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent to-primary-200">Scale Bharat.</span>
          </h1>
          
          <p className="text-xl text-primary-100/60 mb-10 leading-relaxed max-w-xl font-medium">
            Next-Gen billing infrastructure for the new economy. Deploy unified scan & go checkouts, data analytics, and automated reconciliation in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              to="/login"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-2xl font-black hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/20 active:scale-95"
            >
              Start Building Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Contact Sales
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-white/5 pt-10">
            <div className="space-y-1">
              <div className="text-2xl font-black text-white italic tracking-tighter">100ms</div>
              <p className="text-xs uppercase tracking-widest text-primary-300/40 font-bold">Latency</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-white italic tracking-tighter">99.9%</div>
              <p className="text-xs uppercase tracking-widest text-primary-300/40 font-bold">Uptime Sla</p>
            </div>
            <div className="hidden sm:block space-y-1">
              <div className="text-2xl font-black text-white italic tracking-tighter">UPI</div>
              <p className="text-xs uppercase tracking-widest text-primary-300/40 font-bold">Native Flow</p>
            </div>
          </div>
        </motion.div>

        {/* Right Visualization (Premium Infrastructure Stack) */}
        <div className="relative h-[500px] lg:h-[600px] w-full">
          {/* Base Layer: Terminal Window */}
          <motion.div
            initial={{ opacity: 0, rotateY: -15, rotateX: 5, y: 50 }}
            animate={{ opacity: 1, rotateY: -10, rotateX: 2, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/4 left-0 right-0 z-0 rounded-2xl bg-[#0a0515] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-6 font-mono text-[13px]"
          >
             <div className="flex gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
             </div>
             <div className="space-y-3">
                <div className="flex gap-2">
                  <span className="text-primary-400">$</span>
                  <span className="text-white">hb deploy --region in-west</span>
                </div>
                <div className="text-primary-100/40 leading-relaxed italic">
                  {"[SYSTEM] Initializing Bharat-Standard-Stack..."}<br />
                  {"[UPI] Socket connection established"}<br />
                  {"[CORE] 2.4s Latency optimized for mobile"}
                </div>
                <div className="h-[1px] bg-white/5 w-full my-2"></div>
                <div className="text-accent-light/80">
                  {"{ \"status\": \"LIVE\", \"endpoint\": \"api.hb.in/v1/\" }"}
                </div>
             </div>
          </motion.div>

          {/* Middle Layer: Live Transaction Card */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-10 -right-4 lg:-right-8 z-20 w-64 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-300">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded-md">Realtime</span>
            </div>
            <div className="space-y-4">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="h-full bg-primary-500"
                ></motion.div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Volume (24h)</div>
                  <div className="text-xl font-black text-white">₹2,48,500</div>
                </div>
                <div className="text-green-400 text-xs font-bold">+12.5%</div>
              </div>
            </div>
          </motion.div>

          {/* Top Layer: Premium Checkout Modal */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 left-4 lg:left-0 z-30 w-72 bg-white rounded-[32px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 relative">
                 <QrCode size={32} className="text-primary-600" />
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-primary-500/10 rounded-2xl"
                 ></motion.div>
              </div>
              <h4 className="text-gray-900 font-black text-lg mb-1 tracking-tight">Unified Checkout</h4>
              <p className="text-gray-500 text-sm font-medium mb-6">Scan with any UPI App</p>
              
              <div className="w-full space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden p-1.5 text-[8px] font-black text-primary-600">
                       UPI
                    </div>
                    <div className="text-left flex-1">
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dynamic VPA</div>
                       <div className="text-xs text-gray-900 font-bold">hb.merchant@okhdfc</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                 </div>
                 
                 <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 active:scale-95 transition-all">
                    Verify & Pay <Zap size={16} />
                 </button>
              </div>
            </div>

            {/* Verification Tag */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl border border-white/10">
               <ShieldCheck size={14} className="text-green-400" />
               <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Bank Grade Security</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero;
