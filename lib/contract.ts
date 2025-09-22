import { ethers } from "ethers"

export interface CampaignDto {
  id: number
  beneficiary: string
  title: string
  description: string
  goalWei: bigint
  raisedWei: bigint
  deadline: number
  withdrawn: boolean
}

export interface DonationDto {
  donor: string
  amountWei: bigint
  name: string
  message: string
  timestamp: number
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
const RPC_URL = "https://rpc.sepolia.org"
const SEPOLIA_CHAIN_ID_DEC = 11155111
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"

if (!CONTRACT_ADDRESS) {
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_CONTRACT_ADDRESS is not set")
}

// Minimal ABI for DonationPortal contract based on the provided Solidity
const DONATION_PORTAL_ABI = [
  // reads
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256 id) view returns (uint256,address,string,string,uint256,uint256,uint256,bool,bool)",
  "function getCampaign(uint256 id) view returns (uint256,address,string,string,uint256,uint256,uint256,bool)",
  "function getDonationsCount(uint256 campaignId) view returns (uint256)",
  "function getDonation(uint256 campaignId, uint256 index) view returns (address,uint256,string,string,uint256)",
  // writes
  "function createCampaign(address payable beneficiary, string title, string description, uint256 goal, uint256 durationSeconds) returns (uint256)",
  "function donateToCampaign(uint256 campaignId, string name, string message) payable",
  "function withdraw(uint256 campaignId, uint256 amount)",
  "function refund(uint256 campaignId, uint256 donationIndex)",
  // admin
  "function pauseContract(bool val)",
]

export function getReadProvider(): ethers.Provider {
  // Option 1: Use MetaMask directly when available in the browser
  if (typeof window !== "undefined") {
    const { ethereum } = window as any
    if (ethereum) {
      // Ensure Sepolia and use the wallet's provider for reads
      ensureSepoliaNetwork(ethereum).catch(() => {})
      return new ethers.BrowserProvider(ethereum)
    }
  }
  // Fallback (SSR or no wallet): Sepolia public RPC
  return new ethers.JsonRpcProvider(RPC_URL)
}

export async function getSigner(): Promise<ethers.Signer> {
  if (typeof window === "undefined") throw new Error("No window")
  const { ethereum } = window as any
  if (!ethereum) throw new Error("MetaMask is not installed")
  const provider = new ethers.BrowserProvider(ethereum)
  // Ensure we are connected to Sepolia in the wallet
  ensureSepoliaNetwork(ethereum).catch(() => {})
  return provider.getSigner()
}

export function getReadContract() {
  const provider = getReadProvider()
  if (!CONTRACT_ADDRESS || !/^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)) {
    throw new Error("Contract address is not set or invalid. Set NEXT_PUBLIC_CONTRACT_ADDRESS to a Sepolia address")
  }
  return new ethers.Contract(CONTRACT_ADDRESS, DONATION_PORTAL_ABI, provider)
}

export async function getWriteContract() {
  const signer = await getSigner()
  // Prevent writes on non-Sepolia networks
  try {
    const net = await (signer.provider as ethers.Provider).getNetwork()
    if (Number(net.chainId) !== SEPOLIA_CHAIN_ID_DEC) {
      throw new Error("Wrong network: please switch to Sepolia testnet")
    }
  } catch {
    // If we cannot determine the network, be safe and block
    throw new Error("Unable to verify network. Please use Sepolia testnet")
  }
  if (!CONTRACT_ADDRESS || !/^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)) {
    throw new Error("Contract address is not set or invalid. Set NEXT_PUBLIC_CONTRACT_ADDRESS to a Sepolia address")
  }
  return new ethers.Contract(CONTRACT_ADDRESS, DONATION_PORTAL_ABI, signer)
}

export async function fetchCampaignCount(): Promise<number> {
  try {
    await assertSepoliaRead()
  } catch {}
  const c = getReadContract()
  const count: bigint = await c.campaignCount()
  return Number(count)
}

export async function fetchCampaign(id: number): Promise<CampaignDto> {
  try {
    await assertSepoliaRead()
  } catch {}
  const c = getReadContract()
  // Prefer campaigns(id) public getter to avoid modifier reverts
  const result = await c.campaigns(id)
  const exists = result[7] as boolean
  if (!exists) {
    throw new Error("Campaign not found")
  }
  return {
    id: Number(result[0]),
    beneficiary: result[1] as string,
    title: result[2] as string,
    description: result[3] as string,
    goalWei: result[4] as bigint,
    raisedWei: result[5] as bigint,
    deadline: Number(result[6]),
    withdrawn: result[8] as boolean,
  }
}

export async function fetchDonationsCount(campaignId: number): Promise<number> {
  try {
    await assertSepoliaRead()
  } catch {}
  const c = getReadContract()
  const count: bigint = await c.getDonationsCount(campaignId)
  return Number(count)
}

