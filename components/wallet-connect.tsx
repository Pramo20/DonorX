"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface WalletConnectProps {
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  showBalance?: boolean
  className?: string
}

export function WalletConnect({
  variant = "default",
  size = "default",
  showBalance = false,
  className = "",
}: WalletConnectProps) {
  const { isConnected, address, balance, chainId, isLoading, error, connectWallet, disconnectWallet } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const isCorrectNetwork = chainId === 1 || chainId === 11155111 // Mainnet or Sepolia

  if (error) {
    return (
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {!isCorrectNetwork && (
          <Badge variant="destructive" className="text-xs">
            Wrong Network
          </Badge>
        )}

        <div className="flex items-center gap-2">
          {showBalance && balance && <span className="text-sm font-medium">{balance} ETH</span>}

          <Button variant={variant} size={size} onClick={disconnectWallet} disabled={isLoading} className="font-mono">
            <Wallet className="h-4 w-4 mr-2" />
            {formatAddress(address)}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button variant={variant} size={size} onClick={connectWallet} disabled={isLoading} className={className}>
      <Wallet className="h-4 w-4 mr-2" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
