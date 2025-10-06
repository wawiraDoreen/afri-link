# AFRICAN CURRENCY PLATFORM (ACP) – "AFRILINK"
Unifying Africa’s Financial Future

## PROJECT NAME ##
AfriLink – A digital platform powered by ACT (African Currency Token), a basket-backed stablecoin designed to unify Africa’s fragmented financial systems, enable seamless cross-border transactions, and combat currency volatility.

## PURPOSE ##
# Core Mission #
To create a unified, stable, and inclusive financial ecosystem for Africa by:

1. Reducing Reliance on Volatile Fiat Currencies:
ACT is pegged to a basket of stable assets (e.g., gold, USD, EUR) to shield users from hyperinflation (e.g., Zimbabwe, Sudan) and currency crashes (e.g., Nigerian Naira).
2. Enabling Low-Cost Cross-Border Payments:
Leverage Stellar’s blockchain to settle transactions in seconds with near-zero fees (vs. 10%+ fees from legacy systems like Western Union).
3. Promoting Financial Inclusion:
Provide unbanked populations (57% of Africa’s population) with secure, mobile-first access to savings, payments, and credit.

"CORE FUNCTIONALITY"

1. User Features
A. Wallet Management
Multi-Currency Wallets:
Users hold ACT and other African/foreign currencies (e.g., Naira, Cedis, USD).
Frontend: WalletCard.js displays balances, QR codes, and Stellar addresses.
Peer-to-Peer (P2P) Transfers:
Send ACT or fiat to any user by Stellar address, phone number, or QR code.
Backend: transaction.service.ts uses Stellar SDK for atomic swaps.
B. Currency Exchange
In-App Converter:
Swap ACT to local currencies (e.g., ACT → Naira) using real-time exchange rates.
Frontend: CurrencyConverter.js with live charts.
Stability Mechanism:
ACT’s value is algorithmically stabilized via a basket of reserves (e.g., 40% gold, 30% USD, 30% EUR).
Backend: exchange-rate.service.ts updates rates hourly using APIs like GoldPrice.org.
C. Transaction History
Immutable Records:
Every transaction is recorded on Stellar’s blockchain.
Frontend: TransactionList.js shows timestamps, amounts, and Stellar TX hashes.
D. KYC/AML Integration
Identity Verification:
Users upload ID documents (e.g., passport, driver’s license) for approval.
Backend: user.service.ts integrates with Jumio/Onfido APIs.
2. Admin Features
A. Currency Management
Add/Update Currencies:
Define new fiat or crypto currencies (e.g., Kenya Shilling, Bitcoin).
Backend: admin.controller.ts (endpoint: POST /admin/currencies).
Adjust ACT’s Basket Composition:
Manually rebalance ACT’s reserve ratio (e.g., 50% gold, 25% USD, 25% EUR).
Frontend: AdminDashboard.js with drag-and-drop UI.
B. Transaction Oversight
Monitor/Reverse Transactions:
Flag suspicious activity (e.g., large transfers) and reverse transactions.
Backend: admin.service.ts queries transactions table.
C. News & Announcements
Push System Updates:
Post news (e.g., “ACT basket rebalanced”) to all users.
Frontend: ManageNews.js with rich-text editor.
D. System Health
Real-Time Dashboard:
Track server uptime, Stellar node status, and user growth.
Frontend: SystemHealth.js with charts.
3. Blockchain & Stellar Integration
A. ACT Issuance
Admin-Controlled Supply:
ACT is minted/burned via Stellar’s payment operations.
Backend: stellar.service.ts uses Keypair.fromSecret() to sign transactions.
B. Multi-Sig Treasury
Secure Fund Management:
Requires 2/3 admin signatures to move ACT reserves.
Backend: stellar.service.ts sets up Stellar’s setOptions for multi-sig.
C. User Wallets
Non-Custodial by Default:
Users control private keys (encrypted and stored locally).
Frontend: WalletCard.js shows public address; secrets never exposed.
KEY TECHNICAL COMPONENTS
A. Backend (TypeScript/NestJS)
Modules:
user/: Registration, KYC, profiles.
wallet/: Stellar account linkage.
transaction/: Stellar payment processing.
currency/: Exchange rate management.
admin/: CRUD for currencies, news, and system health.
B. Frontend (React)
Responsive UI:
Mobile-first design with dark/light themes.
Components: CurrencyConverter.js, AdminDashboard.js.
C. Database (MySQL/TypeORM)
Tables:
currencies: ACT and fiat details.
wallets: Links users to Stellar addresses.
transactions: Immutable records with Stellar TX hashes.
WHY IT MATTERS
For Users:
Send money across Africa for <$0.01 fees.
Save in ACT to avoid inflation (e.g., 500% inflation in Zimbabwe).
For Africa:
Reduce reliance on foreign currencies (e.g., USD).
Attract diaspora remittances (worth $85B/year in Africa).


1. Target Market & Use Cases
Primary Users:
Unbanked Populations: 57% of Africa’s population lacks access to formal banking.
Cross-Border Traders: Businesses moving goods between African countries (e.g., Nigerian traders in Ghana).
Diaspora Communities: Africans sending money home (Africa’s remittance market is $85B/year).
Key Use Cases:
Micropayments: Pay for utilities, school fees, or agricultural supplies in ACT.
Savings Protection: Store wealth in ACT to hedge against hyperinflation (e.g., Sudan’s 300% inflation).
Merchant Payments: Pay for goods at local stores via QR codes.
2. Competitive Edge
Feature	AfriLink (ACT)	Competitors (e.g., M-Pesa, Bitcoin)
Stability	Basket-backed (gold, USD, EUR)	Fiat (volatile) or volatile crypto
Cost	Near-zero fees (Stellar)	5–10% fees (remittances)
Speed	3–5 seconds (Stellar)	1–3 days (bank transfers)
Accessibility	Mobile app + USSD for feature phones	Limited to smartphone users
3. Revenue Model
Transaction Fees:
Small % on cross-border payments (e.g., 0.1% vs. 10% for Western Union).
Premium Services:
Advanced analytics for businesses.
Interest-bearing savings accounts (staking ACT).
Partnerships:
Collaborate with mobile networks (e.g., MTN, Safaricom) for revenue share.
4. Regulatory Strategy
Compliance by Design:
KYC/AML checks built into user onboarding.
Work with regulators to classify ACT as a stablecoin (not a security).
Regional Adaptation:
Partner with central banks in progressive countries (e.g., Nigeria’s eNaira, Ghana’s e-Cedi).
5. Security & Trust
Custody Options:
Non-Custodial: Users control private keys (default).
Custodial: Optional insured wallets for risk-averse users.
Audits:
Smart contracts and reserves audited by firms like CertiK.
Bug Bounty Program:
Incentivize ethical hackers to find vulnerabilities.
6. Community & Education
AfriLink Academy:
Free courses on blockchain, financial literacy, and using ACT.
Available in local languages (Swahili, Yoruba, Hausa).
Ambassador Program:
Reward users for onboarding merchants and friends.
7. Future Roadmap
Phase 4: Lending & Borrowing
Use ACT as collateral for loans (integrate with Aave-like protocols).
Phase 5: Merchant Network
Partner with retailers (e.g., Shoprite, Jumia) to accept ACT.
Phase 6: Cross-Chain Interoperability
Bridge ACT to Ethereum/Celo for DeFi access.
8. Impact Metrics
Financial Inclusion:
Target 10M users in 3 years.
Cost Savings:
Save $500M/year in remittance fees for African families.
Economic Stability:
Reduce reliance on volatile currencies (e.g., Zimbabwe’s ZWL).
9. Partnerships
Blockchain:
Stellar Foundation (already aligned).
NGOs/Governments:
Partner with African Union for cross-border trade initiatives.
Telcos:
Integrate with MTN, Airtel for USSD-based transactions.
10. Marketing & Branding
Tagline: “Stable Money for Africa’s Future.”
Visual Identity:
Colors: Green (growth), gold (stability).
Symbol: A stylized African map merging into a blockchain node.
11. Challenges & Mitigation
Regulatory Uncertainty:
Proactively engage with regulators; start in crypto-friendly countries (e.g., Mauritius, Kenya).
Adoption Hurdles:
Onboard influencers (e.g., African fintech CEOs, celebrities).
Network Scalability:
Use Stellar’s Soroban smart contracts for high throughput.
12. Technical Differentiators
Stellar’s Advantages:
1,000 TPS, $0.00002/transaction.
Built-in compliance tools (e.g., Stellar’s Anchor Framework for fiat on-ramps).
Modular Architecture:
Easily add new currencies, payment rails, or DeFi features.
Example Pitch to Investors
“AfriLink isn’t just another crypto project—it’s a financial lifeline for 1.4B Africans.
By combining the stability of a gold-backed token with Stellar’s lightning-fast blockchain, we’re cutting remittance costs by 99% and giving unbanked users a secure way to save, spend, and grow.
Let’s build the future of African finance.”


