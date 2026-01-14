import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import PaymentOptions from '../components/PaymentOptions';

interface JWTPayload {
  role?: string;
  profileCompleted?: boolean;
}


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hb_token");
    if (token && token.length > 10) {
      try {
        const decoded: JWTPayload = jwtDecode(token);
        
        if (decoded.profileCompleted === false) {
          navigate("/complete-setup", { replace: true });
        } else if (decoded.role === "retailer") {
          navigate("/retailer/dashboard", { replace: true });
        } else if (decoded.role === "customer") {
          navigate("/customer/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error decoding token on Home:", error);
      }
    }
  }, [navigate]);

  return (
    <div id = "home" className="pt-20">
      <Hero />
      <Features />
      <HowItWorks />
      <PaymentOptions />
      <Testimonials />
      <FAQ />
    </div>
  )
}

export default Home
