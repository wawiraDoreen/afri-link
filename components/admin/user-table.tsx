"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { formatDate, getStatusColor } from "@/lib/utils/format"
import { updateUserKycStatus } from "@/app/actions/admin"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  kyc_status: string
  created_at: string
  wallets?: Array<{ balance: number; stellar_public_key: string }>
}

interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const handleKycUpdate = async (userId: string, status: "approved" | "rejected") => {
    const result = await updateUserKycStatus(userId, status)

    if (result.success) {
      toast.success(`KYC status updated to ${status}`)
    } else {
      toast.error("Failed to update KYC status", {
        description: result.error,
      })
    }
  }

  return (
    <div className="rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>KYC Status</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(user.kyc_status)}>
                  {user.kyc_status}
                </Badge>
              </TableCell>
              <TableCell>{user.wallets?.[0]?.balance.toFixed(2) || "0.00"} ACT</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleKycUpdate(user.id, "approved")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve KYC
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleKycUpdate(user.id, "rejected")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject KYC
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
