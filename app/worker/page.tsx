"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Bell, BellOff, Cpu, Database, Zap } from 'lucide-react'

export default function WorkerApp() {
  const [isOnline, setIsOnline] = useState(true)
  const [swRegistered, setSwRegistered] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [workerResult, setWorkerResult] = useState<string>("")
  const [workerProgress, setWorkerProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cachedData, setCachedData] = useState<any[]>([])
  const [formData, setFormData] = useState({ name: "", message: "" })

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)
          setSwRegistered(true)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }

    // Check online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    // Load cached data
    loadCachedData()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
    }
  }

  const sendNotification = () => {
    if ('serviceWorker' in navigator && swRegistered) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Worker App Notification', {
          body: 'This notification was sent from the service worker!',
          icon: '/placeholder.svg?height=64&width=64',
          badge: '/placeholder.svg?height=32&width=32',
          tag: 'worker-app-notification'
        })
      })
    }
  }

  const startBackgroundWork = () => {
    if (typeof Worker !== 'undefined') {
      setIsProcessing(true)
      setWorkerProgress(0)
      setWorkerResult("")

      const worker = new Worker('/worker.js')
      
      worker.postMessage({ 
        type: 'START_PROCESSING', 
        data: { iterations: 1000000 } 
      })

      worker.onmessage = (e) => {
        const { type, progress, result, error } = e.data
        
        if (type === 'PROGRESS') {
          setWorkerProgress(progress)
        } else if (type === 'COMPLETE') {
          setWorkerResult(result)
          setIsProcessing(false)
          worker.terminate()
        } else if (type === 'ERROR') {
          setWorkerResult(`Error: ${error}`)
          setIsProcessing(false)
          worker.terminate()
        }
      }

      worker.onerror = (error) => {
        setWorkerResult(`Worker error: ${error.message}`)
        setIsProcessing(false)
      }
    }
  }

  const saveData = async () => {
    const data = {
      id: Date.now(),
      name: formData.name,
      message: formData.message,
      timestamp: new Date().toISOString()
    }

    try {
      // Try to save to server first
      if (isOnline) {
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        
        if (response.ok) {
          console.log('Data saved to server')
        }
      }
    } catch (error) {
      console.log('Server unavailable, data will be cached')
    }

    // Always cache locally via service worker
    if ('serviceWorker' in navigator && swRegistered) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CACHE_DATA',
        data: data
      })
    }

    setFormData({ name: "", message: "" })
    loadCachedData()
  }

  const loadCachedData = async () => {
    try {
      const response = await fetch('/api/cached-data')
      if (response.ok) {
        const data = await response.json()
        setCachedData(data)
      }
    } catch (error) {
      console.log('Could not load cached data')
    }
  }

  const clearCache = async () => {
    if ('serviceWorker' in navigator && swRegistered) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CLEAR_CACHE'
      })
      setCachedData([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Worker App Demo</h1>
          <p className="text-gray-600">Demonstrating Service Workers and Web Workers</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection</CardTitle>
              {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
            </CardHeader>
            <CardContent>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Worker</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <Badge variant={swRegistered ? "default" : "secondary"}>
                {swRegistered ? "Registered" : "Not Available"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              {notificationsEnabled ? <Bell className="h-4 w-4 text-green-600" /> : <BellOff className="h-4 w-4 text-gray-400" />}
            </CardHeader>
            <CardContent>
              <Badge variant={notificationsEnabled ? "default" : "secondary"}>
                {notificationsEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="background-work" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="background-work">Background Work</TabsTrigger>
            <TabsTrigger value="offline-data">Offline Data</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="background-work" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Web Worker Processing
                </CardTitle>
                <CardDescription>
                  Perform heavy computations in the background without blocking the UI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={startBackgroundWork} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Start Heavy Computation"}
                </Button>
                
                {isProcessing && (
                  <div className="space-y-2">
                    <Label>Progress: {workerProgress}%</Label>
                    <Progress value={workerProgress} className="w-full" />
                  </div>
                )}
                
                {workerResult && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Result:</strong> {workerResult}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offline-data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Offline Data Storage</CardTitle>
                <CardDescription>
                  Data is cached locally and synced when online
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter a message"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={saveData} className="flex-1">
                    Save Data
                  </Button>
                  <Button onClick={clearCache} variant="outline">
                    Clear Cache
                  </Button>
                </div>

                {cachedData.length > 0 && (
                  <div className="space-y-2">
                    <Label>Cached Data ({cachedData.length} items):</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {cachedData.map((item) => (
                        <div key={item.id} className="p-2 bg-gray-50 rounded text-sm">
                          <strong>{item.name}</strong>: {item.message}
                          <div className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Service worker powered notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!notificationsEnabled && (
                  <Button onClick={requestNotificationPermission} className="w-full">
                    Enable Notifications
                  </Button>
                )}
                
                <Button 
                  onClick={sendNotification} 
                  disabled={!notificationsEnabled || !swRegistered}
                  className="w-full"
                >
                  Send Test Notification
                </Button>
                
                {!swRegistered && (
                  <Alert>
                    <AlertDescription>
                      Service Worker not available. Notifications require HTTPS in production.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
