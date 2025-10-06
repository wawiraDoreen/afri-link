import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey)

    const migrations = [
      '001_create_users_and_profiles.sql',
      '002_create_wallets.sql',
      '003_create_currencies.sql',
      '004_create_transactions.sql',
      '005_create_kyc_documents.sql',
      '006_create_system_settings.sql',
      '007_seed_currencies.sql',
    ]

    const results = []

    for (const migration of migrations) {
      const sqlPath = join(process.cwd(), 'scripts', migration)
      const sql = readFileSync(sqlPath, 'utf-8')

      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        const { error } = await supabase.rpc('exec', { sql: statement })

        if (error) {
          console.error(`Error in ${migration}:`, error)
          results.push({ migration, status: 'error', error: error.message })
        } else {
          results.push({ migration, status: 'success' })
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
