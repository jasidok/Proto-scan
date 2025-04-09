export enum VulnerabilityType {
  PROTOTYPE_POLLUTION = "prototype_pollution",
  DOM_XSS = "dom_xss",
  DOM_CLOBBERING = "dom_clobbering",
  OTHER = "other",
}

export interface ScanResult {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low" | "info"
  type: VulnerabilityType
  location: string
  payload?: string
  remediation: string
  evidence?: string
  timestamp: number
}

export interface ScanOptions {
  checkPrototypePollution: boolean
  checkDomXss: boolean
  checkDomClobbering: boolean
  crawlPages: boolean
  maxDepth: number
}

export interface BurpConfig {
  enabled: boolean
  host: string
  port: string
  apiKey: string
}
