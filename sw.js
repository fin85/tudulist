const CACHE="tudulist-v2";
const ASSETS=["./","index.html","styles.css","app.js","config.js","manifest.webmanifest"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(Promise.all([clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
self.addEventListener("push",e=>{
  let data={title:"ТудуЛист",body:"Пора выполнить задачу",url:"/"};
  try{data={...data,...e.data.json()}}catch{}
  e.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:"icon.svg",badge:"icon.svg",data:{url:data.url||"/"}}));
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{for(const c of list){if("focus"in c)return c.focus()}return clients.openWindow?clients.openWindow(e.notification.data?.url||"/"):undefined}))});
