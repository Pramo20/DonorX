import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Target } from "lucide-react"
import Link from "next/link"

interface CampaignCardProps {
  id: number
  title: string
  description: string
  goal: string
  raised: string
  progress: number
  daysLeft: number
  donorCount: number
  category: string
  image?: string
}

export function CampaignCard({
  id,
  title,
  description,
  goal,
  raised,
  progress,
  daysLeft,
  donorCount,
  category,
  image,
}: CampaignCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center">
          {image ? (
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover rounded-t-lg" />
          ) : (
            <div className="text-6xl opacity-20">🎯</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {daysLeft}d left
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-balance group-hover:text-accent transition-colors">{title}</h3>

        <p className="text-sm text-muted-foreground mb-4 text-pretty line-clamp-2">{description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{raised} ETH raised</span>
            <span className="text-muted-foreground">of {goal} ETH</span>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {donorCount} donors
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              {progress}% funded
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/campaign/${id}`} className="w-full">
          <Button className="w-full">View Campaign</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
