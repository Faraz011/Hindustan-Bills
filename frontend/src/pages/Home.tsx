import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import FramesSection from '../components/FramesSection';
import WhoWeServeSection from '../components/WhoWeServeSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ComparisonSection from '../components/ComparisonSection';
import AIDataSection from '../components/AIDataSection';
import SocialProofSection from '../components/SocialProofSection';
import PricingSection from '../components/PricingSection';
import FinalCTASection from '../components/FinalCTASection';
import { 
  WaveDivider, 
  CurveDivider, 
  FloatingNode, 
  ParallaxBlob,
  FlowArrow 
} from '../components/FlowDecorators';
import { Sparkles, TrendingUp, Zap, BarChart3, Users } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      if (role === 'customer') {
        navigate('/customer/dashboard');
      } else if (role === 'retailer') {
        navigate('/retailer/dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* STRATEGY 1: Unified Background - Continuous gradient canvas */}
      <div className="fixed inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 -z-50" />

      {/* STRATEGY 7 & 9: Parallax blobs as anchoring elements */}
      <ParallaxBlob 
        className="top-[10%] -right-48" 
        color="bg-purple-100" 
        size="w-[600px] h-[600px]"
      />
      <ParallaxBlob 
        className="top-[30%] -left-32" 
        color="bg-blue-100" 
        size="w-[500px] h-[500px]"
      />
      <ParallaxBlob 
        className="top-[60%] right-0" 
        color="bg-pink-100" 
        size="w-[700px] h-[700px]"
      />
      <ParallaxBlob 
        className="top-[85%] -left-48" 
        color="bg-indigo-100" 
        size="w-[550px] h-[550px]"
      />

      {/* STRATEGY 9: Floating decorative nodes */}
      <FloatingNode className="top-[12%] right-[8%] z-10 hidden lg:block" delay={0}>
        <Sparkles className="w-5 h-5 text-[#561485]" />
      </FloatingNode>
      <FloatingNode className="top-[35%] left-[5%] z-10 hidden lg:block" delay={0.3}>
        <Zap className="w-5 h-5 text-[#3C47BA]" />
      </FloatingNode>
      <FloatingNode className="top-[58%] right-[10%] z-10 hidden lg:block" delay={0.6}>
        <TrendingUp className="w-5 h-5 text-[#A13266]" />
      </FloatingNode>
      <FloatingNode className="top-[78%] left-[8%] z-10 hidden lg:block" delay={0.9}>
        <BarChart3 className="w-5 h-5 text-emerald-600" />
      </FloatingNode>

      {/* MAIN CONTENT FLOW */}
      <main className="relative">
        
        {/* HERO SECTION */}
        <section className="relative z-30">
          <Hero />
          
          {/* STRATEGY 14: Directional flow cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <FlowArrow />
          </div>
        </section>

        {/* STRATEGY 3: Overlap - Frames extends into Hero space */}
        <section className="relative z-20 -mt-24 pb-24">
          {/* STRATEGY 2: Gradient transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4">
            <FramesSection />
          </div>

          {/* STRATEGY 4: Wave divider for organic transition */}
          <WaveDivider color="fill-slate-50" className="bottom-0" />
        </section>

        {/* WHO WE SERVE - Integrated with gradient background */}
        <section className="relative z-10 bg-gradient-to-b from-slate-50 to-white py-24">
          <div className="relative max-w-7xl mx-auto px-4">
            <WhoWeServeSection />
          </div>

          {/* STRATEGY 14: Connector between sections */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-12">
            <FloatingNode delay={0}>
              <Users className="w-5 h-5 text-[#561485]" />
            </FloatingNode>
          </div>
        </section>

        {/* HOW IT WORKS - Continuous from Who We Serve */}
        <section className="relative z-10 bg-gradient-to-b from-white to-slate-50 py-24">
          <div className="relative max-w-7xl mx-auto px-4">
            <HowItWorksSection />
          </div>
        </section>

        {/* STRATEGY 3: Comparison overlaps previous section */}
        <section className="relative z-20 -mt-16">
          {/* STRATEGY 4: Curve divider for smooth entry */}
          <CurveDivider color="fill-white" className="top-0" />
          
          <div className="relative bg-white pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4">
              <ComparisonSection />
            </div>
          </div>

          {/* STRATEGY 4: Wave divider to AI section */}
          <WaveDivider color="fill-purple-50" className="bottom-0" />
        </section>

        {/* AI DATA - Purple gradient zone */}
        <section className="relative z-10 bg-gradient-to-br from-purple-50 via-slate-50 to-blue-50 py-32">
          <div className="relative max-w-7xl mx-auto px-4">
            <AIDataSection />
          </div>

          {/* STRATEGY 4: Dramatic wave to dark section */}
          <WaveDivider flip color="fill-slate-900" className="bottom-0" />
        </section>

        {/* STRATEGY 12: Social Proof + Pricing nested in dark zone */}
        <section className="relative z-10 bg-slate-900 pt-32">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
          
          <div className="relative">
            <SocialProofSection />
            
            {/* STRATEGY 3: Pricing overlaps on glass layer */}
            <div className="relative -mt-12 z-20">
              <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white/90 backdrop-blur-2xl rounded-[4rem] p-8 shadow-2xl border border-white/20">
                  <PricingSection />
                </div>
              </div>
            </div>
          </div>

          {/* STRATEGY 4: Return to light with wave */}
          <WaveDivider color="fill-white" className="bottom-0" />
        </section>

        {/* FINAL CTA - Overlapping finale */}
        <section className="relative z-30 bg-gradient-to-b from-white to-slate-50 -mt-32 pt-48 pb-24">
          <div className="max-w-7xl mx-auto px-4">
            <FinalCTASection />
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
