"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { MapPin, Target, Clock, Info, Wallet, ArrowRight, CheckCircle } from "lucide-react"
import { useState } from "react"

const categories = [
  "Environment",
  "Education",
  "Healthcare",
  "Technology",
  "Community",
  "Emergency Relief",
  "Arts & Culture",
  "Animal Welfare",
]

const durations = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
]

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    goal: "",
    duration: "",
    location: "",
    beneficiary: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Your Campaign</h1>
            <p className="text-muted-foreground text-lg">Launch a transparent, blockchain-based fundraising campaign</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            <div className="flex justify-between mt-4">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-accent" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1 ? "bg-accent text-accent-foreground" : "bg-muted"
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
                </div>
                <span className="text-sm font-medium">Campaign Details</span>
              </div>

              <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-accent" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2 ? "bg-accent text-accent-foreground" : "bg-muted"
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle className="h-4 w-4" /> : "2"}
                </div>
                <span className="text-sm font-medium">Funding & Timeline</span>
              </div>

              <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-accent" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 3 ? "bg-accent text-accent-foreground" : "bg-muted"
                  }`}
                >
                  {currentStep > 3 ? <CheckCircle className="h-4 w-4" /> : "3"}
                </div>
                <span className="text-sm font-medium">Review & Launch</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1 && "Campaign Details"}
                    {currentStep === 2 && "Funding & Timeline"}
                    {currentStep === 3 && "Review & Launch"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Campaign Details */}
                  {currentStep === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="title">Campaign Title *</Label>
                        <Input
                          id="title"
                          placeholder="Give your campaign a clear, compelling title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Short Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Briefly describe what you're raising funds for (1-2 sentences)"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullDescription">Full Description *</Label>
                        <Textarea
                          id="fullDescription"
                          placeholder="Provide detailed information about your campaign, including goals, impact, and how funds will be used"
                          rows={8}
                          value={formData.fullDescription}
                          onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="Where is this campaign based?"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Funding & Timeline */}
                  {currentStep === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="goal">Funding Goal (ETH) *</Label>
                        <Input
                          id="goal"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="10.0"
                          value={formData.goal}
                          onChange={(e) => handleInputChange("goal", e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Set a realistic goal that covers your project needs
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Campaign Duration *</Label>
                        <Select
                          value={formData.duration}
                          onValueChange={(value) => handleInputChange("duration", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How long will your campaign run?" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value.toString()}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="beneficiary">Beneficiary Address *</Label>
                        <Input
                          id="beneficiary"
                          placeholder="0x..."
                          value={formData.beneficiary}
                          onChange={(e) => handleInputChange("beneficiary", e.target.value)}
                          className="font-mono text-sm"
                        />
                        <p className="text-sm text-muted-foreground">
                          The Ethereum address that will receive the funds
                        </p>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Once your campaign is created, these settings cannot be changed. Make sure all information is
                          correct.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}

                  {/* Step 3: Review & Launch */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Campaign Preview</h3>

                        <div className="border rounded-lg p-6 space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{formData.category}</Badge>
                            {formData.location && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                {formData.location}
                              </div>
                            )}
                          </div>

                          <h4 className="text-xl font-bold">{formData.title || "Campaign Title"}</h4>
                          <p className="text-muted-foreground">
                            {formData.description || "Campaign description will appear here"}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              Goal: {formData.goal || "0"} ETH
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formData.duration || "0"} days
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-lg mb-4">Campaign Details</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Beneficiary:</span>
                            <span className="font-mono">{formData.beneficiary || "Not set"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{formData.duration || "0"} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Goal:</span>
                            <span>{formData.goal || "0"} ETH</span>
                          </div>
                        </div>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Your campaign is ready to launch! Creating the campaign will require a small gas fee.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                      Previous
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button onClick={nextStep}>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button className="bg-accent hover:bg-accent/90">
                        <Wallet className="h-4 w-4 mr-2" />
                        Create Campaign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Write a compelling title</h4>
                    <p className="text-muted-foreground">Clear, specific titles perform better than vague ones</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Set a realistic goal</h4>
                    <p className="text-muted-foreground">Campaigns with achievable goals are more likely to succeed</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tell your story</h4>
                    <p className="text-muted-foreground">Explain the impact and why people should care</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Share updates</h4>
                    <p className="text-muted-foreground">Keep supporters engaged with regular progress updates</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fees Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Fees:</span>
                    <span className="font-medium">Network dependent</span>
                  </div>
                  <Separator />
                  <p className="text-muted-foreground text-xs">
                    100% of donations go directly to your campaign. Only network gas fees apply.
                  </p>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Smart contract verified</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Transparent fund tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Refund protection</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Immutable records</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
