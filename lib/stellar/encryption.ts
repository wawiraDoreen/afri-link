import crypto from "crypto"

const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || "default-encryption-key-change-in-production"
const ALGORITHM = "aes-256-gcm"

/**
 * Encrypt Stellar secret key for storage
 */
export function encryptSecretKey(secretKey: string): string {
  try {
    const iv = crypto.randomBytes(16)
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(secretKey, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    // Combine iv, authTag, and encrypted data
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("[v0] Error encrypting secret key:", error)
    throw new Error("Failed to encrypt secret key")
  }
}

/**
 * Decrypt Stellar secret key from storage
 */
export function decryptSecretKey(encryptedData: string): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(":")

    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("[v0] Error decrypting secret key:", error)
    throw new Error("Failed to decrypt secret key")
  }
}
