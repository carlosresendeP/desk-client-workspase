import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { Features } from "./features"
import { StatsSection } from "./stats-section"
import { HowItWorks } from "./how-it-works"
import { Testimonials } from "./testimonials"
import { CTASection } from "./cta-section"
import { Pricing } from "./pricing"
import { FAQ } from "./faq"
import { Footer } from "./footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      {/* <LogoStrip /> */}
      <Features />
      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  )
}
