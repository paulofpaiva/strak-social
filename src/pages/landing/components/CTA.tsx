import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="container mx-auto text-center">
        <h3 className="text-3xl font-bold mb-6">
          Ready to start your journey?
        </h3>
        <p className="text-lg text-gray-400 mb-8">
          Join thousands of users who have already discovered a new way to connect.
        </p>
        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
          Create Free Account
        </Button>
      </div>
    </section>
  )
}