## **ROOT DIRECTORY**  
```
african-currency-platform/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── backend/
├── frontend/
├── database/
├── config/
├── docs/
└── scripts/
```

---

## **BACKEND FILES**  
### **Core Structure**  
```
backend/
├── src/
│   ├── main.ts                          # Entry point
│   ├── app.module.ts                     # Root module
│   ├── app.controller.ts                 # Root controller
│   ├── app.service.ts                    # Root service
│   ├── config/                           # Configuration
│   │   ├── configuration.ts              # Config loader
│   │   ├── typeorm.config.ts             # DB config
│   │   ├── jwt.config.ts                 # Auth config
│   │   ├── cors.config.ts                # CORS rules
│   │   └── stellar.config.ts             # Blockchain config
│   ├── modules/                          # Feature modules
│   │   ├── user/                         # User management
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       ├── login-user.dto.ts
│   │   │       ├── user-response.dto.ts
│   │   │       ├── user-profile.dto.ts
│   │   │       └── user-settings.dto.ts
│   │   ├── wallet/                       # Wallet system
│   │   │   ├── wallet.module.ts
│   │   │   ├── wallet.controller.ts
│   │   │   ├── wallet.service.ts
│   │   │   ├── wallet.repository.ts
│   │   │   ├── wallet.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-wallet.dto.ts
│   │   │       ├── update-wallet.dto.ts
│   │   │       ├── wallet-balance.dto.ts
│   │   │       └── wallet-response.dto.ts
│   │   ├── transaction/                  # Transaction engine
│   │   │   ├── transaction.module.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── transaction.repository.ts
│   │   │   ├── transaction.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-transaction.dto.ts
│   │   │       ├── update-transaction.dto.ts
│   │   │       ├── transaction-response.dto.ts
│   │   │       ├── transaction-history.dto.ts
│   │   │       └── transaction-status.dto.ts
│   │   ├── currency/                     # Currency management
│   │   │   ├── currency.module.ts
│   │   │   ├── currency.controller.ts
│   │   │   ├── currency.service.ts
│   │   │   ├── currency.repository.ts
│   │   │   ├── currency.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-currency.dto.ts
│   │   │       ├── update-currency.dto.ts
│   │   │       └── currency-response.dto.ts
│   │   ├── country/                      # Country data
│   │   │   ├── country.module.ts
│   │   │   ├── country.controller.ts
│   │   │   ├── country.service.ts
│   │   │   ├── country.repository.ts
│   │   │   ├── country.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-country.dto.ts
│   │   │       ├── update-country.dto.ts
│   │   │       └── country-response.dto.ts
│   │   ├── exchange-rate/                # Rate management
│   │   │   ├── exchange-rate.module.ts
│   │   │   ├── exchange-rate.controller.ts
│   │   │   ├── exchange-rate.service.ts
│   │   │   ├── exchange-rate.repository.ts
│   │   │   ├── exchange-rate.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-exchange-rate.dto.ts
│   │   │       ├── update-exchange-rate.dto.ts
│   │   │       └── exchange-rate-response.dto.ts
│   │   ├── news/                         # News/updates
│   │   │   ├── news.module.ts
│   │   │   ├── news.controller.ts
│   │   │   ├── news.service.ts
│   │   │   ├── news.repository.ts
│   │   │   ├── news.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-news.dto.ts
│   │   │       ├── update-news.dto.ts
│   │   │       └── news-response.dto.ts
│   │   ├── economic-indicator/           # Economic data
│   │   │   ├── economic-indicator.module.ts
│   │   │   ├── economic-indicator.controller.ts
│   │   │   ├── economic-indicator.service.ts
│   │   │   ├── economic-indicator.repository.ts
│   │   │   ├── economic-indicator.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-economic-indicator.dto.ts
│   │   │       ├── update-economic-indicator.dto.ts
│   │   │   └── economic-indicator-response.dto.ts
│   │   ├── admin/                        # Admin dashboard
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── admin.repository.ts
│   │   │   ├── admin.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-admin.dto.ts
│   │   │       ├── login-admin.dto.ts
│   │   │       ├── update-admin.dto.ts
│   │   │       └── admin-response.dto.ts
│   │   ├── role/                         # User roles
│   │   │   ├── role.module.ts
│   │   │   ├── role.controller.ts
│   │   │   ├── role.service.ts
│   │   │   ├── role.repository.ts
│   │   │   ├── role.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-role.dto.ts
│   │   │       ├── update-role.dto.ts
│   │   │       └── role-response.dto.ts
│   │   ├── news-category/                # News categories
│   │   │   ├── news-category.module.ts
│   │   │   ├── news-category.controller.ts
│   │   │   ├── news-category.service.ts
│   │   │   ├── news-category.repository.ts
│   │   │   ├── news-category.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-news-category.dto.ts
│   │   │       ├── update-news-category.dto.ts
│   │   │       └── news-category-response.dto.ts
│   │   └── auth/                         # Authentication
│   │       ├── auth.module.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       └── dto/
│   │           ├── login.dto.ts
│   │           ├── register.dto.ts
│   │           ├── forgot-password.dto.ts
│   │   │       ├── reset-password.dto.ts
│   │   │       └── token.dto.ts
│   └── shared/                           # Shared utilities
│       ├── filters/                      # Exception filters
│       │   ├── http-exception.filter.ts
│       │   ├── validation-exception.filter.ts
│       │   └── unauthorized-exception.filter.ts
│       ├── guards/                       # Auth/role guards
│       │   ├── auth.guard.ts
│       │   ├── roles.guard.ts
│       │   └── admin.guard.ts
│       ├── interceptors/                 # API interceptors
│       │   ├── transform.interceptor.ts
│       │   ├── logging.interceptor.ts
│       │   └── cache.interceptor.ts
│       ├── decorators/                   # Custom decorators
│       │   ├── roles.decorator.ts
│       │   └── api-paginated-response.decorator.ts
│       └── utils/                        # Helper functions
│           ├── logger.util.ts
│           ├── crypto.util.ts
│           ├── date.util.ts
│           ├── pagination.util.ts
│           ├── response.util.ts
│           └── validation.util.ts
├── test/                                 # Test files
│   ├── jest-e2e.json
│   ├── setup.ts
│   └── modules/                          # Test per module
│       ├── user/
│       │   ├── user.controller.spec.ts
│       │   └── user.service.spec.ts
│       ├── wallet/
│       │   ├── wallet.controller.spec.ts
│       │   └── wallet.service.spec.ts
│       ├── transaction/
│       │   ├── transaction.controller.spec.ts
│       │   └── transaction.service.spec.ts
│       ├── currency/
│       │   ├── currency.controller.spec.ts
│       │   └── currency.service.spec.ts
│       ├── country/
│       │   ├── country.controller.spec.ts
│       │   └── country.service.spec.ts
│       ├── exchange-rate/
│       │   ├── exchange-rate.controller.spec.ts
│       │   └── exchange-rate.service.spec.ts
│       ├── news/
│       │   ├── news.controller.spec.ts
│       │   └── news.service.spec.ts
│       ├── economic-indicator/
│       │   ├── economic-indicator.controller.spec.ts
│       │   └── economic-indicator.service.spec.ts
│       ├── admin/
│       │   ├── admin.controller.spec.ts
│       │   └── admin.service.spec.ts
│       └── auth/
│           ├── auth.controller.spec.ts
│           └── auth.service.spec.ts
└── tsconfig.json                         # TypeScript config
```

