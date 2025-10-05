import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why choose Strak Social?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-foreground text-xl">🔗</span>
              </div>
              <CardTitle>Real Connections</CardTitle>
              <CardDescription>
                Connect with people who share your interests and values.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-foreground text-xl">🎯</span>
              </div>
              <CardTitle>Authentic Content</CardTitle>
              <CardDescription>
                Share real moments without filters or artificiality.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-foreground text-xl">⚡</span>
              </div>
              <CardTitle>Intuitive Interface</CardTitle>
              <CardDescription>
                Clean and functional design for a smooth experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
