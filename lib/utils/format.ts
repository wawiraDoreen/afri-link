/**
 * Truncate a Stellar public key for display
 */
export function truncatePublicKey(key: string, startChars = 4, endChars = 4): string {
  if (key.length <= startChars + endChars) return key
  return `${key.slice(0, startChars)}...${key.slice(-endChars)}`
}

/**
 * Format ACT amount with proper decimals
 */
export function formatActAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  }).format(amount)
}

/**
 * Format date and time for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

/**
 * Format date only
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
    case "approved":
      return "bg-success/10 text-success border-success/20"
    case "pending":
      return "bg-warning/10 text-warning border-warning/20"
    case "failed":
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}
