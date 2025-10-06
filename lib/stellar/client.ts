import * as StellarSdk from "@stellar/stellar-sdk"
import { STELLAR_CONFIG } from "./config"

/**
 * Get Stellar Server instance
 */
export function getStellarServer(): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonUrl)
}

/**
 * Get Stellar Network configuration
 */
export function getNetworkPassphrase(): string {
  return STELLAR_CONFIG.networkPassphrase
}

/**
 * Create a new Stellar keypair
 */
export function createKeypair(): StellarSdk.Keypair {
  return StellarSdk.Keypair.random()
}

/**
 * Load keypair from secret key
 */
export function loadKeypair(secretKey: string): StellarSdk.Keypair {
  return StellarSdk.Keypair.fromSecret(secretKey)
}

/**
 * Validate Stellar public key
 */
export function isValidPublicKey(publicKey: string): boolean {
  try {
    StellarSdk.StrKey.decodeEd25519PublicKey(publicKey)
    return true
  } catch {
    return false
  }
}

/**
 * Validate Stellar secret key
 */
export function isValidSecretKey(secretKey: string): boolean {
  try {
    StellarSdk.StrKey.decodeEd25519SecretKey(secretKey)
    return true
  } catch {
    return false
  }
}
