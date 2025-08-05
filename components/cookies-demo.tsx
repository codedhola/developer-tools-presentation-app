"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

interface CookieItem {
  name: string
  value: string
  expires?: string
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: string
}

export function CookiesDemo() {
  const [cookies, setCookies] = useState<CookieItem[]>([])
  const [newName, setNewName] = useState("")
  const [newValue, setNewValue] = useState("")
  const [expires, setExpires] = useState("")
  const [path, setPath] = useState("/")
  const [secure, setSecure] = useState(false)
  const [sameSite, setSameSite] = useState("Lax")

  const parseCookies = () => {
    if (typeof document === "undefined") return []

    const cookieString = document.cookie
    if (!cookieString) return []

    return cookieString
      .split(";")
      .map((cookie) => {
        const [name, value] = cookie.trim().split("=")
        return { name: name || "", value: value || "" }
      })
      .filter((cookie) => cookie.name)
  }

  const loadCookies = () => {
    setCookies(parseCookies())
  }

  useEffect(() => {
    loadCookies()
  }, [])

  const addCookie = () => {
    if (!newName.trim() || !newValue.trim()) {
      toast("Both name and value are required")
      return
    }

    try {
      let cookieString = `${newName}=${newValue}`

      if (expires) {
        const expiryDate = new Date()
        expiryDate.setTime(expiryDate.getTime() + Number.parseInt(expires) * 24 * 60 * 60 * 1000)
        cookieString += `; expires=${expiryDate.toUTCString()}`
      }

      if (path) {
        cookieString += `; path=${path}`
      }

      if (secure) {
        cookieString += `; secure`
      }

      cookieString += `; SameSite=${sameSite}`

      document.cookie = cookieString

      setNewName("")
      setNewValue("")
      setExpires("")
      loadCookies()

      toast("Cookie added successfully")
    } catch (error) {
      toast("Failed to add cookie",)
    }
  }

  const removeCookie = (name: string) => {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
      loadCookies()

      toast("Cookie removed successfully")
    } catch (error) {
      toast("Failed to remove cookie")
    }
  }

  const clearAllCookies = () => {
    try {
      cookies.forEach((cookie) => {
        document.cookie = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
      loadCookies()

      toast("All cookies cleared",)
    } catch (error) {
      toast("Failed to clear cookies")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Cookie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cookieName">Name</Label>
              <Input
                id="cookieName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Cookie name"
              />
            </div>
            <div>
              <Label htmlFor="cookieValue">Value</Label>
              <Input
                id="cookieValue"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Cookie value"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expires">Expires (days)</Label>
              <Input
                id="expires"
                type="number"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                placeholder="7"
              />
            </div>
            <div>
              <Label htmlFor="path">Path</Label>
              <Input id="path" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/" />
            </div>
            <div>
              <Label htmlFor="sameSite">SameSite</Label>
              <Select value={sameSite} onValueChange={setSameSite}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strict">Strict</SelectItem>
                  <SelectItem value="Lax">Lax</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="secure" checked={secure} onCheckedChange={(checked) => setSecure(checked as boolean)} />
            <Label htmlFor="secure">Secure (HTTPS only)</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={addCookie} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Cookie
            </Button>
            <Button onClick={loadCookies} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button onClick={clearAllCookies} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Cookies ({cookies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cookies.length === 0 ? (
            <p className="text-muted-foreground">No cookies found</p>
          ) : (
            <div className="space-y-2">
              {cookies.map((cookie, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{cookie.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{cookie.value}</div>
                  </div>
                  <Button
                    onClick={() => removeCookie(cookie.name)}
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