export async function fetchDonation(campaignId: number, index: number): Promise<DonationDto> {
  try {
    await assertSepoliaRead()
  } catch {}
  const c = getReadContract()
  const result = await c.getDonation(campaignId, index)
  return {
    donor: result[0] as string,
    amountWei: result[1] as bigint,
    name: result[2] as string,
    message: result[3] as string,
    timestamp: Number(result[4]),
  }
}

export async function listCampaigns(): Promise<
  Array<CampaignDto & { donorCount: number; raisedEth: string; goalEth: string; progressPct: number; daysLeft: number }>
> {
  try {
    await assertSepoliaRead()
  } catch {}
  const count = await fetchCampaignCount()
  const ids = Array.from({ length: count }, (_, i) => i + 1)
  const campaigns = await Promise.all(ids.map((id) => fetchCampaign(id)))
  const now = Math.floor(Date.now() / 1000)

  const withDerived = await Promise.all(
    campaigns.map(async (c) => {
      const donorCount = await fetchDonationsCount(c.id)
      const raisedEth = ethers.formatEther(c.raisedWei)
      const goalEth = ethers.formatEther(c.goalWei)
      const progressPct = Number(c.goalWei === BigInt(0) ? 0 : (Number(c.raisedWei) / Number(c.goalWei)) * 100)
      const daysLeftRaw = Math.max(0, c.deadline - now)
      const daysLeft = Math.ceil(daysLeftRaw / 86400)
      return { ...c, donorCount, raisedEth, goalEth, progressPct: Math.min(100, Math.floor(progressPct)), daysLeft }
    }),
  )

  return withDerived
}

async function ensureSepoliaNetwork(ethereum: any): Promise<void> {
  try {
    const currentChainIdHex: string = await ethereum.request({ method: "eth_chainId" })
    const currentChainId = Number.parseInt(currentChainIdHex, 16)
    if (currentChainId === SEPOLIA_CHAIN_ID_DEC) return
    // Try switch first
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    })
  } catch (switchErr: any) {
    // If the chain is not added, add it
    if (switchErr && (switchErr.code === 4902 || switchErr.code === -32603)) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: "Sepolia",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [RPC_URL || "https://ethereum-sepolia.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        })
      } catch {
        // swallow; user can switch manually
      }
    }
  }
}

async function assertSepoliaRead(): Promise<void> {
  // On the server, don't block rendering if RPC verification fails; we already use a Sepolia RPC URL.
  if (typeof window === "undefined") {
    return
  }

  const provider = getReadProvider()
  try {
    if ((provider as any).provider && (window as any).ethereum) {
      const chainIdHex: string = await (window as any).ethereum.request({ method: "eth_chainId" })
      const chainId = Number.parseInt(chainIdHex, 16)
      if (chainId !== SEPOLIA_CHAIN_ID_DEC) {
        throw new Error("Wrong network: please switch to Sepolia testnet")
      }
      return
    }
  } catch {
    // In the browser without ethereum, just rely on RPC; don't block UI
    return
  }
}

export async function createCampaignOnChain(params: {
  beneficiary: string
  title: string
  description: string
  goalEth: string
  durationDays: number
}): Promise<number> {
  const contract = await getWriteContract()
  const goalWei = ethers.parseEther(params.goalEth)
  const durationSeconds = BigInt(params.durationDays * 24 * 60 * 60)
  const tx = await contract.createCampaign(
    params.beneficiary,
    params.title,
    params.description,
    goalWei,
    durationSeconds,
  )
  const receipt = await tx.wait()
  // Parse CampaignCreated(id,...)
  const event = receipt.logs
    .map((l: any) => {
      try {
        return contract.interface.parseLog(l)
      } catch {
        return null
      }
    })
    .find((p: any) => p && p.name === "CampaignCreated")
  if (event) {
    const id = Number(event.args?.[0])
    return id
  }
  // Fallback to reading latest counter
  return fetchCampaignCount()
}

export async function donateOnChain(params: {
  campaignId: number
  name: string
  message: string
  amountEth: string
}): Promise<string> {
  const contract = await getWriteContract()
  const tx = await contract.donateToCampaign(params.campaignId, params.name, params.message, {
    value: ethers.parseEther(params.amountEth),
  })
  const receipt = await tx.wait()
  return receipt.hash
} 

export async function withdrawOnChain(params: { campaignId: number; amountEth: string }): Promise<string> {
  const contract = await getWriteContract()
  const amountWei = ethers.parseEther(params.amountEth)
  const tx = await contract.withdraw(params.campaignId, amountWei)
  const receipt = await tx.wait()
  return receipt.hash
}

export async function refundOnChain(params: { campaignId: number; donationIndex: number }): Promise<string> {
  const contract = await getWriteContract()
  const tx = await contract.refund(params.campaignId, params.donationIndex)
  const receipt = await tx.wait()
  return receipt.hash
}

export async function pauseContractOnChain(paused: boolean): Promise<string> {
  const contract = await getWriteContract()
  const tx = await contract.pauseContract(paused)
  const receipt = await tx.wait()
  return receipt.hash
}