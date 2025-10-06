"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getExchangeRates() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("exchange_rates")
    .select(`
      *,
      currency:currency_code(*)
    `)
    .eq("is_active", true)
    .order("currency_code", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching exchange rates:", error)
    return { error: "Failed to fetch exchange rates" }
  }

  return { data }
}

export async function getCurrencies() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("currencies")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching currencies:", error)
    return { error: "Failed to fetch currencies" }
  }

  return { data }
}

export async function convertCurrency(fromCurrency: string, toCurrency: string, amount: number) {
  const supabase = await createServerClient()

  // Get exchange rates
  const { data: rates } = await supabase
    .from("exchange_rates")
    .select("*")
    .in("currency_code", [fromCurrency, toCurrency])
    .eq("is_active", true)

  if (!rates || rates.length < 2) {
    return { error: "Exchange rates not available" }
  }

  const fromRate = rates.find((r) => r.currency_code === fromCurrency)
  const toRate = rates.find((r) => r.currency_code === toCurrency)

  if (!fromRate || !toRate) {
    return { error: "Currency not found" }
  }

  // Convert: amount * (toRate / fromRate)
  const convertedAmount = amount * (toRate.rate_to_act / fromRate.rate_to_act)

  return {
    data: {
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      rate: toRate.rate_to_act / fromRate.rate_to_act,
    },
  }
}

export async function createExchangeOrder(fromCurrency: string, toCurrency: string, amount: number) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Get conversion rate
  const conversion = await convertCurrency(fromCurrency, toCurrency, amount)

  if (conversion.error || !conversion.data) {
    return { error: conversion.error || "Conversion failed" }
  }

  // Create exchange transaction record
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      type: "exchange",
      from_currency: fromCurrency,
      to_currency: toCurrency,
      amount: amount,
      converted_amount: conversion.data.convertedAmount,
      exchange_rate: conversion.data.rate,
      status: "completed",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating exchange order:", error)
    return { error: "Failed to create exchange order" }
  }

  revalidatePath("/exchange")
  revalidatePath("/transactions")
  return { success: true, data }
}

export async function updateExchangeRate(currencyCode: string, newRate: number) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("user_id", user.id).single()

  if (!profile?.is_admin) {
    return { error: "Unauthorized - Admin access required" }
  }

  const { error } = await supabase
    .from("exchange_rates")
    .update({
      rate_to_act: newRate,
      updated_at: new Date().toISOString(),
    })
    .eq("currency_code", currencyCode)

  if (error) {
    console.error("[v0] Error updating exchange rate:", error)
    return { error: "Failed to update exchange rate" }
  }

  revalidatePath("/admin/exchange-rates")
  revalidatePath("/exchange")
  return { success: true }
}
