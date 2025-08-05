"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Puzzle, AlertCircle, Plus, RefreshCw, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface StorageItem {
  key: string
  value: any
}

export function ExtensionStorageDemo() {
  const [isExtensionContext, setIsExtensionContext] = useState(false)
  const [localItems, setLocalItems] = useState<StorageItem[]>([])
  const [syncItems, setSyncItems] = useState<StorageItem[]>([])
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [activeTab, setActiveTab] = useState("local")

  useEffect(() => {
    // Check if we're in an extension context
    const isExtension =
      typeof window !== "undefined" && typeof (window as any).chrome !== "undefined" && (window as any).chrome.storage
    setIsExtensionContext(isExtension)

    if (isExtension) {
      loadStorageItems()
    }
  }, [])

  const loadStorageItems = async () => {
    if (!isExtensionContext || typeof window === "undefined") return

    try {
      const chromeAPI = (window as any).chrome
      // Load local storage
      const localResult = await chromeAPI.storage.local.get(null)
      const localItemsArray = Object.entries(localResult).map(([key, value]) => ({ key, value }))
      setLocalItems(localItemsArray)

      // Load sync storage
      const syncResult = await chromeAPI.storage.sync.get(null)
      const syncItemsArray = Object.entries(syncResult).map(([key, value]) => ({ key, value }))
      setSyncItems(syncItemsArray)
    } catch (error) {
      console.error("Failed to load extension storage:", error)
      toast("Failed to load extension storage")
    }
  }

  const addItem = async () => {
    if (!isExtensionContext || !newKey.trim() || !newValue.trim() || typeof window === "undefined") {
      toast( "Key and value are required")
      return
    }

    try {
      let parsedValue: any
      try {
        parsedValue = JSON.parse(newValue)
      } catch {
        parsedValue = newValue
      }

      const chromeAPI = (window as any).chrome
      const storage = activeTab === "local" ? chromeAPI.storage.local : chromeAPI.storage.sync
      await storage.set({ [newKey]: parsedValue })

      setNewKey("")
      setNewValue("")
      loadStorageItems()

      toast(`Item added to ${activeTab} storage`)
    } catch (error) {
      toast("Failed to add item")
    }
  }

  const removeItem = async (key: string, storageType: "local" | "sync") => {
    if (!isExtensionContext || typeof window === "undefined") return

    try {
      const chromeAPI = (window as any).chrome
      const storage = storageType === "local" ? chromeAPI.storage.local : chromeAPI.storage.sync
      await storage.remove(key)
      loadStorageItems()

      toast(`Item removed from ${storageType} storage`)
    } catch (error) {
      toast("Failed to remove item")
    }
  }

  const clearStorage = async (storageType: "local" | "sync") => {
    if (!isExtensionContext || typeof window === "undefined") return

    try {
      const chromeAPI = (window as any).chrome
      const storage = storageType === "local" ? chromeAPI.storage.local : chromeAPI.storage.sync
      await storage.clear()
      loadStorageItems()

      toast(`${storageType} storage cleared`)
    } catch (error) {
      toast( "Failed to clear storage")
    }
  }

  if (!isExtensionContext) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Extension Storage APIs are only available in browser extension contexts. This demo shows the interface but
            cannot interact with actual extension storage.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Puzzle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Extension Storage Demo</p>
              <p className="text-sm">
                To use extension storage APIs, this code needs to run in a browser extension context with proper
                permissions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extension Storage Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">chrome.storage.local</h4>
                <p className="text-sm text-muted-foreground">
                  Local storage for the extension. Data is stored locally and not synced across devices. Has higher
                  storage limits than sync storage.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">chrome.storage.sync</h4>
                <p className="text-sm text-muted-foreground">
                  Synced storage that follows the user across devices when signed into Chrome. Has lower storage limits
                  but provides cross-device synchronization.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">chrome.storage.session</h4>
                <p className="text-sm text-muted-foreground">
                  Session storage that persists only for the duration of the browser session. Useful for temporary data
                  that shouldn't persist across browser restarts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local">Local Storage</TabsTrigger>
          <TabsTrigger value="sync">Sync Storage</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="extKey">Key</Label>
                <Input id="extKey" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Enter key" />
              </div>
              <div>
                <Label htmlFor="extValue">Value (JSON or string)</Label>
                <Input
                  id="extValue"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addItem} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add to {activeTab} storage
              </Button>
              <Button onClick={loadStorageItems} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={() => clearStorage(activeTab as "local" | "sync")}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear {activeTab}
              </Button>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Local Storage Items ({localItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {localItems.length === 0 ? (
                <p className="text-muted-foreground">No items in local storage</p>
              ) : (
                <div className="space-y-2">
                  {localItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.key}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value)}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeItem(item.key, "local")}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sync Storage Items ({syncItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {syncItems.length === 0 ? (
                <p className="text-muted-foreground">No items in sync storage</p>
              ) : (
                <div className="space-y-2">
                  {syncItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.key}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value)}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeItem(item.key, "sync")}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
