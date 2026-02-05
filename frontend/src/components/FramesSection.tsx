import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Smartphone, Sparkles, TrendingUp, ShoppingCart, BarChart3, AlertCircle, Package } from "lucide-react";

const tabs = [
  {
    id: "dashboard",
    label: "Retailer Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "scanandgo",
    label: "Customer App",
    icon: Smartphone,
  },
  {
    id: "ai",
    label: "AI Insights",
    icon: Sparkles,
  },
];

const FramesSection = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
            One platform.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#3C47BA]">Three powerful views.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#3C47BA]/10" />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything that happens at the counter, in the aisle, and in your reports – finally connected.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-[#561485] to-[#A13266] text-white shadow-lg shadow-[#561485]/25"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#561485]/30 hover:shadow-md"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Frame viewport - Fixed height to prevent layout shift during auto-transition */}
        <div className="relative bg-white rounded-[40px] border-2 border-gray-200 shadow-2xl overflow-hidden min-h-[700px] lg:h-[800px]">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="p-8"
              >
                <div className="flex gap-6">
                  {/* Sidebar */}
                  <div className="hidden md:flex flex-col gap-2 w-16">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#561485] to-[#A13266] flex items-center justify-center shadow-lg shadow-[#561485]/25">
                      <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <ShoppingCart className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <BarChart3 className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h3>
                      <p className="text-sm text-gray-500">Wednesday, Feb 5, 2026</p>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-[#561485]/20 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Revenue Today</span>
                          <TrendingUp className="w-4 h-4 text-[#561485]" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">₹45,280</div>
                        <div className="text-sm text-green-600 font-medium">+18.2% vs yesterday</div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#3C47BA]/20 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Active Checkouts</span>
                          <ShoppingCart className="w-4 h-4 text-[#3C47BA]" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                        <div className="text-sm text-gray-600">Avg 42 sec/checkout</div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-[#A13266]/20 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Avg Basket Size</span>
                          <BarChart3 className="w-4 h-4 text-[#A13266]" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">₹378</div>
                        <div className="text-sm text-green-600 font-medium">+12.3% this week</div>
                      </div>
                    </div>

                    {/* Recent bills table */}
                    <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
                      <div className="px-5 py-4 border-b-2 border-gray-200 bg-white">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Bills</h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {[
                          { id: "#4562", customer: "Table 12", items: 4, amount: 780, time: "2 min ago", status: "Paid" },
                          { id: "#4561", customer: "Scan & Go", items: 2, amount: 420, time: "5 min ago", status: "Paid" },
                          { id: "#4560", customer: "Counter", items: 6, amount: 1240, time: "8 min ago", status: "Paid" },
                          { id: "#4559", customer: "Table 8", items: 3, amount: 650, time: "12 min ago", status: "Paid" },
                        ].map((bill, i) => (
                          <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                              <span className="text-sm font-mono font-semibold text-[#561485]">{bill.id}</span>
                              <span className="text-sm text-gray-900 font-medium">{bill.customer}</span>
                              <span className="text-xs text-gray-500">{bill.items} items</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-bold text-gray-900">₹{bill.amount}</span>
                              <span className="text-xs text-gray-500 w-20 text-right">{bill.time}</span>
                              <span className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 font-medium">{bill.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "scanandgo" && (
              <motion.div
                key="scanandgo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="p-8 flex items-center justify-center min-h-[600px] bg-gradient-to-br from-green-50/50 to-emerald-50/50"
              >
                <div className="max-w-4xl w-full">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Experience</h3>
                    <p className="text-sm text-gray-600">Scan products, checkout in seconds</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Phone mockup */}
                    <div className="flex justify-center">
                      <div className="w-72 bg-gray-900 rounded-[2.5rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                        {/* Status bar */}
                        <div className="bg-gray-900 px-6 py-2 flex items-center justify-between text-xs text-gray-400">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-3 border border-current rounded-sm" />
                            <span>100%</span>
                          </div>
                        </div>

                        {/* App content */}
                        <div className="bg-white p-6 min-h-[600px]">
                          {/* Header */}
                          <div className="text-center mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">Hindustan Bills</h4>
                            <p className="text-xs text-gray-500">Scan & Go</p>
                          </div>

                          {/* Scan viewport */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl aspect-square mb-6 relative overflow-hidden flex items-center justify-center border-2 border-green-200">
                            {/* Corner brackets */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-green-500" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-green-500" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-green-500" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-green-500" />
                            
                            {/* Scanning line */}
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ y: -100 }}
                              animate={{ y: 100 }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            >
                              <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                            </motion.div>

                            <BarChart3 className="w-16 h-16 text-green-200" />
                            <div className="absolute inset-x-0 bottom-4 text-center">
                              <div className="text-xs text-green-700 bg-green-100 inline-block px-3 py-1 rounded-full font-medium">
                                Point camera at barcode
                              </div>
                            </div>
                          </div>

                          {/* Cart */}
                          <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-4 mb-4">
                            <div className="text-xs text-gray-600 mb-3 uppercase tracking-wide font-medium">Your Cart</div>
                            <div className="space-y-3 mb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#561485]/10 flex items-center justify-center text-xs text-[#561485] font-bold">
                                    2×
                                  </div>
                                  <span className="text-sm text-gray-900 font-medium">Cappuccino</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">₹280</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#561485]/10 flex items-center justify-center text-xs text-[#561485] font-bold">
                                    1×
                                  </div>
                                  <span className="text-sm text-gray-900 font-medium">Club Sandwich</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">₹140</span>
                              </div>
                            </div>
                            <div className="pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">Total</span>
                              <span className="text-lg font-bold text-gray-900">₹420</span>
                            </div>
                          </div>

                          {/* Checkout button */}
                          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-4 font-bold shadow-lg shadow-green-500/25">
                            Pay with UPI
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">Instant Scanning</h4>
                          <p className="text-sm text-gray-600">
                            Customers scan barcodes with their phone camera. No app download required.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">Real-time Cart</h4>
                          <p className="text-sm text-gray-600">
                            Cart updates instantly. Customers can add, remove, or adjust quantities on the go.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">Quick Checkout</h4>
                          <p className="text-sm text-gray-600">
                            Pay with UPI, card, or wallet. GST invoice sent instantly via SMS and email.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="p-8 bg-gradient-to-br from-purple-50/50 to-blue-50/50"
              >
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Insights</h3>
                  <p className="text-sm text-gray-600">Turn data into decisions that grow margins</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {/* Margin insight */}
                  <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/25">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">This Month</div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">Margin +7%</div>
                        <div className="text-sm text-green-600 font-medium">₹21,400 extra profit</div>
                      </div>
                    </div>
                    <div className="h-24 flex items-end gap-1">
                      {[40, 45, 50, 55, 60, 58, 62, 68, 72, 70, 75, 80].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price recommendation */}
                  <div className="bg-white border-2 border-[#561485]/20 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#561485] to-[#A13266] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#561485]/25">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Recommendation</div>
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          Raise Cappuccino price by 5%
                        </div>
                        <div className="text-sm text-gray-600">₹140 → ₹147</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Demand elasticity</span>
                        <span className="text-green-600 font-medium">Stable (-2%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Margin impact</span>
                        <span className="text-green-600 font-medium">+8.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Extra monthly profit</span>
                        <span className="text-gray-900 font-bold">₹4,680</span>
                      </div>
                    </div>
                  </div>

                  {/* Slow-moving SKUs */}
                  <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/25">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Inventory Alert</div>
                        <div className="text-lg font-bold text-gray-900">Slow-Moving Products</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "Muffin - Blueberry", stock: 18, days: 14 },
                        { name: "Juice - Orange", stock: 24, days: 12 },
                        { name: "Cookie - Oatmeal", stock: 32, days: 10 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-orange-50 rounded-xl p-3 border border-orange-100">
                          <span className="text-gray-900 font-medium">{item.name}</span>
                          <div className="text-right">
                            <div className="text-orange-600 text-xs font-medium">{item.stock} in stock</div>
                            <div className="text-gray-500 text-xs">{item.days} days old</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bundle suggestion */}
                  <div className="bg-white border-2 border-[#3C47BA]/20 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3C47BA] to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3C47BA]/25">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Bundle Opportunity</div>
                        <div className="text-lg font-bold text-gray-900">Suggested Promotion</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 mb-3 border border-blue-100">
                      <div className="text-sm text-gray-900 mb-2 font-semibold">
                        "Buy Coffee, get Cookie 10% off"
                      </div>
                      <div className="text-xs text-gray-600">
                        42% of coffee buyers also purchase cookies
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expected uplift</span>
                      <span className="text-green-600 font-bold">+₹8,200/month</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FramesSection;