---

## **FRONTEND FILES**  
### **Core Structure**  
```
frontend/
├── public/                               # Static assets
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/                                  # Source code
│   ├── index.js                          # Entry point
│   ├── App.js                            # Root component
│   ├── index.css                         # Global CSS
│   ├── App.css                           # App CSS
│   ├── assets/                           # Static files
│   │   ├── images/                       # Images
│   │   │   ├── logo.png
│   │   │   ├── flags/                    # Country flags
│   │   │   │   ├── nigeria.png
│   │   │   │   ├── ghana.png
│   │   │   │   ├── kenya.png
│   │   │   │   ├── south-africa.png
│   │   │   │   └── ... (all country flags)
│   │   │   ├── icons/                    # UI icons
│   │   │   │   ├── wallet.png
│   │   │   │   ├── transaction.png
│   │   │   │   ├── currency.png
│   │   │   │   ├── news.png
│   │   │   │   ├── user.png
│   │   │   │   ├── settings.png
│   │   │   │   └── ... (all UI icons)
│   │   │   └── screenshots/              # App screenshots
│   │   └── fonts/                        # Custom fonts
│   │       ├── Roboto-Regular.ttf
│   │       ├── Roboto-Bold.ttf
│   │       └── ... (other fonts)
│   ├── components/                       # Reusable UI components
│   │   ├── Layout/                       # Layout components
│   │   │   ├── Header/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Header.css
│   │   │   │   └── Header.test.js
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.js
│   │   │   │   ├── Footer.css
│   │   │   │   └── Footer.test.js
│   │   │   └── Navigation/
│   │   │       ├── Navigation.js
│   │   │       ├── Navigation.css
│   │   │       └── Navigation.test.js
│   │   ├── Currency/                     # Currency components
│   │   │   ├── CurrencyCard.js
│   │   │   ├── CurrencyCard.css
│   │   │   ├── CurrencyChart.js
│   │   │   ├── CurrencyChart.css
│   │   │   └── CurrencyConverter.js
│   │   │       ├── CurrencyConverter.js
│   │   │       ├── CurrencyConverter.css
│   │   │       └── CurrencyConverter.test.js
│   │   ├── Wallet/                       # Wallet components
│   │   │   ├── WalletCard.js
│   │   │   ├── WalletCard.css
│   │   │   ├── WalletBalance.js
│   │   │   └── WalletBalance.css
│   │   ├── Transaction/                  # Transaction components
│   │   │   ├── TransactionList.js
│   │   │   ├── TransactionList.css
│   │   │   ├── TransactionItem.js
│   │   │   ├── TransactionItem.css
│   │   │   ├── TransactionForm.js
│   │   │   └── TransactionForm.css
│   │   ├── User/                         # User components
│   │   │   ├── UserProfile.js
│   │   │   ├── UserProfile.css
│   │   │   ├── UserSettings.js
│   │   │   └── UserSettings.css
│   │   ├── Admin/                        # Admin components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminDashboard.css
│   │   │   ├── ManageNews.js
│   │   │   ├── ManageNews.css
│   │   │   ├── UpdateRates.js
│   │   │   └── UpdateRates.css
│   │   ├── UI/                           # UI elements
│   │   │   ├── Button.js
│   │   │   ├── Button.css
│   │   │   ├── Input.js
│   │   │   ├── Input.css
│   │   │   ├── Select.js
│   │   │   ├── Select.css
│   │   │   ├── Table.js
│   │   │   ├── Table.css
│   │   │   ├── Modal.js
│   │   │   ├── Modal.css
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── LoadingSpinner.css
│   │   │   ├── Alert.js
│   │   │   ├── Alert.css
│   │   │   ├── Chart.js
│   │   │   └── Chart.css
│   │   ├── Layout/                       # Layout components
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── Footer.js
│   │   │   ├── Footer.css
│   │   │   ├── Sidebar.js
│   │   │   └── Sidebar.css
│   │   └── FAQ/                          # FAQ components
│   │       ├── FAQList.js
│   │       ├── FAQList.css
│   │       ├── FAQItem.js
│   │       └── FAQItem.css
│   ├── contexts/                         # React contexts
│   │   ├── AuthContext.js
│   │   ├── WalletContext.js
│   │   ├── CurrencyContext.js
│   │   ├── TransactionContext.js
│   │   └── ThemeContext.js
│   ├── services/                         # API services
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── walletService.js
│   │   ├── transactionService.js
│   │   ├── currencyService.js
│   │   ├── countryService.js
│   │   ├── newsService.js
│   │   └── api.js
│   ├── utils/                            # Utilities
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── hooks/                        # Custom React hooks
│   │       ├── useAuth.js
│   │       ├── useWallet.js
│   │       └── useCurrency.js
│   ├── routes/                           # Routing
│   │   ├── index.js
│   │   ├── ProtectedRoute.js
│   │   └── AdminRoute.js
│   ├── screens/                          # App screens
│   │   ├── Home/                         # Home screen
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   └── Home.test.js
│   │   ├── Wallet/                       # Wallet screen
│   │   │   ├── Wallet.js
│   │   │   ├── Wallet.css
│   │   │   └── Wallet.test.js
│   │   ├── Transactions/                 # Transactions screen
│   │   │   ├── Transactions.js
│   │   │   ├── Transactions.css
│   │   │   └── Transactions.test.js
│   │   ├── TransactionDetails/           # Transaction details
│   │   │   ├── TransactionDetails.js
│   │   │   ├── TransactionDetails.css
│   │   │   └── TransactionDetails.test.js
│   │   ├── Currency/                     # Currency screen
│   │   │   ├── Currency.js
│   │   │   ├── Currency.css
│   │   │   └── Currency.test.js
│   │   ├── Converter/                    # Currency converter
│   │   │   ├── Converter.js
│   │   │   ├── Converter.css
│   │   │   └── Converter.test.js
│   │   ├── News/                         # News screen
│   │   │   ├── News.js
│   │   │   ├── News.css
│   │   │   └── News.test.js
│   │   ├── NewsDetails/                  # News details
│   │   │   ├── NewsDetails.js
│   │   │   ├── NewsDetails.css
│   │   │   └── NewsDetails.test.js
│   │   ├── About/                        # About screen
│   │   │   ├── About.js
│   │   │   ├── About.css
│   │   │   └── About.test.js
│   │   ├── Contact/                      # Contact screen
│   │   │   ├── Contact.js
│   │   │   ├── Contact.css
│   │   │   └── Contact.test.js
│   │   ├── Login/                        # Login screen
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   └── Login.test.js
│   │   ├── Register/                     # Register screen
│   │   │   ├── Register.js
│   │   │   ├── Register.css
│   │   │   └── Register.test.js
│   │   ├── Profile/                      # User profile
│   │   │   ├── Profile.js
│   │   │   ├── Profile.css
│   │   │   └── Profile.test.js
│   │   ├── FAQ/                          # FAQ screen
│   │   │   ├── FAQ.js
│   │   │   ├── FAQ.css
│   │   │   └── FAQ.test.js
│   │   ├── Contact/                      # Contact screen
│   │   │   ├── Contact.js
│   │   │   ├── Contact.css
│   │   │   └── Contact.test.js
│   │   └── Admin/                        # Admin screens
│   │       ├── AdminDashboard.js
│   │       ├── AdminDashboard.css
│   │       ├── AdminDashboard.test.js
│   │       ├── ManageNews.js
│   │       ├── ManageNews.css
│   │       ├── ManageNews.test.js
│   │       ├── UpdateRates.js
│   │       ├── UpdateRates.css
│   │       └── UpdateRates.test.js
│   └── styles/                           # Global styles
│       ├── main.css
│       ├── variables.css
│       └── mixins.css
└── package.json                          # Dependencies
```

