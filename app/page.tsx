import { Header } from "@/components/header"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp } from "lucide-react"
import { Suspense } from "react"
import ClientCampaignGrid from "./_sections/client-campaign-grid"

const categories = ["All", "Environment", "Education", "Healthcare", "Technology", "Community"]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      

      {/* Campaigns Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Active Campaigns</h2>
              <p className="text-muted-foreground">Discover and support meaningful causes making a difference</p>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search campaigns..." className="pl-10 w-64" />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Campaign Grid */}
          <Suspense fallback={<div>Loading campaigns...</div>}>
            <ClientCampaignGrid />
          </Suspense>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Campaigns
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
