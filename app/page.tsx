import { Header } from "@/components/header"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Zap } from "lucide-react"

// Mock data for campaigns
const campaigns = [
  {
    id: 1,
    title: "Clean Water for Rural Communities",
    description:
      "Help us build sustainable water infrastructure in underserved rural areas. Every donation directly funds well construction and water purification systems.",
    goal: "50",
    raised: "32.5",
    progress: 65,
    daysLeft: 23,
    donorCount: 127,
    category: "Environment",
  },
  {
    id: 2,
    title: "Education Technology for Schools",
    description:
      "Providing tablets and internet access to students in remote areas. Bridge the digital divide and ensure equal access to quality education.",
    goal: "25",
    raised: "18.2",
    progress: 73,
    daysLeft: 15,
    donorCount: 89,
    category: "Education",
  },
  {
    id: 3,
    title: "Emergency Medical Supplies",
    description:
      "Critical medical supplies for disaster relief efforts. Your contribution helps save lives in emergency situations worldwide.",
    goal: "75",
    raised: "41.8",
    progress: 56,
    daysLeft: 31,
    donorCount: 203,
    category: "Healthcare",
  },
  {
    id: 4,
    title: "Renewable Energy Initiative",
    description:
      "Solar panel installation for community centers. Sustainable energy solutions that reduce costs and environmental impact.",
    goal: "100",
    raised: "87.3",
    progress: 87,
    daysLeft: 8,
    donorCount: 156,
    category: "Environment",
  },
]

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>

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
