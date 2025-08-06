# Application Developer Tools – Code Snippets

## 1. Application Tab (LocalStorage / SessionStorage / Cookies)

```js
// Save user data in localStorage
localStorage.setItem("user", JSON.stringify({ name: "Hola", role: "admin" }));

// Retrieve it later
const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name); // "Hola"
```

---

## 2. Storage (IndexedDB)

```js
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
