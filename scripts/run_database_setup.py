import os
import subprocess

# List of SQL scripts to run in order
sql_scripts = [
    "scripts/001_create_users_and_profiles.sql",
    "scripts/002_create_wallets.sql",
    "scripts/003_create_currencies.sql",
    "scripts/004_create_transactions.sql",
    "scripts/005_create_kyc_documents.sql",
    "scripts/006_create_system_settings.sql",
    "scripts/007_seed_currencies.sql",
]

# Get database URL from environment
database_url = os.environ.get("POSTGRES_URL")

if not database_url:
    print("Error: POSTGRES_URL environment variable not set")
    exit(1)

print("Starting database setup for AfriLink platform...")
print("=" * 60)

for script in sql_scripts:
    print(f"\nExecuting: {script}")
    try:
        with open(script, 'r') as f:
            sql_content = f.read()
        
        # Use psql to execute the SQL
        result = subprocess.run(
            ['psql', database_url, '-c', sql_content],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"✓ Successfully executed {script}")
        else:
            print(f"✗ Error executing {script}")
            print(f"Error: {result.stderr}")
            exit(1)
            
    except FileNotFoundError:
        print(f"✗ Script file not found: {script}")
        exit(1)
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")
        exit(1)

print("\n" + "=" * 60)
print("✓ Database setup completed successfully!")
print("\nCreated tables:")
print("  - profiles")
print("  - admin_users")
print("  - wallets")
print("  - currencies")
print("  - exchange_rates")
print("  - transactions")
print("  - kyc_documents")
print("  - system_settings")
print("\nSeeded 13 currencies (African + international)")
