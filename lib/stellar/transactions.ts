import * as StellarSdk from "@stellar/stellar-sdk"
import { getStellarServer, loadKeypair, getNetworkPassphrase } from "./client"
import { STELLAR_CONFIG } from "./config"

export interface TransferActParams {
  fromSecretKey: string
  toPublicKey: string
  amount: string
  memo?: string
}

export interface TransactionResult {
  success: boolean
  transactionHash?: string
  error?: string
}

/**
 * Transfer ACT tokens between wallets
 */
export async function transferAct(params: TransferActParams): Promise<TransactionResult> {
  try {
    const server = getStellarServer()
    const sourceKeypair = loadKeypair(params.fromSecretKey)
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey())

    const actAsset = new StellarSdk.Asset(STELLAR_CONFIG.actTokenCode, STELLAR_CONFIG.actTokenIssuer)

    const transactionBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: STELLAR_CONFIG.baseFee,
      networkPassphrase: getNetworkPassphrase(),
    })

    // Add payment operation
    transactionBuilder.addOperation(
      StellarSdk.Operation.payment({
        destination: params.toPublicKey,
        asset: actAsset,
        amount: params.amount,
      }),
    )

    // Add memo if provided
    if (params.memo) {
      transactionBuilder.addMemo(StellarSdk.Memo.text(params.memo))
    }

    const transaction = transactionBuilder.setTimeout(STELLAR_CONFIG.timeout).build()

    transaction.sign(sourceKeypair)

    const result = await server.submitTransaction(transaction)

    return {
      success: true,
      transactionHash: result.hash,
    }
  } catch (error) {
    console.error("[v0] Error transferring ACT:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Issue ACT tokens from treasury (admin only)
 */
export async function issueActTokens(destinationPublicKey: string, amount: string): Promise<TransactionResult> {
  try {
    if (!STELLAR_CONFIG.treasurySecretKey) {
      throw new Error("Treasury secret key not configured")
    }

    const server = getStellarServer()
    const treasuryKeypair = loadKeypair(STELLAR_CONFIG.treasurySecretKey)
    const treasuryAccount = await server.loadAccount(treasuryKeypair.publicKey())

    const actAsset = new StellarSdk.Asset(STELLAR_CONFIG.actTokenCode, STELLAR_CONFIG.actTokenIssuer)

    const transaction = new StellarSdk.TransactionBuilder(treasuryAccount, {
      fee: STELLAR_CONFIG.baseFee,
      networkPassphrase: getNetworkPassphrase(),
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: actAsset,
          amount: amount,
        }),
      )
      .addMemo(StellarSdk.Memo.text("ACT Token Issuance"))
      .setTimeout(STELLAR_CONFIG.timeout)
      .build()

    transaction.sign(treasuryKeypair)

    const result = await server.submitTransaction(transaction)

    return {
      success: true,
      transactionHash: result.hash,
    }
  } catch (error) {
    console.error("[v0] Error issuing ACT tokens:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get transaction history for a wallet
 */
export async function getTransactionHistory(publicKey: string, limit = 50): Promise<any[]> {
  try {
    const server = getStellarServer()
    const transactions = await server.transactions().forAccount(publicKey).order("desc").limit(limit).call()

    return transactions.records
  } catch (error) {
    console.error("[v0] Error fetching transaction history:", error)
    return []
  }
}

/**
 * Get transaction details by hash
 */
export async function getTransactionByHash(hash: string): Promise<any | null> {
  try {
    const server = getStellarServer()
    const transaction = await server.transactions().transaction(hash).call()
    return transaction
  } catch (error) {
    console.error("[v0] Error fetching transaction:", error)
    return null
  }
}
