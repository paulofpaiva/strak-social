import { Header, Hero, Features, CTA, Footer } from './components'

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}

export default Landing