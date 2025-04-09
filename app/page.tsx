import { ScannerDashboard } from "@/components/scanner-dashboard"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Web Security Scanner</h1>
      <ScannerDashboard />
    </div>
  )
}
