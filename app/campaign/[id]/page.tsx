import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DonationForm } from "@/components/donation-form"
import { Share2, Heart, Calendar, MapPin, ExternalLink, Shield } from "lucide-react"
import Link from "next/link"

// Mock data for campaign details
const campaignData = {
  id: 1,
  title: "Clean Water for Rural Communities",
  description:
    "Help us build sustainable water infrastructure in underserved rural areas. Every donation directly funds well construction and water purification systems that will serve thousands of families for decades to come.",
  fullDescription: `Our mission is to provide clean, safe drinking water to rural communities that have been without access for generations. This comprehensive project includes:

• Construction of 5 new water wells with solar-powered pumps
• Installation of water purification systems in 3 existing wells  
• Training local technicians for ongoing maintenance
• Distribution of water storage containers to 200 families
• Educational programs on water conservation and hygiene

The impact of this project extends far beyond just providing water. Clean water access reduces disease, allows children (especially girls) to attend school instead of walking hours to fetch water, and enables economic development in these communities.

We've partnered with local organizations who have deep community ties and technical expertise. 100% of donations go directly to project implementation - no administrative fees are deducted.

Progress updates and photos will be shared regularly so you can see exactly how your contribution is making a difference.`,
  goal: "50",
  raised: "32.5",
  progress: 65,
  daysLeft: 23,
  donorCount: 127,
  category: "Environment",
  beneficiary: "0x1234567890123456789012345678901234567890",
  deadline: "2024-02-15",
  created: "2024-01-01",
  location: "Rural Kenya",
  organizer: {
    name: "WaterBridge Foundation",
    verified: true,
    campaigns: 12,
    totalRaised: "245.8",
  },
}

const recentDonations = [
  {
    donor: "0x1234...5678",
    amount: "2.5",
    message: "Clean water is a human right. Happy to support this important cause!",
    timestamp: "2 hours ago",
    name: "Anonymous",
  },
  {
    donor: "0x9876...4321",
    amount: "1.0",
    message: "Great work! Looking forward to seeing the impact.",
    timestamp: "5 hours ago",
    name: "Sarah M.",
  },
  {
    donor: "0x5555...9999",
    amount: "5.0",
    message: "This project will change lives. Proud to contribute.",
    timestamp: "1 day ago",
    name: "Community Builder",
  },
  {
    donor: "0x7777...3333",
    amount: "0.5",
    message: "",
    timestamp: "2 days ago",
    name: "Anonymous",
  },
]

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{campaignData.category}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{campaignData.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {campaignData.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {campaignData.created}
                </div>
                
              </div>

              {/* Campaign Image */}
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-6">
                <div className="text-8xl opacity-20">💧</div>
              </div>
            </div>

            {/* Campaign Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground mb-4">{campaignData.description}</p>
                  <div className="whitespace-pre-line text-sm">{campaignData.fullDescription}</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Recent Donations ({campaignData.donorCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{donation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{donation.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{donation.donor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-accent">{donation.amount} ETH</span>
                            <span className="text-xs text-muted-foreground">{donation.timestamp}</span>
                          </div>
                        </div>
                        {donation.message && (
                          <p className="text-sm text-muted-foreground italic">"{donation.message}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Donations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-accent">{campaignData.raised} ETH</CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">of {campaignData.goal} ETH goal</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={campaignData.progress} className="h-3" />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{campaignData.donorCount}</div>
                    <div className="text-sm text-muted-foreground">Donors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{campaignData.daysLeft}</div>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                  </div>
                </div>

                <Separator />

                {/* Donation Form */}
                <DonationForm
                  campaignId={campaignData.id}
                  contractAddress="0x1234567890123456789012345678901234567890"
                />

                <Separator />

                {/* Share */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Share Campaign</span>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{campaignData.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{campaignData.organizer.name}</h4>
                      {campaignData.organizer.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>{campaignData.organizer.campaigns} campaigns created</div>
                      <div>{campaignData.organizer.totalRaised} ETH raised total</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Beneficiary</span>
                  <span className="font-mono text-xs">{campaignData.beneficiary.slice(0, 10)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{campaignData.deadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{campaignData.progress}% funded</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="text-green-600">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
