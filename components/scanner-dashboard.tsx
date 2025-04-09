"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScannerConfig } from "@/components/scanner-config"
import { ScanResults } from "@/components/scan-results"
import { BurpIntegration } from "@/components/burp-integration"
import { runScan } from "@/lib/scanner"
import type { ScanResult } from "@/lib/types"

export function ScannerDashboard() {
  const [results, setResults] = useState<ScanResult[]>([])
  const [scanning, setScanning] = useState(false)

  const handleScan = async (targetUrl: string, options: any) => {
    setScanning(true)
    try {
      const scanResults = await runScan(targetUrl, options)
      setResults(scanResults)
    } catch (error) {
      console.error("Scan failed:", error)
    } finally {
      setScanning(false)
    }
  }

  return (
    <Tabs defaultValue="scanner" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="scanner">Scanner</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="burp">BurpSuite Integration</TabsTrigger>
      </TabsList>
      <TabsContent value="scanner">
        <Card>
          <CardHeader>
            <CardTitle>Security Scanner Configuration</CardTitle>
            <CardDescription>
              Configure your scan to test for prototype pollution and DOM-based vulnerabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScannerConfig onScan={handleScan} scanning={scanning} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="results">
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>View detected vulnerabilities and security issues</CardDescription>
          </CardHeader>
          <CardContent>
            <ScanResults results={results} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="burp">
        <Card>
          <CardHeader>
            <CardTitle>BurpSuite Pro Integration</CardTitle>
            <CardDescription>Connect to BurpSuite Pro for advanced scanning capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <BurpIntegration />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
