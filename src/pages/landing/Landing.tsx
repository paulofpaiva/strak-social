import { Header, Hero, Features, CTA, Footer } from './components'

function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}

export default Landing