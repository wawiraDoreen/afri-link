import * as StellarSdk from "@stellar/stellar-sdk"
import { getStellarServer, createKeypair, loadKeypair, getNetworkPassphrase } from "./client"
import { STELLAR_CONFIG } from "./config"

/**
 * Create a new Stellar wallet
 */
export async function createWallet(): Promise<{
  publicKey: string
  secretKey: string
}> {
  const keypair = createKeypair()

  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  }
}

/**
 * Fund a wallet on testnet using Friendbot
 */
export async function fundTestnetWallet(publicKey: string): Promise<boolean> {
  if (STELLAR_CONFIG.network !== "testnet") {
    throw new Error("Friendbot is only available on testnet")
  }

  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`)
    return response.ok
  } catch (error) {
    console.error("[v0] Error funding testnet wallet:", error)
    return false
  }
}

/**
 * Get wallet balance for ACT tokens
 */
export async function getActBalance(publicKey: string): Promise<number> {
  try {
    const server = getStellarServer()
    const account = await server.loadAccount(publicKey)

    // Find ACT token balance
    const actBalance = account.balances.find(
      (balance) =>
        balance.asset_type !== "native" &&
        "asset_code" in balance &&
        balance.asset_code === STELLAR_CONFIG.actTokenCode &&
        "asset_issuer" in balance &&
        balance.asset_issuer === STELLAR_CONFIG.actTokenIssuer,
    )

    if (actBalance && "balance" in actBalance) {
      return Number.parseFloat(actBalance.balance)
    }

    return 0
  } catch (error) {
    console.error("[v0] Error getting ACT balance:", error)
    return 0
  }
}

/**
 * Get XLM (native) balance
 */
export async function getXlmBalance(publicKey: string): Promise<number> {
  try {
    const server = getStellarServer()
    const account = await server.loadAccount(publicKey)

    const nativeBalance = account.balances.find((balance) => balance.asset_type === "native")

    if (nativeBalance && "balance" in nativeBalance) {
      return Number.parseFloat(nativeBalance.balance)
    }

    return 0
  } catch (error) {
    console.error("[v0] Error getting XLM balance:", error)
    return 0
  }
}

/**
 * Establish trustline for ACT token
 */
export async function establishActTrustline(secretKey: string): Promise<boolean> {
  try {
    const server = getStellarServer()
    const keypair = loadKeypair(secretKey)
    const account = await server.loadAccount(keypair.publicKey())

    const actAsset = new StellarSdk.Asset(STELLAR_CONFIG.actTokenCode, STELLAR_CONFIG.actTokenIssuer)

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: STELLAR_CONFIG.baseFee,
      networkPassphrase: getNetworkPassphrase(),
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: actAsset,
          limit: "1000000000", // Maximum trust limit
        }),
      )
      .setTimeout(STELLAR_CONFIG.timeout)
      .build()

    transaction.sign(keypair)

    const result = await server.submitTransaction(transaction)
    return result.successful
  } catch (error) {
    console.error("[v0] Error establishing ACT trustline:", error)
    return false
  }
}

/**
 * Check if wallet has ACT trustline
 */
export async function hasActTrustline(publicKey: string): Promise<boolean> {
  try {
    const server = getStellarServer()
    const account = await server.loadAccount(publicKey)

    const hasTrust = account.balances.some(
      (balance) =>
        balance.asset_type !== "native" &&
        "asset_code" in balance &&
        balance.asset_code === STELLAR_CONFIG.actTokenCode &&
        "asset_issuer" in balance &&
        balance.asset_issuer === STELLAR_CONFIG.actTokenIssuer,
    )

    return hasTrust
  } catch (error) {
    console.error("[v0] Error checking ACT trustline:", error)
    return false
  }
}
