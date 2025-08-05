"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LocalStorageDemo } from "@/components/local-storage-demo"
import { IndexedDBDemo } from "@/components/indexeddb-demo"
import { CookiesDemo } from "@/components/cookies-demo"
import { CacheStorageDemo } from "@/components/cache-storage-demo"
import { ExtensionStorageDemo } from "@/components/extension-storage-demo"
import { ExperimentalAPIsDemo } from "@/components/experimental-apis-demo"
import { Database, HardDrive, Cookie, Archive, Puzzle, FlaskRoundIcon as Flask } from "lucide-react"
import { Toaster } from 'react-hot-toast';

export default function StorageDevToolsApp() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Storage & Dev Tools Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Explore and interact with various browser storage mechanisms and developer tools
          </p>
        </div>

        <Tabs defaultValue="localStorage" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="localStorage" className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              LocalStorage
            </TabsTrigger>
            <TabsTrigger value="indexedDB" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              IndexedDB
            </TabsTrigger>
            <TabsTrigger value="cookies" className="flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              Cookies
            </TabsTrigger>
            <TabsTrigger value="cacheStorage" className="flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Cache Storage
            </TabsTrigger>
            <TabsTrigger value="extension" className="flex items-center gap-2">
              <Puzzle className="w-4 h-4" />
              Extension
            </TabsTrigger>
            <TabsTrigger value="experimental" className="flex items-center gap-2">
              <Flask className="w-4 h-4" />
              Experimental
            </TabsTrigger>
          </TabsList>

          <TabsContent value="localStorage">
            <Card>
              <CardHeader>
                <CardTitle>LocalStorage API</CardTitle>
                <CardDescription>
                  Store data locally in the browser with simple key-value pairs. Data persists until explicitly cleared.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocalStorageDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indexedDB">
            <Card>
              <CardHeader>
                <CardTitle>IndexedDB API</CardTitle>
                <CardDescription>
                  A low-level API for client-side storage of significant amounts of structured data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IndexedDBDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cookies">
            <Card>
              <CardHeader>
                <CardTitle>Cookies API</CardTitle>
                <CardDescription>
                  Manage HTTP cookies for storing small pieces of data that are sent with every request.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CookiesDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cacheStorage">
            <Card>
              <CardHeader>
                <CardTitle>Cache Storage API</CardTitle>
                <CardDescription>
                  Store network requests and responses for offline functionality and performance optimization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CacheStorageDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extension">
            <Card>
              <CardHeader>
                <CardTitle>Extension Storage</CardTitle>
                <CardDescription>
                  Browser extension storage APIs (requires extension context to function properly).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExtensionStorageDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experimental">
            <Card>
              <CardHeader>
                <CardTitle>Experimental APIs</CardTitle>
                <CardDescription>
                  Newer storage and privacy APIs including Private State Tokens, Interest Groups, Shared Storage, and
                  Storage Buckets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExperimentalAPIsDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}
