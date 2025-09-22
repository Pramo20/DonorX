"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useWallet } from "@/hooks/use-wallet"
import { withdrawOnChain, refundOnChain } from "@/lib/contract"
import { ethers } from "ethers"

interface CampaignActionsProps {
  campaignId: number
  beneficiary: string
  deadline: number
  goalWei: bigint
  raisedWei: bigint
}

export function CampaignActions({ campaignId, beneficiary, deadline, goalWei, raisedWei }: CampaignActionsProps) {
  const { address, connectWallet, isLoading } = useWallet()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [donationIndex, setDonationIndex] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const now = Math.floor(Date.now() / 1000)

  const isBeneficiary = useMemo(() => {
    if (!address) return false
    return address.toLowerCase() === beneficiary.toLowerCase()
  }, [address, beneficiary])

  const canWithdraw = isBeneficiary && raisedWei > BigInt(0)
  const canRefund = now > deadline && raisedWei < goalWei

  const handleWithdraw = async () => {
    if (!address) {
      await connectWallet()
    }
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return
    setSubmitting(true)
    try {
      await withdrawOnChain({ campaignId, amountEth: withdrawAmount })
      setWithdrawAmount("")
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRefund = async () => {
    if (!address) {
      await connectWallet()
    }
    if (donationIndex === "" || Number.isNaN(Number(donationIndex))) return
    setSubmitting(true)
    try {
      await refundOnChain({ campaignId, donationIndex: Number(donationIndex) })
      setDonationIndex("")
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm">Beneficiary Tools</Label>
        <div className="text-xs text-muted-foreground">
          {isBeneficiary ? "You are the beneficiary of this campaign." : "Connect the beneficiary wallet to withdraw."}
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Amount to withdraw (ETH)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              type="number"
              step="0.0001"
              min="0"
            />
            <Button onClick={handleWithdraw} disabled={!canWithdraw || submitting || isLoading}>
              Withdraw
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Available: {ethers.formatEther(raisedWei)} ETH
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm">Refund (for donors)</Label>
        <div className="text-xs text-muted-foreground">
          {canRefund
            ? "Enter your donation index to claim a refund."
            : "Refunds are only available after the deadline if the goal was not reached."}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Donation index"
            value={donationIndex}
            onChange={(e) => setDonationIndex(e.target.value)}
            type="number"
            min="0"
          />
          <Button onClick={handleRefund} disabled={!canRefund || submitting || isLoading}>
            Refund
          </Button>
        </div>
      </div>
    </div>
  )
}


