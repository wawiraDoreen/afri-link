"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  return profile?.role === "admin"
}

/**
 * Get platform statistics
 */
export async function getPlatformStats() {
  const supabase = await createClient()

  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Get total users
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

    // Get total wallets
    const { count: totalWallets } = await supabase
      .from("wallets")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get total transactions
    const { count: totalTransactions } = await supabase.from("transactions").select("*", { count: "exact", head: true })

    // Get total ACT in circulation (sum of all wallet balances)
    const { data: wallets } = await supabase.from("wallets").select("balance").eq("is_active", true)

    const totalActInCirculation = wallets?.reduce((sum, wallet) => sum + wallet.balance, 0) || 0

    // Get pending KYC count
    const { count: pendingKyc } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("kyc_status", "pending")

    // Get recent transactions
    const { data: recentTransactions } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    return {
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalWallets: totalWallets || 0,
        totalTransactions: totalTransactions || 0,
        totalActInCirculation,
        pendingKyc: pendingKyc || 0,
        recentTransactions: recentTransactions || [],
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching platform stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get all users with their wallet info
 */
export async function getAllUsers(limit = 50, offset = 0) {
  const supabase = await createClient()

  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized", users: [] }
  }

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select(
        `
        *,
        wallets:wallets(*)
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { success: true, users: users || [] }
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      users: [],
    }
  }
}

/**
 * Update user KYC status
 */
export async function updateUserKycStatus(
  userId: string,
  status: "pending" | "approved" | "rejected",
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const { error } = await supabase.from("users").update({ kyc_status: status }).eq("id", userId)

    if (error) throw error

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating KYC status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get all transactions for admin view
 */
export async function getAllTransactions(limit = 100, offset = 0) {
  const supabase = await createClient()

  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized", transactions: [] }
  }

  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        from_wallet:from_wallet_id(stellar_public_key, user_id),
        to_wallet:to_wallet_id(stellar_public_key, user_id)
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { success: true, transactions: transactions || [] }
  } catch (error) {
    console.error("[v0] Error fetching transactions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      transactions: [],
    }
  }
}

/**
 * Approve KYC document
 */
export async function approveKYC(formData: FormData) {
  const supabase = await createClient()

  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" }
  }

  const documentId = formData.get("documentId") as string
  const userId = formData.get("userId") as string

  try {
    // Update document status
    const { error: docError } = await supabase
      .from("kyc_documents")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId)

    if (docError) throw docError

    // Update user profile KYC status
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        kyc_status: "approved",
        kyc_verified_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (profileError) throw profileError

    revalidatePath("/admin/kyc")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error approving KYC:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Reject KYC document
 */
export async function rejectKYC(formData: FormData) {
  const supabase = await createClient()

  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" }
  }

  const documentId = formData.get("documentId") as string
  const userId = formData.get("userId") as string

  try {
    // Update document status
    const { error: docError } = await supabase
      .from("kyc_documents")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId)

    if (docError) throw docError

    // Update user profile KYC status
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({ kyc_status: "rejected" })
      .eq("user_id", userId)

    if (profileError) throw profileError

    revalidatePath("/admin/kyc")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error rejecting KYC:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
