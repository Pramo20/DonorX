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

      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Transparent • Decentralized • Secure
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance text-black">
              Fund the Future with
              <span className="text-gray-600"> Crypto Donations</span>
            </h1>

            <p className="text-xl md:text-2xl bg-gradient-to-br from-gray-300 to-gray-500 bg-clip-text text-transparent mb-8 text-pretty max-w-3xl mx-auto">
              Support causes you care about with transparent, blockchain-based donations. Every contribution is tracked,
              verified, and makes a real impact.
            </p>
          </div>
        </div>
      </section>

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
