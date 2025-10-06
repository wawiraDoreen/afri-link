import { createClient } from "@/lib/supabase/server"
import { createUserWallet } from "@/app/actions/wallet"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect("/auth/login")
  }

  const result = await createUserWallet()

  if (result.success) {
    return NextResponse.redirect("/dashboard")
  }

  return NextResponse.json({ error: result.error }, { status: 400 })
}
