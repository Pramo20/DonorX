import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DonationForm } from "@/components/donation-form"
import { Share2, Heart, Calendar, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import { fetchCampaign, fetchDonationsCount, fetchDonation } from "@/lib/contract"
import { ethers } from "ethers"

async function getData(id: number) {
  const campaign = await fetchCampaign(id)
  const donorCount = await fetchDonationsCount(id)
  const recentCount = Math.min(donorCount, 5)
  const donations = await Promise.all(
    Array.from({ length: recentCount }, (_, i) => fetchDonation(id, donorCount - 1 - i)), // latest first
  )
  return { campaign, donorCount, donations }
}

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const { campaign, donorCount, donations } = await getData(id)

  const raisedEth = ethers.formatEther(campaign.raisedWei)
  const goalEth = ethers.formatEther(campaign.goalWei)
  const progress = campaign.goalWei === BigInt(0) ? 0 : Math.min(100, Math.floor((Number(campaign.raisedWei) / Number(campaign.goalWei)) * 100))
  const daysLeft = Math.max(0, Math.ceil((campaign.deadline - Math.floor(Date.now() / 1000)) / 86400))

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
                <Badge variant="secondary">General</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  On-chain
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{campaign.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Unknown
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline {new Date(campaign.deadline * 1000).toLocaleDateString()}
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
                  <p className="text-muted-foreground mb-4">{campaign.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Recent Donations ({donorCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.map((d, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{(d.name || "A").charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{d.name || "Anonymous"}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {d.donor.slice(0, 6)}...{d.donor.slice(-4)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-accent">{ethers.formatEther(d.amountWei)} ETH</span>
                            <span className="text-xs text-muted-foreground">{new Date(d.timestamp * 1000).toLocaleString()}</span>
                          </div>
                        </div>
                        {d.message && <p className="text-sm text-muted-foreground italic">"{d.message}"</p>}
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
                  <CardTitle className="text-2xl font-bold text-accent">{raisedEth} ETH</CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">of {goalEth} ETH goal</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={progress} className="h-3" />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{donorCount}</div>
                    <div className="text-sm text-muted-foreground">Donors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{daysLeft}</div>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                  </div>
                </div>

                <Separator />

                {/* Donation Form */}
                <DonationForm campaignId={id} />

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
                    <AvatarFallback>{campaign.beneficiary.slice(2, 3).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">Beneficiary</h4>
                      <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="font-mono text-xs">{campaign.beneficiary}</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm" asChild>
                  <Link href={`https://sepolia.etherscan.io/address/${campaign.beneficiary}`}>View Address</Link>
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
                  <span className="font-mono text-xs">{campaign.beneficiary.slice(0, 10)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{new Date(campaign.deadline * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}% funded</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="text-green-600">
                    {campaign.withdrawn ? "Withdrawn" : "Active"}
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
