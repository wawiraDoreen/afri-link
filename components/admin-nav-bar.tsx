"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Wallet,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  FileCheck,
  TrendingUp,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminNavBarProps {
  user: {
    email: string
  }
}

export function AdminNavBar({ user }: AdminNavBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">AfriLink Admin</h1>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/transactions">
              <Button variant="ghost" size="sm">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Transactions
              </Button>
            </Link>
            <Link href="/admin/kyc">
              <Button variant="ghost" size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                KYC
              </Button>
            </Link>
            <Link href="/admin/exchange-rates">
              <Button variant="ghost" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Exchange Rates
              </Button>
            </Link>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin Account</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <Wallet className="mr-2 h-4 w-4" />
                User Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