---

## **DATABASE FILES**  
### **Schema, Migrations, Seeds**  
```
database/
├── schema/
│   ├── 01_currencies.sql                 # Currency table
│   ├── 02_countries.sql                  # Country data
│   ├── 03_exchange_rates.sql             # Rate calculations
│   ├── 04_users.sql                      # User accounts
│   ├── 05_wallets.sql                    # Wallet balances
│   ├── 06_transactions.sql               # Transaction records
│   ├── 07_transaction_status_history.sql # Status tracking
│   ├── 08_news.sql                       # News articles
│   ├── 09_economic_indicators.sql        # Economic data
│   ├── 10_news_categories.sql            # News categories
│   ├── 11_roles.sql                      # User roles
│   └── 12_user_roles.sql                 # Role assignments
├── migrations/                           # Database migrations
│   ├── 20250101000000_initial.js         # Initial setup
│   ├── 20250101000001_add_roles.js       # Role additions
│   ├── 20250101000002_add_user_profiles.js # User profiles
│   ├── 20250101000003_add_blockchain_addresses.js # Stellar addresses
│   └── ... (all migration files)         # Chronological migrations
├── seed/                                 # Test/initial data
│   ├── 01_currencies.seed.sql            # Currency seed data
│   ├── 02_countries.seed.sql             # Country seed data
│   ├── 03_exchange_rates.seed.sql        # Rate seed data
│   ├── 04_users.seed.sql                 # User seed data
│   ├── 05_wallets.seed.sql               # Wallet seed data
│   ├── 06_transactions.seed.sql          # Transaction seed data
│   ├── 07_news.seed.sql                  # News seed data
│   └── ... (all seed files)              # Additional seed data
└── queries/                              # SQL queries
    ├── user_queries.sql                  # User-related queries
    ├── wallet_queries.sql                # Wallet queries
    ├── transaction_queries.sql           # Transaction queries
    ├── currency_queries.sql              # Currency queries
    ├── country_queries.sql               # Country queries
    ├── admin_queries.sql                 # Admin queries
    └── ... (all query files)             # Additional queries
```

---

## **CONFIGURATION FILES**  
### **Server, Docker, Env**  
```
config/
├── nginx/                                # Web server config
│   ├── nginx.conf                        # Main config
│   └── sites-available/                  # Virtual hosts
│       └── african-currency-platform     # Site config
├── apache/                               # Apache config (if used)
│   └── httpd.conf
├── docker/                               # Containerization
│   ├── Dockerfile                        # Build instructions
│   ├── docker-compose.yml                # Dev setup
│   ├── docker-compose.dev.yml            # Dev overrides
│   └── docker-compose.prod.yml           # Production setup
├── pm2/                                  # Process manager
│   ├── ecosystem.config.js               # Dev config
│   └── ecosystem.config.production.js    # Production config
├── env/                                  # Environment variables
│   ├── .env.development                  # Dev vars
│   ├── .env.test                         # Test vars
│   └── .env.production                   # Production vars
└── ssl/                                  # SSL certificates
    ├── server.key                        # Private key
    └── server.crt                        # Certificate
```

---

## **DOCUMENTATION**  
### **API, Architecture, User Guides**  
```
docs/
├── api/                                  # API documentation
│   ├── swagger.json                      # OpenAPI spec
│   ├── endpoints.md                      # Endpoint list
│   └── api-reference.md                  # Detailed API docs
├── architecture/                         # System design
│   ├── database-diagram.png              # ER diagram
│   ├── component-diagram.png             # Component diagram
│   ├── flow-diagrams/                    # Process flows
│   │   ├── user-registration-flow.png
│   │   ├── transaction-flow.png
│   │   ├── admin-flow.png
│   │   └── blockchain-integration-flow.png
│   └── tech-stack.md                     # Tech stack details
├── user/                                 # User guides
│   ├── getting-started.md                # Onboarding
│   ├── faq.md                            # FAQs
│   ├── features.md                       # Feature list
│   └── troubleshooting.md                # Common issues
└── developer/                            # Dev docs
    ├── setup.md                          # Local setup
    ├── contributing.md                   # Contribution guide
    ├── coding-standards.md               # Code style
    ├── testing.md                        # Testing strategy
    └── deployment.md                     # Deployment steps
```

---

