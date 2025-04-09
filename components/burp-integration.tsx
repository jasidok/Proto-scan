"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, LinkIcon, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { testBurpConnection } from "@/lib/burp-integration"

export function BurpIntegration() {
  const [burpConfig, setBurpConfig] = useState({
    enabled: false,
    host: "localhost",
    port: "8080",
    apiKey: "",
  })
  const [connectionStatus, setConnectionStatus] = useState<"none" | "success" | "error">("none")
  const [errorMessage, setErrorMessage] = useState("")

  const handleConfigChange = (field: string, value: any) => {
    setBurpConfig((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Reset connection status when config changes
    if (connectionStatus !== "none") {
      setConnectionStatus("none")
    }
  }

  const handleTestConnection = async () => {
    try {
      const success = await testBurpConnection(burpConfig)
      setConnectionStatus(success ? "success" : "error")
      if (!success) {
        setErrorMessage("Failed to connect to BurpSuite Pro. Please check your configuration.")
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="burp-enabled"
          checked={burpConfig.enabled}
          onCheckedChange={(checked) => handleConfigChange("enabled", checked)}
        />
        <Label htmlFor="burp-enabled">Enable BurpSuite Pro Integration</Label>
      </div>

      {burpConfig.enabled && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="burp-host">BurpSuite Host</Label>
                <Input
                  id="burp-host"
                  value={burpConfig.host}
                  onChange={(e) => handleConfigChange("host", e.target.value)}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="burp-port">BurpSuite Port</Label>
                <Input
                  id="burp-port"
                  value={burpConfig.port}
                  onChange={(e) => handleConfigChange("port", e.target.value)}
                  placeholder="8080"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="burp-api-key">BurpSuite API Key</Label>
              <Input
                id="burp-api-key"
                type="password"
                value={burpConfig.apiKey}
                onChange={(e) => handleConfigChange("apiKey", e.target.value)}
                placeholder="Enter your BurpSuite API key"
              />
              <p className="text-xs text-muted-foreground">
                You can find your API key in BurpSuite Pro under User Options &gt; APIs
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleTestConnection}
              className="w-full"
              disabled={!burpConfig.host || !burpConfig.port || !burpConfig.apiKey}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Test Connection
            </Button>

            {connectionStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-600">Successfully connected to BurpSuite Pro</AlertDescription>
              </Alert>
            )}

            {connectionStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {burpConfig.enabled && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Integration Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Send scan results to BurpSuite Pro for further analysis</li>
            <li>Import scan targets from BurpSuite Pro site map</li>
            <li>Use BurpSuite Pro's scanning capabilities alongside custom checks</li>
            <li>Correlate findings with BurpSuite Pro's vulnerability database</li>
          </ul>
        </div>
      )}
    </div>
  )
}
