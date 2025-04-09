"use client"

import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { type ScanResult, VulnerabilityType } from "@/lib/types"
import { AlertTriangle, Info } from "lucide-react"

interface ScanResultsProps {
  results: ScanResult[]
}

export function ScanResults({ results }: ScanResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Info className="mx-auto h-12 w-12 mb-4" />
        <p>No scan results yet. Configure and run a scan to see results here.</p>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-orange-500 hover:bg-orange-600"
      case "low":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "info":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getVulnerabilityTypeLabel = (type: VulnerabilityType) => {
    switch (type) {
      case VulnerabilityType.PROTOTYPE_POLLUTION:
        return "Prototype Pollution"
      case VulnerabilityType.DOM_XSS:
        return "DOM XSS"
      case VulnerabilityType.DOM_CLOBBERING:
        return "DOM Clobbering"
      default:
        return "Other"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Found {results.length} issue(s)</h3>
        <Badge variant="outline" className="ml-2">
          {results.filter((r) => r.severity === "high").length} High
        </Badge>
        <Badge variant="outline" className="ml-2">
          {results.filter((r) => r.severity === "medium").length} Medium
        </Badge>
        <Badge variant="outline" className="ml-2">
          {results.filter((r) => r.severity === "low").length} Low
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {results.map((result, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center w-full">
                {result.severity === "high" ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                ) : result.severity === "medium" ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                )}
                <span className="text-left font-medium">{result.title}</span>
                <Badge className={`ml-auto ${getSeverityColor(result.severity)} text-white`}>
                  {result.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {getVulnerabilityTypeLabel(result.type)}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>

                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{result.location}</p>
                </div>

                {result.payload && (
                  <div>
                    <h4 className="font-medium">Payload</h4>
                    <pre className="text-sm font-mono bg-muted p-2 rounded overflow-x-auto">{result.payload}</pre>
                  </div>
                )}

                <div>
                  <h4 className="font-medium">Remediation</h4>
                  <p className="text-sm text-muted-foreground">{result.remediation}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