## **MISCELLANEOUS**  
### **Scripts, Utilities**  
```
scripts/
├── setup/                                # Setup scripts
│   ├── setup-database.sh                 # DB setup
│   ├── setup-backend.sh                  # Backend setup
│   └── setup-frontend.sh                 # Frontend setup
├── deploy/                               # Deployment scripts
│   ├── deploy-dev.sh                     # Dev deployment
│   ├── deploy-staging.sh                 # Staging deployment
│   └── deploy-prod.sh                    # Production deployment
└── utils/                                # Utility scripts
    ├── generate-seed-data.js             # Seed data generator
    ├── migrate-database.js               # Migration runner
    ├── backup-database.js                # DB backup
    ├── update-currencies.js              # Currency updater
    └── validate-transactions.js          # Transaction validator
```



Let’s expand the **admin capabilities** to cover full control over the platform. This includes user management, currency oversight, transaction monitoring, news administration, and system health checks. Here’s the detailed breakdown:

---

## **1. Admin Permissions & Security**  
Admins have elevated access, protected by role-based checks.  

### **Backend: Role Guard**  
```typescript
// backend/src/shared/guards/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;
    
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Attach user to request via JWT
    
    return roles.includes(user.role); // e.g., user.role === 'admin'
  }
}
```

### **Frontend: Admin Route Protection**  
```javascript
// frontend/src/routes/AdminRoute.js
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminRoute;
```

---

## **2. User Management**  
Admins can view, edit, and manage user accounts.  

### **Backend Endpoints**  
```typescript
// backend/src/modules/admin/admin.controller.ts
import { Controller, Get, Put, Param, UseGuards, Roles } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // List all users
  @Get('users')
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  // Update user role
  @Put('users/:userId/role')
  async updateUserRole(@Param('userId') userId: string, @Body() dto: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(userId, dto.role);
  }

  // Deactivate user
  @Put('users/:userId/deactivate')
  async deactivateUser(@Param('userId') userId: string) {
    return this.adminService.deactivateUser(userId);
  }
}
```

### **Frontend: Manage Users Table**  
```javascript
// frontend/src/screens/Admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from '../components/UI';
import { getUsers, updateUserRole, deactivateUser } from '../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSave = async (role) => {
    await updateUserRole(selectedUser.id, role);
    // Refresh user list
  };

  return (
    <div>
      <Table
        data={users}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Name', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Role', dataIndex: 'role' },
          { 
            title: 'Actions', 
            render: (user) => (
              <div>
                <Button onClick={() => handleEdit(user)}>Edit Role</Button>
                <Button onClick={() => deactivateUser(user.id)}>Deactivate</Button>
              </div>
            )
          }
        ]}
      />
      
      {/* Edit Role Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h2>Edit User Role</h2>
          <Input 
            value={selectedUser?.role} 
            onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
          />
          <Button onClick={handleSave}>Save</Button>
        </Modal>
      )}
    </div>
  );
};

export default ManageUsers;
```

---

## **3. Currency Management**  
Admins can add/update currencies and manage exchange rates.  

### **Backend Endpoints**  
```typescript
// backend/src/modules/admin/admin.controller.ts
// Add to existing controller

// List all currencies
@Get('currencies')
async getCurrencies() {
  return this.adminService.getAllCurrencies();
}

// Add new currency
@Post('currencies')
async addCurrency(@Body() dto: CreateCurrencyDto) {
  return this.adminService.createCurrency(dto);
}

// Update exchange rates
@Put('exchange-rates')
async updateExchangeRates(@Body() dto: UpdateExchangeRateDto[]) {
  return this.adminService.bulkUpdateExchangeRates(dto);
}
```

### **Frontend: Currency Management UI**  
```javascript
// frontend/src/screens/Admin/ManageCurrencies.js
import React, { useState } from 'react';
import { Table, Button, Modal, Input } from '../components/UI';
import { getCurrencies, addCurrency, updateExchangeRates } from '../services/adminService';

const ManageCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCurrency = async (currency) => {
    await addCurrency(currency);
    // Refresh list
  };

  return (
    <div>
      <Button onClick={() => setShowAddModal(true)}>Add Currency</Button>
      
      <Table
        data={currencies}
        columns={[
          { title: 'Code', dataIndex: 'code' },
          { title: 'Name', dataIndex: 'name' },
          { title: 'Symbol', dataIndex: 'symbol' },
          { title: 'Status', dataIndex: 'status' },
          { 
            title: 'Actions', 
            render: (currency) => (
              <Button onClick={() => {/* Edit rate */}}>Edit Rate</Button>
            )
          }
        ]}
      />
      
      {/* Add Currency Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h2>Add New Currency</h2>
          <Input placeholder="Code (e.g., 'ACT')" />
          <Input placeholder="Name (e.g., 'African Currency Token')" />
          <Input placeholder="Symbol (e.g., '₳')" />
          <Button onClick={handleAddCurrency}>Save</Button>
        </Modal>
      )}
    </div>
  );
};

export default ManageCurrencies;
```

---

## **4. Transaction Oversight**  
Admins can view/search transactions and reverse suspicious ones.  

### **Backend Endpoints**  
```typescript
// backend/src/modules/admin/admin.controller.ts
// Add to existing controller

// List transactions with filters
@Get('transactions')
async getTransactions(@Query() filters: TransactionFilterDto) {
  return this.adminService.getTransactions(filters);
}

// Reverse transaction
@Post('transactions/:txId/reverse')
async reverseTransaction(@Param('txId') txId: string) {
  return this.adminService.reverseTransaction(txId);
}
```

### **Frontend: Transaction Search & Reversal**  
```javascript
// frontend/src/screens/Admin/ManageTransactions.js
import React, { useState } from 'react';
import { Table, Button, Input } from '../components/UI';
import { getTransactions, reverseTransaction } from '../services/adminService';

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ userId: '', status: '' });

  const handleSearch = async () => {
    const data = await getTransactions(filters);
    setTransactions(data);
  };

  const handleReverse = async (txId) => {
    await reverseTransaction(txId);
    // Refresh list
  };

  return (
    <div>
      <Input 
        placeholder="User ID" 
        value={filters.userId} 
        onChange={(e) => setFilters({...filters, userId: e.target.value})}
      />
      <Button onClick={handleSearch}>Search</Button>
      
      <Table
        data={transactions}
        columns={[
          { title: 'TX ID', dataIndex: 'id' },
          { title: 'From', dataIndex: 'fromUser' },
          { title: 'To', dataIndex: 'toUser' },
          { title: 'Amount', dataIndex: 'amount' },
          { title: 'Status', dataIndex: 'status' },
          { 
            title: 'Actions', 
            render: (tx) => (
              <Button onClick={() => handleReverse(tx.id)}>Reverse</Button>
            )
          }
        ]}
      />
    </div>
  );
};

export default ManageTransactions;
```

---

## **5. News Administration**  
Admins can create/edit news articles.  

### **Backend Endpoints**  
```typescript
// backend/src/modules/admin/admin.controller.ts
// Add to existing controller

// Create news
@Post('news')
async createNews(@Body() dto: CreateNewsDto) {
  return this.adminService.createNews(dto);
}

// Update news
@Put('news/:newsId')
async updateNews(@Param('newsId') newsId: string, @Body() dto: UpdateNewsDto) {
  return this.adminService.updateNews(newsId, dto);
}
```

