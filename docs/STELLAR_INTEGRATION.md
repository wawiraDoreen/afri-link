# Stellar Blockchain Integration

This document describes the Stellar blockchain integration for the AfriLink platform.

## Overview

AfriLink uses the Stellar blockchain to power the ACT (African Currency Token) - a stablecoin backed by a basket of assets including gold, USD, and EUR.

## Architecture

### Components

1. **Stellar SDK** - Official Stellar JavaScript SDK for blockchain operations
2. **Wallet Management** - Keypair generation, encryption, and storage
3. **Transaction Processing** - ACT token transfers and payments
4. **Trustline Management** - Establishing trust for ACT tokens
5. **Balance Tracking** - Real-time balance queries

### Network Configuration

The platform supports both Testnet and Mainnet:

- **Testnet**: For development and testing (uses Friendbot for funding)
- **Mainnet**: For production use

Configuration is managed via environment variables.

## Environment Variables

Required environment variables:

\`\`\`env
# Stellar Network Configuration
STELLAR_NETWORK=testnet                    # 'testnet' or 'mainnet'
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# ACT Token Configuration
ACT_TOKEN_ISSUER=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TREASURY_PUBLIC_KEY=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TREASURY_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Wallet Encryption
WALLET_ENCRYPTION_KEY=your-secure-encryption-key-here
\`\`\`

## Key Features

### 1. Wallet Creation

Users can create Stellar wallets that are:
- Automatically funded on testnet
- Encrypted before storage
- Linked to user accounts

### 2. ACT Token Trustline

Before receiving ACT tokens, wallets must establish a trustline:
- One-time setup per wallet
- Allows receiving ACT tokens
- Configurable trust limit

### 3. Token Transfers

Peer-to-peer ACT token transfers:
- Instant settlement
- Low transaction fees
- Optional memo field
- Transaction history tracking

### 4. Balance Management

Real-time balance tracking:
- Query Stellar network for current balance
- Sync with local database
- Support for multiple assets

## Security

### Secret Key Encryption

All Stellar secret keys are encrypted before storage using:
- AES-256-GCM encryption
- Unique initialization vectors
- Authentication tags for integrity

### Row Level Security (RLS)

Database access is protected with RLS policies:
- Users can only access their own wallets
- Admins have read-only access to all wallets
- Secret keys are never exposed via API

## Usage Examples

### Create a Wallet

\`\`\`typescript
import { createUserWallet } from "@/app/actions/wallet"

const result = await createUserWallet()
if (result.success) {
  console.log("Wallet created:", result.publicKey)
}
\`\`\`

### Send ACT Tokens

\`\`\`typescript
import { sendAct } from "@/app/actions/transactions"

const result = await sendAct(
  "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "100.50",
  "Payment for services"
)

if (result.success) {
  console.log("Transaction hash:", result.transactionHash)
}
\`\`\`

### Check Balance

\`\`\`typescript
import { getWalletBalance } from "@/app/actions/wallet"

const result = await getWalletBalance()
if (result.success) {
  console.log("Balance:", result.balance, "ACT")
}
\`\`\`

## Testing

### Testnet Setup

1. Set `STELLAR_NETWORK=testnet`
2. Create a wallet - it will be automatically funded
3. Establish ACT trustline
4. Test transfers between wallets

### Friendbot

Testnet wallets are automatically funded with XLM using Friendbot. This provides the minimum balance required for Stellar operations.

## Production Considerations

### Before Going Live

1. **Generate Treasury Keypair**: Create a secure keypair for ACT token issuance
2. **Configure Mainnet**: Update environment variables for mainnet
3. **Secure Secret Keys**: Use proper key management (HSM, KMS)
4. **Multi-signature**: Implement multi-sig for treasury operations
5. **Monitoring**: Set up transaction monitoring and alerts

### Best Practices

- Never expose secret keys in logs or error messages
- Rotate encryption keys periodically
- Implement rate limiting for transaction endpoints
- Monitor for suspicious activity
- Keep Stellar SDK updated

## Troubleshooting

### Common Issues

**Wallet Creation Fails**
- Check network connectivity to Horizon server
- Verify environment variables are set
- Ensure database connection is working

**Trustline Establishment Fails**
- Wallet needs minimum XLM balance (2 XLM)
- Check ACT_TOKEN_ISSUER is valid
- Verify network configuration

**Transfer Fails**
- Insufficient balance (including fees)
- Recipient hasn't established trustline
- Invalid public key format
- Network timeout

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Stellar SDK Reference](https://stellar.github.io/js-stellar-sdk/)
- [Horizon API](https://developers.stellar.org/api/horizon)
