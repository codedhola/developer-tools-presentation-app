// @ts-nocheck

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, RefreshCw, Archive } from "lucide-react"

interface CacheItem {
  url: string
  method: string
  status: number
  statusText: string
  headers: Record<string, string>
  body?: string
}

export function CacheStorageDemo() {
  const [caches, setCaches] = useState<string[]>([])
  const [selectedCache, setSelectedCache] = useState<string>("")
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([])
  const [newCacheName, setNewCacheName] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newBody, setNewBody] = useState("")
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!("caches" in window)) {
      setIsSupported(false)
      return
    }

    loadCaches()
  }, [])

  const loadCaches = async () => {
    try {
      const cacheNames = await caches.keys()
      setCaches(cacheNames)
      if (cacheNames.length > 0 && !selectedCache) {
        setSelectedCache(cacheNames[0])
      }
    } catch (error) {
      console.error("Failed to load caches:", error)
    }
  }

  const loadCacheItems = async (cacheName: string) => {
    try {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()

      const items: CacheItem[] = []
      for (const request of requests) {
        const response = await cache.match(request)
        if (response) {
          const headers: Record<string, string> = {}
          response.headers.forEach((value, key) => {
            headers[key] = value
          })

          let body: string | undefined
          try {
            const clonedResponse = response.clone()
            body = await clonedResponse.text()
          } catch (e) {
            body = "[Binary data]"
          }

          items.push({
            url: request.url,
            method: request.method,
            status: response.status,
            statusText: response.statusText,
            headers,
            body,
          })
        }
      }

      setCacheItems(items)
    } catch (error) {
      console.error("Failed to load cache items:", error)
      toast({
        title: "Error",
        description: "Failed to load cache items",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (selectedCache) {
      loadCacheItems(selectedCache)
    }
  }, [selectedCache])

  const createCache = async () => {
    if (!newCacheName.trim()) {
      toast({
        title: "Error",
        description: "Cache name is required",
        variant: "destructive",
      })
      return
    }

    try {
      await caches.open(newCacheName)
      setNewCacheName("")
      loadCaches()
      setSelectedCache(newCacheName)

      toast({
        title: "Success",
        description: "Cache created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create cache",
        variant: "destructive",
      })
    }
  }

  const addCacheItem = async () => {
    if (!selectedCache || !newUrl.trim()) {
      toast({
        title: "Error",
        description: "Cache and URL are required",
        variant: "destructive",
      })
      return
    }

    try {
      const cache = await caches.open(selectedCache)
      const response = new Response(newBody || "Cached content", {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "max-age=3600",
        },
      })

      await cache.put(newUrl, response)
      setNewUrl("")
      setNewBody("")
      loadCacheItems(selectedCache)

      toast({
        title: "Success",
        description: "Item added to cache",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cache",
        variant: "destructive",
      })
    }
  }

  const removeFromCache = async (url: string) => {
    if (!selectedCache) return

    try {
      const cache = await caches.open(selectedCache)
      await cache.delete(url)
      loadCacheItems(selectedCache)

      toast({
        title: "Success",
        description: "Item removed from cache",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cache",
        variant: "destructive",
      })
    }
  }

  const deleteCache = async (cacheName: string) => {
    try {
      await caches.delete(cacheName)
      loadCaches()
      if (selectedCache === cacheName) {
        setSelectedCache("")
        setCacheItems([])
      }

      toast({
        title: "Success",
        description: "Cache deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cache",
        variant: "destructive",
      })
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Cache Storage API is not supported in this browser</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cache Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCacheName}
              onChange={(e) => setNewCacheName(e.target.value)}
              placeholder="New cache name"
              className="flex-1"
            />
            <Button onClick={createCache} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Cache
            </Button>
            <Button onClick={loadCaches} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {caches.map((cacheName) => (
              <div key={cacheName} className="flex items-center gap-1">
                <Button
                  onClick={() => setSelectedCache(cacheName)}
                  variant={selectedCache === cacheName ? "default" : "outline"}
                  size="sm"
                >
                  {cacheName}
                </Button>
                <Button
                  onClick={() => deleteCache(cacheName)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCache && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Item to {selectedCache}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/api/data"
              />
            </div>
            <div>
              <Label htmlFor="body">Response Body</Label>
              <Textarea
                id="body"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Response content"
                rows={3}
              />
            </div>
            <Button onClick={addCacheItem} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add to Cache
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedCache && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Items in {selectedCache} ({cacheItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cacheItems.length === 0 ? (
              <p className="text-muted-foreground">No items in this cache</p>
            ) : (
              <div className="space-y-3">
                {cacheItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.url}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.method} • {item.status} {item.statusText}
                        </div>
                        {item.body && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm font-mono break-all max-h-20 overflow-y-auto">
                            {item.body.substring(0, 200)}
                            {item.body.length > 200 && "..."}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => removeFromCache(item.url)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
