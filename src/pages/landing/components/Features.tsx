import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why choose Strak Social?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-gray-900 bg-gray-900">
            <CardHeader>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-black text-xl">🔗</span>
              </div>
              <CardTitle className="text-white">Real Connections</CardTitle>
              <CardDescription className="text-gray-300">
                Connect with people who share your interests and values.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-900 bg-gray-900">
            <CardHeader>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <CardTitle className="text-white">Authentic Content</CardTitle>
              <CardDescription className="text-gray-300">
                Share real moments without filters or artificiality.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-900 bg-gray-900">
            <CardHeader>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <CardTitle className="text-white">Intuitive Interface</CardTitle>
              <CardDescription className="text-gray-300">
                Clean and functional design for a smooth experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
