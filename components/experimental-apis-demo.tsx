"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskRoundIcon as Flask, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"

interface APISupport {
  name: string
  supported: boolean
  experimental: boolean
  description: string
  usage?: string
}

export function ExperimentalAPIsDemo() {
  const [apiSupport, setApiSupport] = useState<APISupport[]>([])

  useEffect(() => {
    checkAPISupport()
  }, [])

  const checkAPISupport = () => {
    const apis: APISupport[] = [
      {
        name: "Private State Token API",
        supported: "PrivateStateToken" in window,
        experimental: true,
        description:
          "Enables privacy-preserving authentication tokens that can be used across sites without revealing user identity.",
        usage: "Used for fraud prevention and bot detection while preserving privacy.",
      },
      {
        name: "Interest Group API (FLEDGE)",
        supported: "navigator" in window && "joinAdInterestGroup" in (window.navigator as any),
        experimental: true,
        description:
          "Part of the Privacy Sandbox, allows sites to add users to interest groups for remarketing without third-party cookies.",
        usage: "Enables privacy-preserving remarketing and audience targeting.",
      },
      {
        name: "Shared Storage API",
        supported: "sharedStorage" in window,
        experimental: true,
        description: "Allows sites to store and access data across different origins in a privacy-preserving way.",
        usage: "Cross-site data sharing while maintaining user privacy.",
      },
      {
        name: "Storage Buckets API",
        supported: "navigator" in window && "storageBuckets" in (window.navigator as any),
        experimental: true,
        description: "Provides more control over storage quotas and allows organizing storage into named buckets.",
        usage: "Better storage management and organization for web applications.",
      },
      {
        name: "Topics API",
        supported: "browsingTopics" in document,
        experimental: true,
        description: "Privacy-preserving API that provides interest-based advertising topics without tracking.",
        usage: "Interest-based advertising without cross-site tracking.",
      },
      {
        name: "Attribution Reporting API",
        supported: "HTMLAnchorElement" in window && "attributionSrc" in HTMLAnchorElement.prototype,
        experimental: true,
        description: "Measures ad conversions while preserving user privacy by avoiding cross-site tracking.",
        usage: "Privacy-preserving conversion measurement for advertising.",
      },
    ]

    setApiSupport(apis)
  }

  const testPrivateStateToken = async () => {
    try {
      // This is a placeholder - actual implementation would require server setup
      console.log("Private State Token API test - requires server-side implementation")
      return "API available but requires server configuration"
    } catch (error) {
      return `Error: ${error}`
    }
  }

  const testSharedStorage = async () => {
    try {
      if ("sharedStorage" in window) {
        // Example usage (would require proper permissions and setup)
        console.log("Shared Storage API is available")
        return "API available - requires proper permissions and setup"
      }
      return "API not available"
    } catch (error) {
      return `Error: ${error}`
    }
  }

  const testStorageBuckets = async () => {
    try {
      if ("navigator" in window && "storageBuckets" in (window.navigator as any)) {
        console.log("Storage Buckets API is available")
        return "API available - experimental feature"
      }
      return "API not available"
    } catch (error) {
      return `Error: ${error}`
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These APIs are experimental and may not be available in all browsers. They often require specific browser
          flags or origin trials to be enabled.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="support">API Support</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flask className="w-5 h-5" />
                Experimental API Support Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiSupport.map((api, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{api.name}</h4>
                        {api.experimental && (
                          <Badge variant="secondary" className="text-xs">
                            Experimental
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {api.supported ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">{api.supported ? "Supported" : "Not Supported"}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{api.description}</p>
                    {api.usage && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{api.usage}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Private State Token API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Private State Tokens help combat fraud and distinguish bots from real humans, without passive
                  tracking. They're cryptographic tokens that can be issued by one site and redeemed on another.
                </p>
                <Button
                  onClick={testPrivateStateToken}
                  disabled={!apiSupport.find((api) => api.name === "Private State Token API")?.supported}
                >
                  Test Private State Token
                </Button>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This API requires server-side implementation and proper origin trial registration.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shared Storage API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Shared Storage allows you to make informed decisions based on cross-site data, without sharing that
                  data itself. It's designed for use cases like content selection, URL selection, and cross-site reach
                  measurement.
                </p>
                <Button
                  onClick={testSharedStorage}
                  disabled={!apiSupport.find((api) => api.name === "Shared Storage API")?.supported}
                >
                  Test Shared Storage
                </Button>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Requires origin trial enrollment and specific browser configuration.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Storage Buckets API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Storage Buckets provide a way to organize stored data into separate buckets, each with their own quota
                  and eviction policies. This gives developers more control over how their data is stored and managed.
                </p>
                <Button
                  onClick={testStorageBuckets}
                  disabled={!apiSupport.find((api) => api.name === "Storage Buckets API")?.supported}
                >
                  Test Storage Buckets
                </Button>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This API is in early development and requires experimental browser flags.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Sandbox Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-1">Topics API</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides interest-based advertising without cross-site tracking
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-1">FLEDGE (Interest Groups)</h4>
                    <p className="text-sm text-muted-foreground">
                      Enables remarketing and custom audiences without third-party cookies
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-1">Attribution Reporting</h4>
                    <p className="text-sm text-muted-foreground">
                      Measures ad conversions while preserving user privacy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
