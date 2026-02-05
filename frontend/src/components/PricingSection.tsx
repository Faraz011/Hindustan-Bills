import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for single outlets",
    price: "₹999",
    period: "/month",
    features: [
      "Up to 500 transactions/month",
      "Scan & Go checkout",
      "GST-compliant invoicing",
      "Basic reports",
      "Email support",
      "Offline mode",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    description: "For growing chains",
    price: "₹2,999",
    period: "/month",
    features: [
      "Unlimited transactions",
      "All Starter features",
      "AI insights & recommendations",
      "Multi-location support (up to 5)",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Inventory management",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    description: "For large operations",
    price: "Custom",
    period: "",
    features: [
      "All Growth features",
      "Unlimited locations",
      "White-label options",
      "Dedicated account manager",
      "Custom AI models",
      "API access",
      "24/7 phone support",
      "Custom onboarding",
    ],
    cta: "Talk to Sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
            Simple pricing that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#561485]">grows with you</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#A13266]/10" />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            No setup fees. No hidden charges. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-50 border-2 border-green-200 shadow-sm">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-semibold">30-day free trial on all plans</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: plan.highlighted ? 1.02 : 1.01 }}
              className={`relative rounded-3xl border-2 p-8 transition-all ${
                plan.highlighted
                  ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-[#561485]/30 shadow-2xl"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#561485] to-[#A13266] shadow-xl">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-gray-600">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-bold mb-6 flex items-center justify-center gap-2 transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#561485] to-[#A13266] text-white shadow-lg shadow-[#561485]/25"
                    : "bg-gray-100 text-gray-900 border-2 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? "text-[#561485]" : "text-green-600"
                    }`} />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-600">
            All plans include unlimited team members and free updates.{" "}
            <a href="#" className="text-[#561485] hover:text-[#A13266] transition-colors font-semibold underline">
              View detailed pricing
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
