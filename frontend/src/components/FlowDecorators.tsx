import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode } from "react";

// Strategy 4: Shape-Based Dividers - Organic wave transitions
export const WaveDivider = ({ 
  flip = false, 
  color = "fill-white",
  className = "" 
}: { 
  flip?: boolean; 
  color?: string;
  className?: string;
}) => (
  <div className={`absolute left-0 right-0 w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-16 md:h-24 ${color}`}>
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  </div>
);

// Strategy 4: Diagonal curve divider
export const CurveDivider = ({ 
  color = "fill-slate-50",
  className = "" 
}: { 
  color?: string;
  className?: string;
}) => (
  <div className={`absolute left-0 right-0 w-full overflow-hidden leading-[0] ${className}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-20 md:h-32 ${color}`}>
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
    </svg>
  </div>
);

// Strategy 7: Scroll-Based Motion - Conduit line with progress
export const ScrollConduit = () => {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed left-1/2 top-0 -translate-x-1/2 w-px h-screen pointer-events-none z-50">
      <div className="w-full h-full bg-slate-200/30" />
      <motion.div 
        style={{ height }}
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#561485] via-[#3C47BA] to-[#A13266] origin-top"
      />
    </div>
  );
};

// Strategy 9: Anchoring Elements - Floating decorative nodes
export const FloatingNode = ({ 
  className = "",
  delay = 0,
  children
}: { 
  className?: string;
  delay?: number;
  children?: ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay, duration: 0.6 }}
    animate={{ 
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition-animate={{ 
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay * 2
    }}
    className={`absolute ${className}`}
  >
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#561485]/20 to-[#A13266]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-3 shadow-xl">
        {children || (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#561485] to-[#A13266] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Strategy 7: Parallax background blob
export const ParallaxBlob = ({ 
  className = "",
  color = "bg-purple-100",
  size = "w-96 h-96"
}: {
  className?: string;
  color?: string;
  size?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <motion.div 
      style={{ y }}
      className={`absolute ${size} ${color} rounded-full blur-[120px] opacity-40 pointer-events-none ${className}`}
    />
  );
};

// Strategy 14: Directional Flow Cues - Animated arrow
export const FlowArrow = ({ className = "" }: { className?: string }) => (
  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className={`${className}`}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#561485]">
      <path d="M12 5v14m0 0l7-7m-7 7l-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </motion.div>
);

// Strategy 3: Section overlap indicator
export const OverlapFade = ({ 
  direction = "top",
  className = "" 
}: { 
  direction?: "top" | "bottom";
  className?: string;
}) => (
  <div className={`absolute left-0 right-0 h-32 pointer-events-none ${
    direction === "top" ? "top-0 bg-gradient-to-b" : "bottom-0 bg-gradient-to-t"
  } from-transparent via-white/50 to-white ${className}`} />
);
