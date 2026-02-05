import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Youtube, ArrowRight, Github, Send } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "#" },
    { name: "API", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Trust & Safety", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Merchant Stories", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative bg-[#F8FAFC] border-t-2 border-slate-100 pt-24 pb-12 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/FUTUREOFBUSINESS.png" 
                  alt="Future of Business" 
                  className="h-10 w-auto object-contain"
                />
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                  Hindustan Bills
                </h3>
              </div>
              <p className="text-lg text-slate-600 mb-10 max-w-md font-medium leading-relaxed">
                Modernizing Indian retail with checkout-less infrastructure and AI revenue intelligence.
              </p>

              {/* Newsletter */}
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#561485] mb-4">Stay updated with retail tech</h4>
                <div className="flex p-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm focus-within:border-[#561485]/30 transition-all max-w-md">
                  <div className="flex-1 flex items-center px-4">
                    <Send size={16} className="text-slate-400 mr-3" />
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-[#561485] to-[#A13266] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-[#561485]/20 transition-all active:scale-95">
                    Join
                  </button>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Github, href: "#" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ y: -4 }}
                    className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#561485] hover:border-[#561485]/20 hover:shadow-xl transition-all"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              {Object.entries(footerLinks).map(([category, links], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                    {category}
                  </h4>
                  <ul className="space-y-4">
                    {links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="group flex items-center text-sm font-bold text-slate-600 hover:text-[#561485] transition-all"
                        >
                          <span className="mr-0 group-hover:mr-2 w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <ArrowRight size={14} />
                          </span>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <p className="text-xs font-bold text-slate-400">
              © 2026 Hindustan Bills. All rights reserved.
            </p>
            <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-slate-400 whitespace-nowrap">
              <Link to="/privacy" className="hover:text-slate-600 uppercase tracking-widest">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-600 uppercase tracking-widest">Terms</Link>
              <Link to="/cookies" className="hover:text-slate-600 uppercase tracking-widest">Cookies</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Systems Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Built in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
