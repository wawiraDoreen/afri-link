import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { KYCStatusCard } from "@/components/kyc-status-card"
import { KYCUploadForm } from "@/components/kyc-upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { getKYCDocuments } from "@/app/actions/kyc"
import NavBar from "@/components/nav-bar"

export default async function KYCPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with KYC status
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  // Get uploaded documents
  const documentsResult = await getKYCDocuments()
  const documents = documentsResult.data || []

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={{ email: user.email!, isAdmin: profile?.role === "admin" }} />

      <main className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">KYC Verification</h1>
            <p className="text-muted-foreground">
              Complete your identity verification to unlock full platform features
            </p>
          </div>

          <KYCStatusCard status={profile?.kyc_status || "not_started"} verifiedAt={profile?.kyc_verified_at} />

          {profile?.kyc_status !== "approved" && <KYCUploadForm />}

          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents
                </CardTitle>
                <CardDescription>Your submitted documents and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{doc.document_type.replace(/_/g, " ")}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          doc.status === "approved"
                            ? "default"
                            : doc.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
