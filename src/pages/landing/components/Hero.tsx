import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6">
          Connect with the world
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          The new social network that brings people together through authentic experiences and real connections.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}
