// public/background.js

console.log("✅ Background service worker loaded")

chrome.runtime.onInstalled.addListener(() => {
  console.log("🔧 Extension installed.")
  chrome.storage.local.set({ initialized: true })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStoredData') {
    chrome.storage.local.get(['myData'], (result) => {
      sendResponse({ data: result.myData || null })
    })
    return true // Needed for async response
  }

  if (request.action === 'setStoredData') {
    chrome.storage.local.set({ myData: request.data }, () => {
      sendResponse({ success: true })
    })
    return true
  }
})