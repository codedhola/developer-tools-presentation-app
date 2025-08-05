"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, RefreshCw, Database } from "lucide-react"
import toast from "react-hot-toast"

interface DBItem {
  id?: number
  name: string
  data: string
  timestamp: number
}

export function IndexedDBDemo() {
  const [items, setItems] = useState<DBItem[]>([])
  const [newName, setNewName] = useState("")
  const [newData, setNewData] = useState("")
  const [isSupported, setIsSupported] = useState(true)

  const DB_NAME = "StorageDemo"
  const DB_VERSION = 1
  const STORE_NAME = "items"

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
          store.createIndex("name", "name", { unique: false })
        }
      }
    })
  }

  const loadItems = async () => {
    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        setItems(request.result)
      }
    } catch (error) {
      console.error("Failed to load items:", error)
      toast("Failed to load items from IndexedDB")
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!window.indexedDB) {
      setIsSupported(false)
      return
    }

    loadItems()
  }, [])

  const addItem = async () => {
    if (!newName.trim() || !newData.trim()) {
      toast("Both name and data are required")
      return
    }

    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)

      const item: DBItem = {
        name: newName,
        data: newData,
        timestamp: Date.now(),
      }

      await store.add(item)
      setNewName("")
      setNewData("")
      loadItems()

      toast("Item added to IndexedDB")
    } catch (error) {
      toast("Failed to add item to IndexedDB")
    }
  }

  const removeItem = async (id: number) => {
    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)

      await store.delete(id)
      loadItems()

      toast("Item removed from IndexedDB")
    } catch (error) {
      toast("Failed to remove item")
    }
  }

  const clearAll = async () => {
    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)

      await store.clear()
      loadItems()

      toast("All IndexedDB items cleared")
    } catch (error) {
      toast("Failed to clear IndexedDB")
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>IndexedDB is not supported in this browser</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          <div>
            <Label htmlFor="data">Data</Label>
            <Textarea
              id="data"
              value={newData}
              onChange={(e) => setNewData(e.target.value)}
              placeholder="Enter JSON data or any text"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={addItem} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
            <Button onClick={loadItems} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button onClick={clearAll} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">No items in IndexedDB</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ID: {item.id} | {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="mt-2 p-2 bg-muted rounded text-sm font-mono break-all">{item.data}</div>
                    </div>
                    <Button
                      onClick={() => item.id && removeItem(item.id)}
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
    </div>
  )
}