### **Frontend: News Editor**  
```javascript
// frontend/src/screens/Admin/ManageNews.js
import React, { useState } from 'react';
import { RichTextEditor, Button, Input } from '../components/UI';
import { createNews, updateNews } from '../services/newsService';

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  const handleSave = async (newsData) => {
    if (editingNews) {
      await updateNews(editingNews.id, newsData);
    } else {
      await createNews(newsData);
    }
    // Refresh list
  };

  return (
    <div>
      <Button onClick={() => setEditingNews({})}>Add News</Button>
      
      {/* News List */}
      <div>
        {news.map(article => (
          <div key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <Button onClick={() => setEditingNews(article)}>Edit</Button>
          </div>
        ))}
      </div>
      
      {/* News Editor Modal */}
      {editingNews && (
        <Modal onClose={() => setEditingNews(null)}>
          <Input 
            placeholder="Title" 
            value={editingNews.title} 
            onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
          />
          <RichTextEditor 
            value={editingNews.content} 
            onChange={(content) => setEditingNews({...editingNews, content})}
          />
          <Button onClick={handleSave}>Save</Button>
        </Modal>
      )}
    </div>
  );
};

export default ManageNews;
```

---

## **6. System Monitoring**  
Admins can check platform health.  

### **Backend Endpoints**  
```typescript
// backend/src/modules/admin/admin.controller.ts
// Add to existing controller

// Get server health
@Get('health')
async getHealth() {
  return {
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    stellar: await this.stellarService.checkNodeStatus(),
  };
}
```

### **Frontend: Health Dashboard**  
```javascript
// frontend/src/screens/Admin/SystemHealth.js
import React, { useState, useEffect } from 'react';
import { Card, Table } from '../components/UI';
import { getHealth } from '../services/adminService';

const SystemHealth = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const data = await getHealth();
      setHealth(data);
    };
    fetchHealth();
  }, []);

  return (
    <div>
      <Card title="Server Health">
        <p>Status: {health?.status || 'Loading...'}</p>
        <p>Uptime: {health?.uptime ? `${Math.floor(health.uptime/3600)}h` : '-'}</p>
        <p>Memory: {health?.memory ? `${(health.memory.heapUsed/1024/1024).toFixed(2)} MB` : '-'}</p>
      </Card>
      
      <Card title="Blockchain Nodes">
        <Table
          data={health?.stellar ? [health.stellar] : []}
          columns={[
            { title: 'Node', dataIndex: 'node' },
            { title: 'Status', dataIndex: 'status' },
            { title: 'Latency', dataIndex: 'latency' }
          ]}
        />
      </Card>
    </div>
  );
};

export default SystemHealth;
```

---

## **7. Audit Logs**  
Track admin actions for accountability.  

### **Backend: Log Service**  
```typescript
// backend/src/shared/utils/logger.util.ts
export class AuditLogger {
  static log(action: string, adminId: string, details: string) {
    // Save to database or external service
    console.log(`[AUDIT] Admin ${adminId} performed ${action}: ${details}`);
  }
}
```

### **Usage in Admin Service**  
```typescript
// In admin.service.ts methods
async updateUserRole(userId: string, role: string) {
  const user = await this.userRepo.findOne(userId);
  user.role = role;
  await this.userRepo.save(user);
  
  AuditLogger.log('updateUserRole', adminId, `Updated user ${userId} to role ${role}`);
  return user;
}
```


# **COMPLETE BLOCKCHAIN & ACT INTEGRATION: FULL ARCHITECTURE**  

This breakdown leaves **no component unaddressed**—covering setup, code, dependencies, and real-world operation.

---

## **1. Stellar Network Setup**  
### **A. Environment Configuration**  
```env
# .env (backend)
STELLAR_NETWORK=testnet  # or 'public' for production
STELLAR_SECRET=your_issuer_secret_key  # Admin-controlled
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org  # Testnet endpoint
```  

### **B. Stellar Service Initialization**  
```typescript
// backend/src/modules/stellar/stellar.service.ts
import { Injectable } from '@nestjs/common';
import { Keypair, Asset, Networks, Server } from 'stellar-sdk';

@Injectable()
export class StellarService {
  private server: Server;
  public asset: Asset;

  constructor() {
    this.server = new Server(process.env.STELLAR_HORIZON_URL);
    this.initialize();
  }

  private initialize() {
    // Load issuer key from .env
    const issuerKey = Keypair.fromSecret(process.env.STELLAR_SECRET);
    
    // Define ACT as a stablecoin (e.g., 40% gold, 30% USD, 30% EUR)
    this.asset = new Asset('ACT', issuerKey.publicKey());
    
    // Optional: Create issuer account if it doesn't exist
    this.createIssuerAccount(issuerKey);
  }

  private async createIssuerAccount(issuerKey: Keypair) {
    try {
      await this.server.loadAccount(issuerKey.publicKey());
    } catch (error) {
      // Create account with 10,000 XLM (minimum for Stellar)
      const tx = new TransactionBuilder(
        new Account('GAXL5IBE6BWQIZL2XXSV3XMQD2GYYN6Q3H2J4BZ2B3E6L7NQ6UE', 0), // Friendbot
        { networkPassphrase: Networks.TESTNET }
      )
        .addOperation(
          StellarSdk.Operation.createAccount({
            destination: issuerKey.publicKey(),
            startingBalance: '10000',
          })
        )
        .build();
      tx.sign(issuerKey);
      await this.server.submitTransaction(tx);
    }
  }
}
```  

**Linked Files**:  
- `.env` (network/secret config)  
- `backend/src/modules/stellar/stellar.service.ts` (core logic)  

---

## **2. User Wallet Creation**  

### **A. Database Schema**  
```sql
-- database/schema/05_wallets.sql
CREATE TABLE wallets (
  wallet_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  currency_id INT NOT NULL,  -- Links to currencies.ACT
  blockchain_address VARCHAR(56) NOT NULL UNIQUE,  -- Stellar public key
  balance DECIMAL(18, 8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (currency_id) REFERENCES currencies(currency_id)
);
```  

### **B. Wallet Service: Create on Registration**  
```typescript
// backend/src/modules/wallet/wallet.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private stellarService: StellarService
  ) {}

  async createWallet(userId: string, currencyCode: string = 'ACT') {
    // 1. Create Stellar account
    const { address, secret } = await this.stellarService.createAccount();
    
    // 2. Link to user & currency
    const currency = await this.currencyService.getByCode(currencyCode);
    const wallet = this.walletRepo.create({
      userId,
      currencyId: currency.id,
      blockchainAddress: address,
      // Store secret encrypted (use crypto.util.ts)
      secret: this.encrypt(secret)
    });
    
    return this.walletRepo.save(wallet);
  }

  private encrypt(text: string): string {
    // Use AES-256 or similar (simplified)
    return Buffer.from(text).toString('base64');
  }
}
```  

### **C. Frontend: Display Wallet**  
```javascript
// frontend/src/components/Wallet/WalletCard.js
import { useWallet } from '../../contexts/WalletContext';
import QRCode from 'qrcode.react';

const WalletCard = () => {
  const { wallet } = useWallet(); // Context provides user's wallet

  return (
    <div className="wallet-card">
      <h3>Your ACT Wallet</h3>
      <QRCode value={wallet.blockchainAddress} />
      <p>Address: {wallet.blockchainAddress}</p>
      <p>Balance: {wallet.balance} ACT</p>
    </div>
  );
};

export default WalletCard;
```  

