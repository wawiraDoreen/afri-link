"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadKYCDocument(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const documentType = formData.get("documentType") as string
  const file = formData.get("file") as File

  if (!file || !documentType) {
    return { error: "Missing required fields" }
  }

  try {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${documentType}-${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("kyc-documents").upload(fileName, file)

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return { error: "Failed to upload document" }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("kyc-documents").getPublicUrl(fileName)

    // Save document record
    const { data, error } = await supabase
      .from("kyc_documents")
      .insert({
        user_id: user.id,
        document_type: documentType,
        document_url: publicUrl,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return { error: "Failed to save document record" }
    }

    // Update user profile KYC status
    await supabase.from("user_profiles").update({ kyc_status: "pending" }).eq("user_id", user.id)

    revalidatePath("/dashboard")
    revalidatePath("/kyc")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] KYC upload error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getKYCDocuments() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("kyc_documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching KYC documents:", error)
    return { error: "Failed to fetch documents" }
  }

  return { data }
}

export async function getKYCStatus() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("kyc_status, kyc_verified_at")
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("[v0] Error fetching KYC status:", error)
    return { error: "Failed to fetch KYC status" }
  }

  return { data }
}
