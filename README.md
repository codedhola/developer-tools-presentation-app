# Application Developer Tools – Code Snippets

## 1. LocalStorage / SessionStorage / Cookies

```js
// LOCAL STORAGE
localStorage.setItem("user", JSON.stringify({ name: "Hola", role: "admin" }));

const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name);

// SESSION STORAGE
sessionStorage.setItem("user", JSON.stringify({ name: "Hola", role: "admin" }));

const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user.name);

// COOKIES STORAGE
function setCookie(name, value, seconds) {
  let expires = "";
  if (seconds) {
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}

// Example usage
setCookie("myCookie", "HelloCookie", 3600); // Set cookie, expires in 1 hour
console.log("Cookie value:", getCookie("myCookie")); // Get and log cookie value



```

---

## 2. IndexedDB and extension storage

```js

//INDEXEDDB
// Create a database and store data
const request = indexedDB.open("MyDB", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("notes", { keyPath: "id" });
};

request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction("notes", "readwrite");
  tx.objectStore("notes").add({ id: 1, text: "Learn Dev Tools" });
};

// EXTENSION STORAGE *for extensioins*
// SAVE TO LOCAL CHROME STORAGE
function saveLocalData(key, value) {
  chrome.storage.local.set({ [key]: value }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving to local storage:', chrome.runtime.lastError);
    } else {
      console.log(`Saved ${key} to local storage`);
    }
  });
}

function getLocalData(key) {
  chrome.storage.local.get([key], result => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving from local storage:', chrome.runtime.lastError);
    } else {
      console.log(`Retrieved ${key}:`, result[key]);
    }
  });
}

// SAVE TO CHROME SYNCED STORAGE *Syncs data across devices via the user's browser account*
function saveSyncData(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving to sync storage:', chrome.runtime.lastError);
    } else {
      console.log(`Saved ${key} to sync storage`);
    }
  });
}



```

---

## 3. Background Services (Service Worker)

### service-worker.js
```js
self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
```

### main.js
```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
```

---

## 4. Sources Tab (Debugging with Breakpoints)

```js
function fetchUser() {
  const user = { name: "Hola", age: 30 };
  debugger; // <-- DevTools will pause here
  console.log(user);
}
fetchUser();
```

---

## 5. Debugging HTML Pages (Elements Tab)

```html
<!-- Inspect this in DevTools -->
<div id="profile">
  <h1>Hello, Hola!</h1>
</div>
```

```js
const profile = document.getElementById("profile");
console.log(profile.innerHTML); // "Hello, Hola!"
```

---

## 6. CSS Debugging (Styles + Layout Tabs)

```html
<style>
  .box {
    width: 100px;
    height: 100px;
    background: red;
    margin: auto;
  }
</style>

<div class="box"></div>
```

Open DevTools → Inspect Element → Modify box styles live.

---



Cookies are often preferred over LocalStorage for fetching certain types of data, particularly for session management and authentication, due to specific security features and how they interact with the server.
Reasons to use Cookies for fetching over LocalStorage:
Server-Side Accessibility:
Cookies are automatically sent with every HTTP request to the server within the same domain, making them ideal for server-side authentication and session management. LocalStorage data, conversely, is only accessible on the client-side via JavaScript and requires explicit transmission to the server if needed.
Enhanced Security Features:
HttpOnly Flag: When set, this flag prevents client-side JavaScript from accessing the cookie, significantly mitigating the risk of Cross-Site Scripting (XSS) attacks where malicious scripts could otherwise steal session tokens. LocalStorage data is always accessible to JavaScript.
Secure Flag: This flag ensures that cookies are only sent over HTTPS connections, protecting them from interception during transmission over insecure networks.
SameSite Attribute: This attribute helps prevent Cross-Site Request Forgery (CSRF) attacks by controlling when cookies are sent with cross-site requests.
Automatic Expiration and Persistence:
Cookies can be configured with an expiration date, after which they are automatically removed by the browser. While LocalStorage data persists indefinitely unless explicitly cleared by JavaScript or the user, some browsers might clear it after periods of inactivity or when certain privacy settings are enabled.
When LocalStorage might be preferred:
Larger Data Storage:
LocalStorage offers a significantly larger storage capacity (up to 10MB) compared to cookies (4KB per cookie).
Client-Side Only Data:
For data that is exclusively needed on the client-side and does not require server interaction (e.g., user preferences like dark mode, local application state), LocalStorage can be a simpler and more efficient choice as it avoids the overhead of being sent with every HTTP request.