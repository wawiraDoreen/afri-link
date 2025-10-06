import { createClient } from "@/lib/supabase/server"
import type { Profile, Wallet, Currency, Transaction } from "@/lib/types/database"

/**
 * User Profile Queries
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("[v0] Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("[v0] Error updating user profile:", error)
    return null
  }

  return data
}

/**
 * Wallet Queries
 */
export async function getUserWallet(userId: string): Promise<Wallet | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("[v0] Error fetching user wallet:", error)
    return null
  }

  return data
}

export async function getWalletByPublicKey(publicKey: string): Promise<Wallet | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("stellar_public_key", publicKey)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("[v0] Error fetching wallet by public key:", error)
    return null
  }

  return data
}

/**
 * Currency Queries
 */
export async function getAllCurrencies(): Promise<Currency[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("currencies").select("*").eq("is_active", true).order("name")

  if (error) {
    console.error("[v0] Error fetching currencies:", error)
    return []
  }

  return data || []
}

export async function getCurrencyByCode(code: string): Promise<Currency | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("currencies").select("*").eq("code", code).eq("is_active", true).single()

  if (error) {
    console.error("[v0] Error fetching currency:", error)
    return null
  }

  return data
}

/**
 * Exchange Rate Queries
 */
export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exchange_rates")
    .select("rate")
    .eq("from_currency_code", fromCurrency)
    .eq("to_currency_code", toCurrency)
    .single()

  if (error) {
    console.error("[v0] Error fetching exchange rate:", error)
    return null
  }

  return data?.rate || null
}

/**
 * Transaction Queries
 */
export async function getUserTransactions(userId: string, limit = 50): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching user transactions:", error)
    return []
  }

  return data || []
}

export async function getTransactionById(transactionId: string): Promise<Transaction | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("transactions").select("*").eq("id", transactionId).single()

  if (error) {
    console.error("[v0] Error fetching transaction:", error)
    return null
  }

  return data
}

/**
 * Admin Queries
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("admin_users").select("id").eq("id", userId).single()

  if (error) {
    return false
  }

  return !!data
}
