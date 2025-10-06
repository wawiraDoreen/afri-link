export interface User {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  kyc_status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  stellar_public_key: string
  stellar_secret_key_encrypted: string
  balance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  transaction_hash: string
  from_wallet_id: string | null
  to_wallet_id: string | null
  from_user_id: string | null
  to_user_id: string | null
  amount: number
  transaction_type: "transfer" | "deposit" | "withdrawal" | "exchange"
  status: "pending" | "completed" | "failed"
  description: string | null
  fee: number
  created_at: string
  updated_at: string
}

export interface ExchangeRate {
  id: string
  from_currency: string
  to_currency: string
  rate: number
  created_at: string
  updated_at: string
}

export interface KycDocument {
  id: string
  user_id: string
  document_type: "passport" | "national_id" | "drivers_license" | "proof_of_address"
  document_url: string
  status: "pending" | "approved" | "rejected"
  rejection_reason: string | null
  created_at: string
  updated_at: string
}
