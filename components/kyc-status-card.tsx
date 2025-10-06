"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"

interface KYCStatusCardProps {
  status: "not_started" | "pending" | "approved" | "rejected"
  verifiedAt?: string | null
}

export function KYCStatusCard({ status, verifiedAt }: KYCStatusCardProps) {
  const statusConfig = {
    not_started: {
      icon: AlertCircle,
      label: "Not Started",
      description: "Please upload your KYC documents to get verified",
      variant: "secondary" as const,
      color: "text-muted-foreground",
    },
    pending: {
      icon: Clock,
      label: "Pending Review",
      description: "Your documents are being reviewed by our team",
      variant: "default" as const,
      color: "text-yellow-600",
    },
    approved: {
      icon: CheckCircle2,
      label: "Verified",
      description: verifiedAt ? `Verified on ${new Date(verifiedAt).toLocaleDateString()}` : "Your account is verified",
      variant: "default" as const,
      color: "text-green-600",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      description: "Please upload new documents or contact support",
      variant: "destructive" as const,
      color: "text-red-600",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            KYC Verification Status
          </span>
          <Badge variant={config.variant}>{config.label}</Badge>
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