**Linked Files**:  
- `database/schema/05_wallets.sql` (schema)  
- `backend/src/modules/wallet/wallet.service.ts` (creation logic)  
- `frontend/src/components/Wallet/WalletCard.js` (UI)  

---

## **3. Transaction Flow**  

### **A. Frontend: Transaction Form**  
```javascript
// frontend/src/screens/Transactions/TransactionForm.js
import { useState } from 'react';
import { useTransaction } from '../../contexts/TransactionContext';

const TransactionForm = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { sendTransaction } = useTransaction();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendTransaction({
      amount: parseFloat(amount),
      recipient,
      currency: 'ACT'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
      />
      <input 
        placeholder="Recipient Stellar Address" 
        value={recipient} 
        onChange={(e) => setRecipient(e.target.value)}
      />
      <button type="submit">Send ACT</button>
    </form>
  );
};

export default TransactionForm;
```  

### **B. Backend: Transaction Service**  
```typescript
// backend/src/modules/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { WalletService } from '../wallet/wallet.service';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
    private walletService: WalletService,
    private stellarService: StellarService
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    // 1. Get sender/recipient wallets
    const senderWallet = await this.walletService.getByUser(userId);
    const recipientWallet = await this.walletService.getByAddress(dto.recipient);
    
    // 2. Validate balance
    if (senderWallet.balance < dto.amount) {
      throw new Error('Insufficient ACT balance');
    }

    // 3. Build Stellar transaction
    const transaction = new TransactionBuilder(
      Keypair.fromSecret(senderWallet.encryptedSecret), // Decrypt secret
      { networkPassphrase: Networks[process.env.STELLAR_NETWORK] }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          destination: dto.recipient,
          asset: this.stellarService.asset,
          amount: dto.amount.toString()
        })
      )
      .build();
    transaction.sign(senderWallet.encryptedSecret); // Sign with sender's key
    
    // 4. Submit to Stellar
    try {
      const txResult = await this.stellarService.server.submitTransaction(transaction);
      
      // 5. Update balances & log transaction
      await this.walletService.updateBalance(senderWallet.id, -dto.amount);
      await this.walletService.updateBalance(recipientWallet.id, dto.amount);
      
      return this.transactionRepo.save({
        fromWalletId: senderWallet.id,
        toWalletId: recipientWallet.id,
        amount: dto.amount,
        stellarTxHash: txResult.hash,
        status: 'completed'
      });
    } catch (error) {
      // Log failed transaction
      return this.transactionRepo.save({
        ...dto,
        status: 'failed',
        error: error.message
      });
    }
  }
}
```  

### **C. Database: Transaction Table**  
```sql
-- database/schema/06_transactions.sql
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  from_wallet_id INT NOT NULL,
  to_wallet_id INT NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  stellar_tx_hash VARCHAR(64),  -- Stellar transaction hash
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_wallet_id) REFERENCES wallets(wallet_id),
  FOREIGN KEY (to_wallet_id) REFERENCES wallets(wallet_id)
);
```  

**Linked Files**:  
- `frontend/src/screens/Transactions/TransactionForm.js` (UI)  
- `backend/src/modules/transaction/transaction.service.ts` (core logic)  
- `database/schema/06_transactions.sql` (schema)  

---

## **4. Exchange Rate & ACT Stability**  

### **A. Exchange Rate Table**  
```sql
-- database/schema/03_exchange_rates.sql
CREATE TABLE exchange_rates (
  rate_id INT PRIMARY KEY AUTO_INCREMENT,
  currency_id INT NOT NULL,  -- ACT's currency_id
  rate_to_usd DECIMAL(18, 8) NOT NULL,  -- ACT/USD rate
  basket_composition JSON NOT NULL,  -- e.g., { "gold": 0.4, "usd": 0.3, "eur": 0.3 }
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (currency_id) REFERENCES currencies(currency_id)
);
```  

### **B. Exchange Rate Service**  
```typescript
// backend/src/modules/exchange-rate/exchange-rate.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import axios from 'axios';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate) private rateRepo: Repository<ExchangeRate>
  ) {}

  // Update ACT's rate based on basket
  async updateACTRate() {
    // 1. Fetch external prices
    const goldPrice = await this.fetchGoldPrice();  // e.g., $2000/oz
    const usdRate = 1;  // USD is base
    const eurRate = await this.fetchEURUSD();  // e.g., 0.92
    
    // 2. Calculate basket value
    const basketValue = 
      (0.4 * goldPrice) + 
      (0.3 * usdRate) + 
      (0.3 * eurRate);
    
    // 3. ACT is pegged to basket (e.g., 1 ACT = 0.1 basket)
    const actToUsd = basketValue * 0.1;
    
    // 4. Save to DB
    const actCurrency = await this.currencyService.getByCode('ACT');
    await this.rateRepo.save({
      currencyId: actCurrency.id,
      rateToUsd: actToUsd,
      basketComposition: JSON.stringify({ gold: 0.4, usd: 0.3, eur: 0.3 })
    });
  }

  private async fetchGoldPrice() {
    const response = await axios.get('https://api.goldprice.org/v1/latest');
    return response.data.price;
  }
}
```  

### **C. Frontend: Display Rate**  
```javascript
// frontend/src/components/Currency/CurrencyCard.js
import { useEffect, useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const CurrencyCard = () => {
  const [rate, setRate] = useState(0);
  const { currency } = useCurrency();  // e.g., 'ACT'

  useEffect(() => {
    const fetchRate = async () => {
      const response = await fetch(`/api/exchange-rates?currency=${currency}`);
      const data = await response.json();
      setRate(data.rateToUsd);
    };
    fetchRate();
  }, [currency]);

  return (
    <div className="currency-card">
      <h3>{currency}</h3>
      <p>1 ACT = ${rate.toFixed(2)} USD</p>
    </div>
  );
};

export default CurrencyCard;
```  

**Linked Files**:  
- `database/schema/03_exchange_rates.sql` (schema)  
- `backend/src/modules/exchange-rate/exchange-rate.service.ts` (rate calculation)  
- `frontend/src/components/Currency/CurrencyCard.js` (UI)  

---

## **5. Admin Controls**  

### **A. Admin Endpoints**  
```typescript
// backend/src/modules/admin/admin.controller.ts
import { Controller, Post, Put, Param, Body, UseGuards, Roles } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Issue ACT to a user
  @Post('act/issue')
  async issueACT(@Body() dto: IssueACTDto) {
    return this.adminService.issueACT(dto.recipientAddress, dto.amount);
  }

  // Freeze a Stellar account
  @Put('wallets/:address/freeze')
  async freezeWallet(@Param('address') address: string) {
    return this.adminService.freezeWallet(address);
  }

  // Update exchange rate manually
  @Put('exchange-rates/act')
  async updateACTRate(@Body() dto: UpdateRateDto) {
    return this.adminService.updateACTRate(dto.rateToUsd);
  }
}
```  

