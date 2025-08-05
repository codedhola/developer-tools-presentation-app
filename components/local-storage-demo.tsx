"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

interface StorageItem {
  key: string
  value: string
}

export function LocalStorageDemo() {
  const [items, setItems] = useState<StorageItem[]>([])
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const loadItems = () => {
    if (typeof window === "undefined") return

    const storageItems: StorageItem[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value !== null) {
          storageItems.push({ key, value })
        }
      }
    }
    setItems(storageItems)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const addItem = () => {
    if (!newKey.trim() || !newValue.trim()) {
      toast("Both key and value are required")
      return
    }

    try {
      localStorage.setItem(newKey, newValue)
      setNewKey("")
      setNewValue("")
      loadItems()
      toast("Item added to localStorage")
    } catch (error) {
      toast("Failed to add item to localStorage")
    }
  }

  const removeItem = (key: string) => {
    try {
      localStorage.removeItem(key)
      loadItems()
      toast("Item removed from localStorage")
    } catch (error) {
      toast("Failed to remove item")
    }
  }

  const clearAll = () => {
    try {
      localStorage.clear()
      loadItems()
      toast("All localStorage items cleared")
    } catch (error) {
      toast("Failed to clear localStorage")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="key">Key</Label>
              <Input id="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Enter key" />
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
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
            <p className="text-muted-foreground">No items in localStorage</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.key}</div>
                    <div className="text-sm text-muted-foreground truncate">{item.value}</div>
                  </div>
                  <Button
                    onClick={() => removeItem(item.key)}
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
    </div>
  )
}
