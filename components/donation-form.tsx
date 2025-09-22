"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { WalletConnect } from "@/components/wallet-connect"
import { Wallet, Heart, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface DonationFormProps {
  campaignId: number
  contractAddress?: string
}

export function DonationForm({ campaignId, contractAddress }: DonationFormProps) {
  const [amount, setAmount] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txHash, setTxHash] = useState("")

  const { isConnected, sendTransaction, error: walletError } = useWallet()

  const presetAmounts = ["0.1", "0.5", "1.0", "2.0"]

  const handlePresetAmount = (preset: string) => {
    setAmount(preset)
  }

  const handleDonate = async () => {
    if (!isConnected) {
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      return
    }

    setIsSubmitting(true)
    setSuccess(false)

    try {
      // In a real implementation, you would encode the contract call data
      // For now, we'll simulate the donation transaction
      const mockContractAddress = contractAddress || "0x1234567890123456789012345678901234567890"

      // This would be the encoded function call for donateToCampaign(campaignId, name, message)
      const data = "0x" // Placeholder for encoded contract call

      const hash = await sendTransaction(mockContractAddress, amount, data)

      setTxHash(hash)
      setSuccess(true)

      // Reset form
      setAmount("")
      setName("")
      setMessage("")
    } catch (error) {
      console.error("Donation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Thank you for your donation! Your transaction has been submitted.
          </AlertDescription>
        </Alert>

        {txHash && (
          <div className="text-sm">
            <Label>Transaction Hash:</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-muted p-2 rounded font-mono break-all">{txHash}</code>
              <Button variant="outline" size="sm" asChild>
                <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  View on Etherscan
                </a>
              </Button>
            </div>
          </div>
        )}

        <Button variant="outline" onClick={() => setSuccess(false)} className="w-full">
          Make Another Donation
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!isConnected && (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription>Connect your wallet to make a donation</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Donation Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!isConnected}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => handlePresetAmount(preset)}
              disabled={!isConnected}
            >
              {preset} ETH
            </Button>
          ))}
        </div>

        <div>
          <Label htmlFor="name">Your Name (Optional)</Label>
          <Input
            id="name"
            placeholder="Anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isConnected}
          />
        </div>

        <div>
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Leave a message of support..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
          />
        </div>
      </div>

      <Separator />

      {walletError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{walletError}</AlertDescription>
        </Alert>
      )}

      {isConnected ? (
        <Button
          className="w-full"
          size="lg"
          onClick={handleDonate}
          disabled={!amount || Number.parseFloat(amount) <= 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Donate {amount || "0"} ETH
            </>
          )}
        </Button>
      ) : (
        <WalletConnect size="lg" className="w-full" />
      )}

      <div className="text-xs text-muted-foreground text-center">
        Donations are processed instantly on the blockchain
      </div>
    </div>
  )
}
