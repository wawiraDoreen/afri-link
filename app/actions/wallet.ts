"use server"

import { createClient } from "@/lib/supabase/server"
import {
  createWallet,
  fundTestnetWallet,
  establishActTrustline,
  getActBalance,
  hasActTrustline,
} from "@/lib/stellar/wallet"
import { isValidPublicKey } from "@/lib/stellar/client"
import { revalidatePath } from "next/cache"

export interface CreateWalletResult {
  success: boolean
  walletId?: string
  publicKey?: string
  error?: string
}

/**
 * Create a new wallet for the authenticated user
 */
export async function createUserWallet(): Promise<CreateWalletResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Check if user already has a wallet
    const { data: existingWallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (existingWallet) {
      return { success: false, error: "User already has an active wallet" }
    }

    // Create new Stellar wallet
    const { publicKey, secretKey } = await createWallet()

    const { encryptSecretKey } = await import("@/lib/stellar/encryption")
    // Encrypt secret key before storing
    const encryptedSecretKey = encryptSecretKey(secretKey)

    // Store wallet in database
    const { data: wallet, error } = await supabase
      .from("wallets")
      .insert({
        user_id: user.id,
        stellar_public_key: publicKey,
        stellar_secret_key_encrypted: encryptedSecretKey,
        balance: 0,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating wallet:", error)
      return { success: false, error: "Failed to create wallet" }
    }

    // Fund wallet on testnet
    const funded = await fundTestnetWallet(publicKey)
    if (!funded) {
      console.warn("[v0] Failed to fund testnet wallet")
    }

    revalidatePath("/dashboard")
    return {
      success: true,
      walletId: wallet.id,
      publicKey: wallet.stellar_public_key,
    }
  } catch (error) {
    console.error("[v0] Error in createUserWallet:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Setup ACT token trustline for user's wallet
 */
export async function setupActTrustline(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (walletError || !wallet) {
      return { success: false, error: "Wallet not found" }
    }

    // Check if trustline already exists
    const hasTrust = await hasActTrustline(wallet.stellar_public_key)
    if (hasTrust) {
      return { success: false, error: "ACT trustline already established" }
    }

    // Decrypt secret key
    const { decryptSecretKey } = await import("@/lib/stellar/encryption")
    const secretKey = decryptSecretKey(wallet.stellar_secret_key_encrypted)

    // Establish trustline
    const success = await establishActTrustline(secretKey)

    if (!success) {
      return { success: false, error: "Failed to establish trustline" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in setupActTrustline:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get user's wallet balance
 */
export async function getWalletBalance(): Promise<{
  success: boolean
  balance?: number
  publicKey?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (walletError || !wallet) {
      return { success: false, error: "Wallet not found" }
    }

    // Get ACT balance from Stellar
    const balance = await getActBalance(wallet.stellar_public_key)

    // Update balance in database
    await supabase.from("wallets").update({ balance }).eq("id", wallet.id)

    return {
      success: true,
      balance,
      publicKey: wallet.stellar_public_key,
    }
  } catch (error) {
    console.error("[v0] Error in getWalletBalance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Validate a Stellar public key
 */
export async function validatePublicKey(publicKey: string): Promise<boolean> {
  return isValidPublicKey(publicKey)
}
