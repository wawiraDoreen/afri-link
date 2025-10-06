/**
 * Stellar network configuration for AfriLink platform
 */

export const STELLAR_CONFIG = {
  // Network configuration
  network: process.env.STELLAR_NETWORK || "testnet", // 'testnet' or 'mainnet'
  horizonUrl:
    process.env.STELLAR_HORIZON_URL ||
    (process.env.STELLAR_NETWORK === "mainnet" ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org"),

  // ACT Token configuration
  actTokenCode: "ACT",
  actTokenIssuer: process.env.ACT_TOKEN_ISSUER || "", // Set in system_settings or env

  // Treasury configuration
  treasuryPublicKey: process.env.TREASURY_PUBLIC_KEY || "",
  treasurySecretKey: process.env.TREASURY_SECRET_KEY || "",

  // Transaction configuration
  baseFee: "100000", // 0.00001 XLM base fee
  timeout: 180, // Transaction timeout in seconds

  // Network passphrases
  networkPassphrase:
    process.env.STELLAR_NETWORK === "mainnet"
      ? "Public Global Stellar Network ; September 2015"
      : "Test SDF Network ; September 2015",
}

export function isMainnet(): boolean {
  return STELLAR_CONFIG.network === "mainnet"
}

export function isTestnet(): boolean {
  return STELLAR_CONFIG.network === "testnet"
}
