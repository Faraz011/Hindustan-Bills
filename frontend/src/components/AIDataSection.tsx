import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Target, Package } from "lucide-react";

const AIDataSection = () => {
  return (
    <section className="relative">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#561485]/20 shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#561485]" />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Intelligence</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
            Turn every bill into a{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#3C47BA]">better decision</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#3C47BA]/10" />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI models analyze sales, timing, and product mix to suggest pricing, promotions, 
            and inventory moves that increase margins 5–10%.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Central visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            {/* Main chart card */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Revenue Intelligence</h3>
                  <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">₹4.2L</div>
                  <div className="text-sm text-green-600 flex items-center gap-1 justify-end font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    +18% vs last month
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 flex items-end gap-2 mb-6">
                {[45, 52, 48, 60, 58, 65, 62, 70, 68, 75, 72, 80, 85, 82, 90].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                    className="flex-1 bg-gradient-to-t from-[#561485] via-[#A13266] to-[#3C47BA] rounded-t-xl relative group"
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap">
                        ₹{Math.floor(28000 + (height * 100))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#561485]" />
                  <span className="font-medium">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3C47BA]" />
                  <span className="font-medium">Profit margin</span>
                </div>
              </div>
            </div>

            {/* Floating recommendation card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-4 lg:-right-8 w-64 bg-white rounded-2xl border-2 border-[#561485]/20 p-4 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#561485] to-[#A13266] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#561485]/25">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">AI Insight</div>
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    Raise price +5%
                  </div>
                  <div className="text-xs text-gray-600">
                    On Cappuccino
                  </div>
                  <div className="mt-2 text-xs text-green-600 font-semibold">
                    +₹4,680/month extra profit
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating recommendation card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -bottom-6 -left-4 lg:-left-8 w-64 bg-white rounded-2xl border-2 border-[#3C47BA]/20 p-4 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3C47BA] to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3C47BA]/25">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Bundle Promo</div>
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    Coffee + Cookie deal
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    42% buy both items
                  </div>
                  <div className="text-xs text-green-600 font-semibold">
                    +₹8,200/month uplift
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Feature list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-[#561485]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <TrendingUp className="w-7 h-7 text-[#561485]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Dynamic Pricing</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  AI analyzes demand elasticity and suggests optimal prices for each product. 
                  Know exactly when to raise prices without losing customers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-[#3C47BA]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Package className="w-7 h-7 text-[#3C47BA]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Smart Promotions</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Discover which products are frequently bought together and get bundle suggestions 
                  that actually increase basket size.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Inventory Optimization</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get alerts on slow-moving stock and demand forecasts. Order 20% less of what doesn't 
                  sell, 30% more of what does.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-[#A13266]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Sparkles className="w-7 h-7 text-[#A13266]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Margin Intelligence</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Track margins by product, category, and time of day. See where you're leaving money 
                  on the table and fix it.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIDataSection;
