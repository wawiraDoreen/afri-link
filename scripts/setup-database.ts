import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration(filename: string) {
  console.log(`Running migration: ${filename}`)

  const sql = readFileSync(join(__dirname, filename), 'utf-8')

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single()

  if (error) {
    console.error(`Error in ${filename}:`, error)
    return false
  }

  console.log(`✓ ${filename} completed`)
  return true
}

async function setupDatabase() {
  console.log('Starting database setup...\n')

  const migrations = [
    '001_create_users_and_profiles.sql',
    '002_create_wallets.sql',
    '003_create_currencies.sql',
    '004_create_transactions.sql',
    '005_create_kyc_documents.sql',
    '006_create_system_settings.sql',
    '007_seed_currencies.sql',
  ]

  for (const migration of migrations) {
    const success = await runMigration(migration)
    if (!success) {
      console.error('\nDatabase setup failed!')
      process.exit(1)
    }
  }

  console.log('\n✓ Database setup completed successfully!')
}

setupDatabase()
