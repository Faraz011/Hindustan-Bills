import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import PaymentOptions from '../components/PaymentOptions';


const Home = () => {
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
