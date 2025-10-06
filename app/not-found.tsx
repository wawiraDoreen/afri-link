import { Button } from "@/components/ui/button"
import { Wallet, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Wallet className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-6 text-6xl font-bold">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-center text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
