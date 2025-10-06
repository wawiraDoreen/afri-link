import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getAllUsers } from "@/app/actions/admin"
import { UserTable } from "@/components/admin/user-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AdminNavBar } from "@/components/admin-nav-bar"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const usersResult = await getAllUsers(100)

  if (!usersResult.success) {
    return <div>Error loading users</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavBar user={{ email: user.email! }} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">Manage users and KYC approvals</p>
          </div>
        </div>

        <UserTable users={usersResult.users} />
      </main>
    </div>
  )
}
