"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Play } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ScannerConfigProps {
  onScan: (targetUrl: string, options: any) => Promise<void>
  scanning: boolean
}

export function ScannerConfig({ onScan, scanning }: ScannerConfigProps) {
  const [targetUrl, setTargetUrl] = useState("")
  const [error, setError] = useState("")
  const [options, setOptions] = useState({
    checkPrototypePollution: true,
    checkDomXss: true,
    checkDomClobbering: true,
    crawlPages: true,
    maxDepth: 3,
  })

  const handleOptionChange = (option: string, value: any) => {
    setOptions((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!targetUrl) {
      setError("Please enter a target URL")
      return
    }

    try {
      new URL(targetUrl)
      setError("")
      onScan(targetUrl, options)
    } catch {
      setError("Please enter a valid URL")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="target-url">Target URL</Label>
        <Input
          id="target-url"
          placeholder="https://example.com"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Scan Options</h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="check-prototype-pollution"
            checked={options.checkPrototypePollution}
            onCheckedChange={(checked) => handleOptionChange("checkPrototypePollution", checked === true)}
          />
          <Label htmlFor="check-prototype-pollution">Check for Prototype Pollution</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="check-dom-xss"
            checked={options.checkDomXss}
            onCheckedChange={(checked) => handleOptionChange("checkDomXss", checked === true)}
          />
          <Label htmlFor="check-dom-xss">Check for DOM-based XSS</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="check-dom-clobbering"
            checked={options.checkDomClobbering}
            onCheckedChange={(checked) => handleOptionChange("checkDomClobbering", checked === true)}
          />
          <Label htmlFor="check-dom-clobbering">Check for DOM Clobbering</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="crawl-pages"
            checked={options.crawlPages}
            onCheckedChange={(checked) => handleOptionChange("crawlPages", checked === true)}
          />
          <Label htmlFor="crawl-pages">Crawl Pages</Label>
        </div>

        {options.crawlPages && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="max-depth">Maximum Crawl Depth</Label>
            <Input
              id="max-depth"
              type="number"
              min="1"
              max="10"
              value={options.maxDepth}
              onChange={(e) => handleOptionChange("maxDepth", Number.parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={scanning} className="w-full">
        {scanning ? "Scanning..." : "Start Scan"}
        {!scanning && <Play className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  )
}