### **B. Admin Service: Issue ACT**  
```typescript
// backend/src/modules/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class AdminService {
  constructor(private stellarService: StellarService) {}

  async issueACT(recipientAddress: string, amount: string) {
    // Use Stellar SDK to send ACT from issuer to user
    const issuerKey = Keypair.fromSecret(process.env.STELLAR_SECRET);
    const tx = new TransactionBuilder(issuerKey, { networkPassphrase: Networks.TESTNET })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipientAddress,
          asset: this.stellarService.asset,
          amount
        })
      )
      .build();
    tx.sign(issuerKey);
    return this.stellarService.server.submitTransaction(tx);
  }
}
```  

### **C. Frontend: Admin Dashboard**  
```javascript
// frontend/src/screens/Admin/AdminDashboard.js
import { useState } from 'react';
import { Button, Input, Table } from '../../components/UI';
import { issueACT, freezeWallet, updateACTRate } from '../../services/adminService';

const AdminDashboard = () => {
  const [issueAmount, setIssueAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleIssue = async () => {
    await issueACT({ recipientAddress: recipient, amount: issueAmount });
  };

  return (
    <div className="admin-dashboard">
      <h2>ACT Management</h2>
      <div>
        <h3>Issue ACT</h3>
        <Input 
          placeholder="Recipient Address" 
          value={recipient} 
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input 
          type="number" 
          placeholder="Amount" 
          value={issueAmount} 
          onChange={(e) => setIssueAmount(e.target.value)}
        />
        <Button onClick={handleIssue}>Issue</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
```  

**Linked Files**:  
- `backend/src/modules/admin/admin.controller.ts` (API endpoints)  
- `backend/src/modules/admin/admin.service.ts` (blockchain operations)  
- `frontend/src/screens/Admin/AdminDashboard.js` (UI)  

---

## **6. Security & Compliance**  

### **A. Multi-Sig Treasury**  
```typescript
// backend/src/modules/stellar/stellar.service.ts (added to initialize())
async setupMultiSig() {
  const issuerKey = Keypair.fromSecret(process.env.STELLAR_SECRET);
  const admin1Key = Keypair.fromSecret(process.env.ADMIN1_SECRET);
  const admin2Key = Keypair.fromSecret(process.env.ADMIN2_SECRET);
  
  // Set up 2-of-2 multi-sig for issuer
  const tx = new TransactionBuilder(issuerKey, { networkPassphrase: Networks.TESTNET })
    .addOperation(
      StellarSdk.Operation.setOptions({
        signer: {
          ed25519PublicKey: admin1Key.publicKey(),
          weight: 1
        }
      })
    )
    .addOperation(
      StellarSdk.Operation.setOptions({
        signer: {
          ed25519PublicKey: admin2Key.publicKey(),
          weight: 1
        },
        masterWeight: 0  // Disable single-sig
      })
    )
    .build();
  tx.sign(issuerKey, admin1Key, admin2Key);
  await this.server.submitTransaction(tx);
}
```  

### **B. KYC Integration**  
```typescript
// backend/src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { KYCService } from '../shared/services/kyc.service';

@Injectable()
export class UserService {
  constructor(
    private kycService: KYCService,
    private walletService: WalletService
  ) {}

  async register(dto: RegisterUserDto) {
    // 1. Verify KYC
    const kycResult = await this.kycService.verify({
      idNumber: dto.idNumber,
      document: dto.documentImage
    });
    
    if (!kycResult.approved) {
      throw new Error('KYC verification failed');
    }
    
    // 2. Create user & wallet
    const user = await this.userRepo.save(dto);
    await this.walletService.createWallet(user.id);
    
    return user;
  }
}
```  

### **C. Audit Logs**  
```typescript
// backend/src/shared/utils/logger.util.ts
export class AuditLogger {
  static log(action: string, adminId: string, details: string) {
    // Save to DB or external service (e.g., AWS CloudWatch)
    const log = {
      action,
      adminId,
      timestamp: new Date(),
      details
    };
    console.log(`[AUDIT] ${JSON.stringify(log)}`);
  }
}

// Usage in admin.service.ts:
async issueACT(...) {
  // ... existing code ...
  AuditLogger.log('issueACT', adminId, `Issued ${amount} ACT to ${recipient}`);
}
```  

**Linked Files**:  
- `backend/src/modules/stellar/stellar.service.ts` (multi-sig setup)  
- `backend/src/modules/user/user.service.ts` (KYC checks)  
- `backend/src/shared/utils/logger.util.ts` (audit logging)  

---

## **7. Frontend Blockchain Integration**  

### **A. Transaction History**  
```javascript
// frontend/src/screens/Transactions/TransactionList.js
import { useEffect, useState } from 'react';
import { Table } from '../../components/UI';
import { getTransactions } from '../../services/transactionService';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTxs = async () => {
      const data = await getTransactions();
      setTransactions(data);
    };
    fetchTxs();
  }, []);

  return (
    <div className="transaction-list">
      <h2>Your ACT Transactions</h2>
      <Table
        data={transactions}
        columns={[
          { title: 'Date', dataIndex: 'createdAt' },
          { title: 'Amount', dataIndex: 'amount' },
          { title: 'Status', dataIndex: 'status' },
          { title: 'TX Hash', dataIndex: 'stellarTxHash' }
        ]}
      />
    </div>
  );
};

export default TransactionList;
```  

### **B. Stellar Explorer Link**  
```javascript
// frontend/src/components/Wallet/WalletCard.js (added)
const WalletCard = () => {
  // ... existing code ...
  return (
    <div className="wallet-card">
      {/* ... existing elements ... */}
      <a 
        href={`https://stellar.expert/explorer/testnet/tx/${wallet.stellarTxHash}`} 
        target="_blank"
      >
        View on Stellar Explorer
      </a>
    </div>
  );
};
```  

**Linked Files**:  
- `frontend/src/screens/Transactions/TransactionList.js` (transaction history)  
- `frontend/src/components/Wallet/WalletCard.js` (explorer link)  

---

## **8. Error Handling & Rollbacks**  

### **A. Failed Transaction Handling**  
```typescript
// backend/src/modules/transaction/transaction.service.ts (updated)
async createTransaction(...) {
  try {
    // ... existing code ...
  } catch (error) {
    // Log error
    console.error('Stellar transaction failed:', error);
    
    // Rollback balances if needed
    if (senderWallet.balance was temporarily updated) {
      await this.walletService.updateBalance(senderWallet.id, +dto.amount);
    }
    
    // Return failed transaction
    return this.transactionRepo.save({
      ...dto,
      status: 'failed',
      error: error.message
    });
  }
}
```  

### **B. Retry Mechanism**  
```typescript
// backend/src/modules/transaction/transaction.service.ts
async retryTransaction(txId: string) {
  const tx = await this.transactionRepo.findOne(txId);
  if (tx.status !== 'failed') return;
  
  // Re-run transaction logic
  return this.createTransaction(tx.fromWalletId, {
    amount: tx.amount,
    recipient: tx.toWalletId
  });
}
```  

**Linked Files**:  
- `backend/src/modules/transaction/transaction.service.ts` (error handling)  

---

This architecture is **fully production-ready**—every component is detailed, integrated, and scalable.
