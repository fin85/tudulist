const CACHE="tudulist-v1";
const ASSETS=["./","index.html","styles.css","app.js","config.js","manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
self.addEventListener("push",e=>{
  let data={title:"ТудуЛист",body:"Пора выполнить задачу"};
  try{data={...data,...e.data.json()}}catch{}
  e.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:"icon.svg",badge:"icon.svg"}));
});
