'use server'

import { createClient } from '@/lib/supabase/server'
import { actPriceService } from '@/lib/services/act-price-service'
import { revalidatePath } from 'next/cache'

export async function getBasketComposition() {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('act_basket_composition')
    .select('*')
    .order('activated_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateBasketComposition(
  goldWeight: number,
  usdWeight: number,
  eurWeight: number,
  notes: string
) {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user.id)
    .single()

  if (!profile || profile.role !== 'super_admin') {
    return { success: false, error: 'Only super admins can update basket composition' }
  }

  if (Math.abs(goldWeight + usdWeight + eurWeight - 1.0) > 0.0001) {
    return { success: false, error: 'Weights must sum to 1.0' }
  }

  const { error: deactivateError } = await supabase
    .from('act_basket_composition')
    .update({ is_active: false })
    .eq('is_active', true)

  if (deactivateError) {
    return { success: false, error: deactivateError.message }
  }

  const { data, error } = await supabase
    .from('act_basket_composition')
    .insert({
      gold_weight: goldWeight,
      usd_weight: usdWeight,
      eur_weight: eurWeight,
      is_active: true,
      activated_by: user.user.id,
      notes
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  const actPrice = await actPriceService.calculateACTPrice()
  await actPriceService.saveACTPrice(actPrice)

  revalidatePath('/admin/reserves')

  return { success: true, data }
}

export async function getReserves() {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('act_reserves')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function addReserve(
  assetType: 'gold' | 'usd' | 'eur',
  amount: number,
  amountUsd: number,
  location?: string,
  custodyProvider?: string
) {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user.id)
    .single()

  if (!profile || profile.role !== 'super_admin') {
    return { success: false, error: 'Only super admins can add reserves' }
  }

  const { data: existingReserve } = await supabase
    .from('act_reserves')
    .select('amount, amount_usd')
    .eq('asset_type', assetType)
    .single()

  if (existingReserve) {
    const newAmount = parseFloat(existingReserve.amount) + amount
    const newAmountUsd = parseFloat(existingReserve.amount_usd) + amountUsd

    const { error } = await supabase
      .from('act_reserves')
      .update({
        amount: newAmount,
        amount_usd: newAmountUsd,
        location,
        custody_provider: custodyProvider
      })
      .eq('asset_type', assetType)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    const { error } = await supabase
      .from('act_reserves')
      .insert({
        asset_type: assetType,
        amount,
        amount_usd: amountUsd,
        location,
        custody_provider: custodyProvider
      })

    if (error) {
      return { success: false, error: error.message }
    }
  }

  const { error: txError } = await supabase
    .from('reserve_transactions')
    .insert({
      transaction_type: 'deposit',
      asset_type: assetType,
      amount,
      amount_usd: amountUsd,
      new_balance: existingReserve
        ? parseFloat(existingReserve.amount) + amount
        : amount,
      reason: 'Reserve addition',
      executed_by: user.user.id,
      status: 'executed',
      executed_at: new Date().toISOString()
    })

  if (txError) {
    console.error('Error logging reserve transaction:', txError)
  }

  const actPrice = await actPriceService.calculateACTPrice()
  await actPriceService.saveACTPrice(actPrice)

  revalidatePath('/admin/reserves')

  return { success: true }
}

export async function getReserveTransactions() {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('reserve_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getACTPriceHistory(limit: number = 100) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('act_price_history')
    .select('*')
    .order('calculated_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getCurrentACTPrice() {
  const price = await actPriceService.calculateACTPrice()

  return {
    success: true,
    data: price
  }
}

export async function forceUpdateACTPrice() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { success: false, error: 'Unauthorized' }
  }

  const price = await actPriceService.calculateACTPrice()
  const saved = await actPriceService.saveACTPrice(price)

  if (!saved) {
    return { success: false, error: 'Failed to save ACT price' }
  }

  revalidatePath('/admin/reserves')

  return { success: true, data: price }
}
