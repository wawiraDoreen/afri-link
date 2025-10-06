import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initDatabase() {
  console.log('🚀 Initializing database...\n')

  const sqlPath = join(__dirname, 'init_database.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  console.log(`✅ SQL file loaded: ${sql.length} characters\n`)
  console.log(`📋 Please run this SQL in your Supabase SQL Editor:\n`)
  console.log('   1. Go to: https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/sql/new')
  console.log(`   2. Copy the contents of: scripts/init_database.sql`)
  console.log('   3. Paste into the SQL Editor')
  console.log('   4. Click "Run"\n')

  console.log(`💡 Or copy this command to create tables individually:\n`)

  const { data: tables, error: tablesError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)

  if (tablesError && tablesError.code === 'PGRST204') {
    console.log('⚠️  Tables not found. Database needs initialization.')
  } else if (!tablesError) {
    console.log('✅ Database tables already exist!')
  } else {
    console.log(`ℹ️  Database status: ${tablesError.message}`)
  }
}

initDatabase().catch(console.error)
