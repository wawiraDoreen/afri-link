"use server"

import { createClient } from "@/lib/supabase/server"
import { transferAct } from "@/lib/stellar/transactions"
import { decryptSecretKey } from "@/lib/stellar/encryption"
import { isValidPublicKey } from "@/lib/stellar/client"
import { getActBalance } from "@/lib/stellar/wallet"
import { revalidatePath } from "next/cache"

export interface SendActResult {
  success: boolean
  transactionId?: string
  transactionHash?: string
  error?: string
}

/**
 * Send ACT tokens to another wallet
 */
export async function sendAct(
  recipientPublicKey: string,
  amount: string,
  description?: string,
): Promise<SendActResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Validate recipient public key
    if (!isValidPublicKey(recipientPublicKey)) {
      return { success: false, error: "Invalid recipient public key" }
    }

    // Validate amount
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return { success: false, error: "Invalid amount" }
    }

    // Get sender's wallet
    const { data: senderWallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (walletError || !senderWallet) {
      return { success: false, error: "Sender wallet not found" }
    }

    // Check balance
    const balance = await getActBalance(senderWallet.stellar_public_key)
    if (balance < amountNum) {
      return { success: false, error: "Insufficient balance" }
    }

    // Get recipient wallet (if exists in our system)
    const { data: recipientWallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("stellar_public_key", recipientPublicKey)
      .single()

    // Decrypt sender's secret key
    const secretKey = decryptSecretKey(senderWallet.stellar_secret_key_encrypted)

    // Execute transfer on Stellar network
    const result = await transferAct({
      fromSecretKey: secretKey,
      toPublicKey: recipientPublicKey,
      amount: amount,
      memo: description,
    })

    if (!result.success) {
      return { success: false, error: result.error || "Transfer failed" }
    }

    // Record transaction in database
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        transaction_hash: result.transactionHash,
        from_wallet_id: senderWallet.id,
        to_wallet_id: recipientWallet?.id || null,
        from_user_id: user.id,
        to_user_id: recipientWallet?.user_id || null,
        amount: amountNum,
        transaction_type: "transfer",
        status: "completed",
        description: description || null,
        fee: 0,
      })
      .select()
      .single()

    if (txError) {
      console.error("[v0] Error recording transaction:", txError)
    }

    // Update sender balance
    const newBalance = await getActBalance(senderWallet.stellar_public_key)
    await supabase.from("wallets").update({ balance: newBalance }).eq("id", senderWallet.id)

    // Update recipient balance if in our system
    if (recipientWallet) {
      const recipientBalance = await getActBalance(recipientPublicKey)
      await supabase.from("wallets").update({ balance: recipientBalance }).eq("id", recipientWallet.id)
    }

    revalidatePath("/dashboard")
    revalidatePath("/transactions")

    return {
      success: true,
      transactionId: transaction?.id,
      transactionHash: result.transactionHash,
    }
  } catch (error) {
    console.error("[v0] Error in sendAct:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get user's transaction history
 */
export async function getUserTransactionHistory(limit = 50) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated", transactions: [] }
    }

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        from_wallet:from_wallet_id(stellar_public_key),
        to_wallet:to_wallet_id(stellar_public_key)
      `,
      )
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[v0] Error fetching transactions:", error)
      return { success: false, error: "Failed to fetch transactions", transactions: [] }
    }

    return { success: true, transactions: transactions || [] }
  } catch (error) {
    console.error("[v0] Error in getUserTransactionHistory:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      transactions: [],
    }
  }
}
