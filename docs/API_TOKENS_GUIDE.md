# API Tokens Guide for Pesa-Afrik

## Overview
Pesa-Afrik requires external API tokens to fetch real-time currency exchange rates and other financial data.

## Required API Services

### 1. Currency Exchange Rates API

**Recommended Providers:**

#### Option A: ExchangeRate-API (Free Tier Available)
- **Website**: https://www.exchangerate-api.com/
- **Free Tier**: 1,500 requests/month
- **Setup**:
  1. Sign up at https://app.exchangerate-api.com/sign-up
  2. Get your API key from the dashboard
  3. Add to environment variables: `EXCHANGE_RATE_API_KEY=your_key_here`

#### Option B: Fixer.io (Reliable, Paid)
- **Website**: https://fixer.io/
- **Free Tier**: 100 requests/month
- **Setup**:
  1. Sign up at https://fixer.io/signup/free
  2. Get your API key
  3. Add to environment variables: `FIXER_API_KEY=your_key_here`

#### Option C: Open Exchange Rates (Popular)
- **Website**: https://openexchangerates.org/
- **Free Tier**: 1,000 requests/month
- **Setup**:
  1. Sign up at https://openexchangerates.org/signup/free
  2. Get your App ID
  3. Add to environment variables: `OPEN_EXCHANGE_RATES_KEY=your_key_here`

### 2. Stellar Network Configuration

**Environment Variables Needed:**
\`\`\`bash
# Stellar Network (Testnet for development, Public for production)
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# ACT Token Configuration
ACT_TOKEN_ISSUER=your_issuer_public_key
TREASURY_PUBLIC_KEY=your_treasury_public_key
TREASURY_SECRET_KEY=your_treasury_secret_key

# Wallet Encryption
WALLET_ENCRYPTION_KEY=your_32_character_encryption_key
\`\`\`

## Setting Up Environment Variables

### In Vercel (Production)
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with its value
4. Redeploy your application

### In Local Development
1. Create a `.env.local` file in your project root
2. Add all environment variables:
\`\`\`bash
# Exchange Rate API
EXCHANGE_RATE_API_KEY=your_key_here

# Stellar Configuration
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
ACT_TOKEN_ISSUER=your_issuer_key
TREASURY_PUBLIC_KEY=your_treasury_key
TREASURY_SECRET_KEY=your_secret_key
WALLET_ENCRYPTION_KEY=your_encryption_key_32_chars

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Implementing Exchange Rate Updates

### Create a Server Action for Rate Updates

\`\`\`typescript
// app/actions/update-rates.ts
'use server'

export async function updateExchangeRates() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  
  if (!apiKey) {
    throw new Error('Exchange rate API key not configured')
  }

  // Fetch latest rates
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  )
  
  const data = await response.json()
  
  // Update database with new rates
  // ... implementation
}
\`\`\`

### Set Up Cron Job (Vercel Cron)

Create `vercel.json`:
\`\`\`json
{
  "crons": [{
    "path": "/api/cron/update-rates",
    "schedule": "0 */6 * * *"
  }]
}
\`\`\`

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** (every 90 days)
4. **Monitor API usage** to detect anomalies
5. **Use rate limiting** to prevent abuse

## Testing Your Setup

Run this command to test your API connection:
\`\`\`bash
curl "https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD"
\`\`\`

## Support

If you need help setting up API tokens:
1. Check the provider's documentation
2. Verify environment variables are set correctly
3. Test API endpoints with curl or Postman
4. Check Vercel logs for any errors
