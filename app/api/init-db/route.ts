import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST() {
  try {
    const sqlPath = join(process.cwd(), 'scripts', 'init_database.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        {
          success: false,
          error: `Database initialization failed. Please run the SQL manually:

1. Go to: https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/sql/new
2. Copy the contents of scripts/init_database.sql
3. Paste and run

Error: ${error}`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      successCount: 1,
      errorCount: 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: `Setup failed. Please initialize your database manually:

1. Go to: https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/sql/new
2. Copy the contents of scripts/init_database.sql from your project
3. Paste the SQL into the editor
4. Click "Run"

This will create all necessary tables, policies, and seed data.

Technical error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to initialize the database',
    sql_file: 'scripts/init_database.sql',
    manual_setup: 'https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/sql/new',
  })
}
