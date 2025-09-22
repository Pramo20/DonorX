"use client"

import { useState, useEffect, useCallback } from "react"
import { WalletService, type WalletState } from "@/lib/wallet"

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletService = WalletService.getInstance()

  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const state = await walletService.connectWallet()
      setWalletState(state)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }, [walletService])

  const disconnectWallet = useCallback(async () => {
    setIsLoading(true)
    try {
      await walletService.disconnectWallet()
      setWalletState(initialState)
    } catch (err: any) {
      setError(err.message || "Failed to disconnect wallet")
    } finally {
      setIsLoading(false)
    }
  }, [walletService])

  const sendTransaction = useCallback(
    async (to: string, value: string, data?: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const txHash = await walletService.sendTransaction(to, value, data)
        return txHash
      } catch (err: any) {
        setError(err.message || "Transaction failed")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [walletService],
  )

  const refreshBalance = useCallback(async () => {
    if (!walletState.address) return

    try {
      const balance = await walletService.getBalance(walletState.address)
      setWalletState((prev) => ({ ...prev, balance }))
    } catch (err: any) {
      setError(err.message || "Failed to refresh balance")
    }
  }, [walletService, walletState.address])

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletState(initialState)
      } else {
        // Mark as connected when at least one account is present so other
        // components using this hook enable their UI controls.
        setWalletState((prev) => ({ ...prev, isConnected: true, address: accounts[0] }))
      }
    }

    const handleChainChanged = (chainId: string) => {
      setWalletState((prev) => ({ ...prev, chainId: Number.parseInt(chainId, 16) }))
    }

    walletService.onAccountsChanged(handleAccountsChanged)
    walletService.onChainChanged(handleChainChanged)

    return () => {
      walletService.removeAllListeners()
    }
  }, [walletService])

  return {
    ...walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    refreshBalance,
  }
}
