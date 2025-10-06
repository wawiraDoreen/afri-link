import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, ArrowLeft } from "lucide-react"
import { approveKYC, rejectKYC } from "@/app/actions/admin"
import { AdminNavBar } from "@/components/admin-nav-bar"
import Link from "next/link"

export default async function AdminKYCPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("user_id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  // Get all pending KYC documents
  const { data: documents } = await supabase
    .from("kyc_documents")
    .select(`
      *,
      user_profiles!inner(
        full_name,
        email
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNavBar user={{ email: user.email! }} />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">KYC Document Review</h1>
            <p className="text-muted-foreground">Review and approve pending KYC documents</p>
          </div>
        </div>

        <div className="grid gap-6">
          {documents && documents.length > 0 ? (
            documents.map((doc: any) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {doc.user_profiles.full_name || "Unknown User"}
                      </CardTitle>
                      <CardDescription>{doc.user_profiles.email}</CardDescription>
                    </div>
                    <Badge variant="secondary">{doc.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Document Type</p>
                      <p className="font-medium capitalize">{doc.document_type.replace(/_/g, " ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Document
                      </a>
                    </Button>
                    <form action={approveKYC} className="flex-1">
                      <input type="hidden" name="documentId" value={doc.id} />
                      <input type="hidden" name="userId" value={doc.user_id} />
                      <Button type="submit" className="w-full">
                        Approve
                      </Button>
                    </form>
                    <form action={rejectKYC} className="flex-1">
                      <input type="hidden" name="documentId" value={doc.id} />
                      <input type="hidden" name="userId" value={doc.user_id} />
                      <Button type="submit" variant="destructive" className="w-full">
                        Reject
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending KYC documents</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
