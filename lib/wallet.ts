// Wallet connection and Web3 utilities
export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
}

export class WalletService {
  private static instance: WalletService
  private ethereum: any

  private constructor() {
    if (typeof window !== "undefined") {
      this.ethereum = (window as any).ethereum
    }
  }

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  async connectWallet(): Promise<WalletState> {
    if (!this.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      const accounts = await this.ethereum.request({
        method: "eth_requestAccounts",
      })

      const chainId = await this.ethereum.request({
        method: "eth_chainId",
      })

      const balance = await this.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      return {
        isConnected: true,
        address: accounts[0],
        balance: this.formatBalance(balance),
        chainId: Number.parseInt(chainId, 16),
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }

  async disconnectWallet(): Promise<void> {
    // MetaMask doesn't have a disconnect method, so we just clear local state
    return Promise.resolve()
  }

  async getBalance(address: string): Promise<string> {
    if (!this.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    const balance = await this.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    })

    return this.formatBalance(balance)
  }

  async sendTransaction(to: string, value: string, data?: string): Promise<string> {
    if (!this.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    const accounts = await this.ethereum.request({
      method: "eth_accounts",
    })

    if (accounts.length === 0) {
      throw new Error("No connected accounts")
    }

    const txHash = await this.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to,
          value: this.toHex(value),
          data: data || "0x",
        },
      ],
    })

    return txHash
  }

  private formatBalance(balance: string): string {
    // Convert from wei to ETH
    const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)
    return balanceInEth.toFixed(4)
  }

  private toHex(value: string): string {
    // Convert ETH to wei and then to hex
    const valueInWei = Math.floor(Number.parseFloat(value) * Math.pow(10, 18))
    return "0x" + valueInWei.toString(16)
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.ethereum) {
      this.ethereum.on("accountsChanged", callback)
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if (this.ethereum) {
      this.ethereum.on("chainChanged", callback)
    }
  }

  removeAllListeners(): void {
    if (this.ethereum) {
      this.ethereum.removeAllListeners("accountsChanged")
      this.ethereum.removeAllListeners("chainChanged")
    }
  }
}
